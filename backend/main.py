import logging

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from auth import get_current_user_id
from gemini_client import AIServiceError
from history import (
    get_listing_history,
    get_pricing_history,
    get_reply_history,
)
from listing_agent import generate_listing
from pricing_agent import ProductNotFound, pricing_agent
from reply_agent import generate_reply
from router_agent import router_agent

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

app = FastAPI(title="Meesho Seller Co-Pilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://meesho-seller-copilot.vercel.app",
    ],
    allow_origin_regex=r"https://meesho-seller-copilot-.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)


# ---------- request models (validation happens before any paid AI call) ----------

class ListingRequest(BaseModel):
    product: str = Field(min_length=1, max_length=200)


class ReplyRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)


class PricingRequest(BaseModel):
    product: str = Field(min_length=1, max_length=200)
    cost_price: float = Field(gt=0, lt=10_000_000)


def _ai_unavailable(exc: AIServiceError) -> HTTPException:
    return HTTPException(status_code=503, detail=str(exc))


@app.get("/health")
def health():
    return {"status": "ok"}


# ---------- write endpoints: POST, authenticated, tenant = verified token ----------

@app.post("/generate")
def listing(body: ListingRequest, user_id: str = Depends(get_current_user_id)):
    try:
        return {"listing": generate_listing(body.product.strip(), user_id)}
    except AIServiceError as exc:
        raise _ai_unavailable(exc)


@app.post("/reply")
def reply(body: ReplyRequest, user_id: str = Depends(get_current_user_id)):
    try:
        return {"reply": generate_reply(body.message.strip(), user_id)}
    except AIServiceError as exc:
        raise _ai_unavailable(exc)


@app.post("/pricing")
def pricing(body: PricingRequest, user_id: str = Depends(get_current_user_id)):
    try:
        return pricing_agent(body.product.strip(), body.cost_price, user_id)
    except ProductNotFound:
        raise HTTPException(status_code=404, detail="No similar product found.")
    except AIServiceError as exc:
        raise _ai_unavailable(exc)


# ---------- read endpoints: authenticated ----------

@app.get("/history/listings")
def listing_history(user_id: str = Depends(get_current_user_id)):
    return get_listing_history(user_id)


@app.get("/history/replies")
def reply_history(user_id: str = Depends(get_current_user_id)):
    return get_reply_history(user_id)


@app.get("/history/pricing")
def pricing_history(user_id: str = Depends(get_current_user_id)):
    return get_pricing_history(user_id)


@app.get("/dashboard/stats")
def dashboard_stats(user_id: str = Depends(get_current_user_id)):
    listings = get_listing_history(user_id)
    pricing = get_pricing_history(user_id)
    replies = get_reply_history(user_id)

    # Each history list is newest-first, so the head of each is its latest item.
    latest = [rows[0]["created_at"] for rows in (listings, pricing, replies) if rows]
    last_activity = max(latest) if latest else "No activity"

    return {
        "total_listings": len(listings),
        "total_pricing": len(pricing),
        "total_replies": len(replies),
        "last_activity": last_activity,
    }


# ---------- router: stateless, no DB or AI cost, stays public ----------

@app.get("/router")
def router(query: str):
    return router_agent(query)
