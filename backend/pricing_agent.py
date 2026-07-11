import json
from difflib import SequenceMatcher

import google.generativeai as genai

from database import supabase

# Gemini Model
model = genai.GenerativeModel("gemini-2.5-flash")

# Load Dataset
with open("products.json", "r") as file:
    dataset = json.load(file)


def find_similar_product(product_name):

    best_match = None
    best_score = 0

    for product in dataset["products"]:

        score = SequenceMatcher(
            None,
            product_name.lower(),
            product["product_name"].lower()
        ).ratio()

        for keyword in product["keywords"]:
            if keyword.lower() in product_name.lower():
                score += 0.2

        if score > best_score:
            best_score = score
            best_match = product

    return best_match


def pricing_agent(product, cost_price, user_id):

    matched = find_similar_product(product)

    if not matched:
        return {
            "error": "No similar product found."
        }

    amazon_price = matched["amazon_price"]
    flipkart_price = matched["flipkart_price"]
    meesho_price = matched["meesho_avg_price"]

    aggressive_price = round(meesho_price * 0.90, 2)
    balanced_price = round(meesho_price * 0.95, 2)
    premium_price = round(meesho_price * 1.05, 2)

    recommended_price = balanced_price

    profit = round(recommended_price - cost_price, 2)

    profit_margin = round(
        (profit / recommended_price) * 100,
        2
    )

    prompt = f"""
You are an ecommerce pricing expert.

Product: {product}

Cost Price: ₹{cost_price}

Amazon Price: ₹{amazon_price}

Flipkart Price: ₹{flipkart_price}

Meesho Average: ₹{meesho_price}

Aggressive Price: ₹{aggressive_price}

Balanced Price: ₹{balanced_price}

Premium Price: ₹{premium_price}

Profit Margin: {profit_margin}%

Generate the response in markdown.

Include:

## Competitor Analysis

## Pricing Strategies

## Final Recommendation

## Expected Sales Impact
"""
    try:

        response = model.generate_content(prompt)

        supabase.table("seller_pricing").insert({

            "user_id": user_id,

            "product_name": product,

            "cost_price": cost_price,

            "recommended_price": recommended_price,

            "profit": profit,

            "profit_margin": profit_margin,

            "strategy": response.text

        }).execute()

        return {

            "amazon_price": amazon_price,

            "flipkart_price": flipkart_price,

            "meesho_price": meesho_price,

            "aggressive_price": aggressive_price,

            "balanced_price": balanced_price,

            "premium_price": premium_price,

            "recommended_price": recommended_price,

            "profit": profit,

            "profit_margin": profit_margin,

            "confidence": "📊 Estimated Market Data",

            "strategy": response.text

        }

    except Exception as e:

        print("Pricing Agent Error:", e)

        return {

            "error": "AI service is temporarily unavailable. Please try again later."

        }