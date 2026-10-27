import logging

from database import supabase
from gemini_client import generate_text

logger = logging.getLogger(__name__)


def build_prompt(message: str) -> str:
    return f"""
You are a professional Meesho seller.

Write a polite, professional and concise reply.

Customer Message:

{message}
"""


def generate_reply(message: str, user_id: str) -> str:
    reply = generate_text(build_prompt(message))

    try:
        supabase.table("seller_replies").insert(
            {"user_id": user_id, "customer_message": message, "reply": reply}
        ).execute()
    except Exception:
        logger.exception("Failed to save reply history")

    return reply
