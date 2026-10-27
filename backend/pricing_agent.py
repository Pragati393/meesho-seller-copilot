import json
import logging
import re
from difflib import SequenceMatcher
from pathlib import Path

from database import supabase
from gemini_client import generate_text

logger = logging.getLogger(__name__)

# A candidate is accepted only with real evidence: at least one keyword hit, or
# a strong whole-name similarity. Otherwise we answer "no similar product"
# instead of silently pricing a laptop bag off a handbag.
MIN_NAME_SIMILARITY = 0.6
KEYWORD_BONUS = 0.2
# A query word counts as a keyword hit if it is this similar (tolerates typos
# such as "kurta" -> "kurti" without matching "xylophone" -> "phone").
KEYWORD_TOKEN_SIMILARITY = 0.8

_DATA_PATH = Path(__file__).parent / "products.json"
with open(_DATA_PATH, "r", encoding="utf-8") as _f:
    dataset = json.load(_f)


class ProductNotFound(Exception):
    pass


def _keyword_hit(keyword: str, tokens) -> bool:
    return any(
        SequenceMatcher(None, token, keyword).ratio() >= KEYWORD_TOKEN_SIMILARITY
        for token in tokens
    )


def find_similar_product(product_name: str, products=None):
    """Best fuzzy match by SequenceMatcher ratio + keyword bonus, or None."""
    products = dataset["products"] if products is None else products
    query = product_name.lower()
    tokens = re.findall(r"[a-z0-9']+", query)

    best_match = None
    best_score = 0.0

    for product in products:
        name_similarity = SequenceMatcher(
            None, query, product["product_name"].lower()
        ).ratio()
        keyword_hits = sum(
            _keyword_hit(keyword.lower(), tokens) for keyword in product["keywords"]
        )

        if keyword_hits == 0 and name_similarity < MIN_NAME_SIMILARITY:
            continue

        score = name_similarity + KEYWORD_BONUS * keyword_hits
        if score > best_score:
            best_score = score
            best_match = product

    return best_match


def compute_prices(meesho_price: float, cost_price: float) -> dict:
    """Pure pricing math (no I/O) so it can be unit-tested."""
    aggressive = round(meesho_price * 0.90, 2)
    balanced = round(meesho_price * 0.95, 2)
    premium = round(meesho_price * 1.05, 2)

    recommended = balanced
    profit = round(recommended - cost_price, 2)
    profit_margin = round((profit / recommended) * 100, 2) if recommended else 0.0

    return {
        "aggressive_price": aggressive,
        "balanced_price": balanced,
        "premium_price": premium,
        "recommended_price": recommended,
        "profit": profit,
        "profit_margin": profit_margin,
    }


def build_prompt(product, cost_price, matched, prices) -> str:
    return f"""
You are an ecommerce pricing expert.

Product: {product}

Cost Price: ₹{cost_price}

Amazon Price: ₹{matched["amazon_price"]}

Flipkart Price: ₹{matched["flipkart_price"]}

Meesho Average: ₹{matched["meesho_avg_price"]}

Aggressive Price: ₹{prices["aggressive_price"]}

Balanced Price: ₹{prices["balanced_price"]}

Premium Price: ₹{prices["premium_price"]}

Profit Margin: {prices["profit_margin"]}%

Generate the response in markdown.

Include:

## Competitor Analysis

## Pricing Strategies

## Final Recommendation

## Expected Sales Impact
"""


def pricing_agent(product: str, cost_price: float, user_id: str) -> dict:
    matched = find_similar_product(product)
    if matched is None:
        raise ProductNotFound(product)

    prices = compute_prices(matched["meesho_avg_price"], cost_price)
    strategy = generate_text(build_prompt(product, cost_price, matched, prices))

    try:
        supabase.table("seller_pricing").insert(
            {
                "user_id": user_id,
                "product_name": product,
                "cost_price": cost_price,
                "recommended_price": prices["recommended_price"],
                "profit": prices["profit"],
                "profit_margin": prices["profit_margin"],
                "strategy": strategy,
            }
        ).execute()
    except Exception:
        logger.exception("Failed to save pricing history")

    return {
        "amazon_price": matched["amazon_price"],
        "flipkart_price": matched["flipkart_price"],
        "meesho_price": matched["meesho_avg_price"],
        **prices,
        "confidence": "📊 Estimated Market Data",
        "strategy": strategy,
    }
