import logging

from database import supabase
from gemini_client import generate_text

logger = logging.getLogger(__name__)


def build_prompt(product: str) -> str:
    return f"""
Generate:

1. Product Title

2. Product Description

3. Keywords

Product:
{product}
"""


def generate_listing(product: str, user_id: str) -> str:
    listing = generate_text(build_prompt(product))

    # The generated content is the product; a failed history write should not
    # throw it away.
    try:
        supabase.table("seller_listings").insert(
            {"user_id": user_id, "product_name": product, "listing": listing}
        ).execute()
    except Exception:
        logger.exception("Failed to save listing history")

    return listing
