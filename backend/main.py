from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from listing_agent import generate_listing
from reply_agent import generate_reply
from pricing_agent import pricing_agent

from history import (
    get_listing_history,
    get_reply_history,
    get_pricing_history,
)
from router_agent import router_agent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://meesho-seller-copilot.vercel.app",
    ],
    allow_origin_regex=r"https://meesho-seller-copilot-.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/generate")
def listing(product: str, user_id: str):
    return {
        "listing": generate_listing(product, user_id)
    }


@app.get("/reply")
def reply(message: str, user_id: str):
    return {
        "reply": generate_reply(message, user_id)
    }


@app.get("/pricing")
def pricing(product: str, cost_price: float, user_id: str):
    return pricing_agent(product, cost_price, user_id)


@app.get("/history/listings")
def listing_history(user_id: str):
    return get_listing_history(user_id)


@app.get("/history/replies")
def reply_history(user_id: str):
    return get_reply_history(user_id)


@app.get("/history/pricing")
def pricing_history(user_id: str):
    return get_pricing_history(user_id)

@app.get("/router")
def router(query: str):

    return router_agent(query)

@app.get("/dashboard/stats")
def dashboard_stats(user_id: str):

    listings = get_listing_history(user_id)
    pricing = get_pricing_history(user_id)
    replies = get_reply_history(user_id)

    last_activity = "No activity"

    if listings:
        last_activity = listings[0]["created_at"]

    return {
        "total_listings": len(listings),
        "total_pricing": len(pricing),
        "total_replies": len(replies),
        "last_activity": last_activity,
    }