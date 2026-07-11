
def router_agent(query: str):

    query = query.lower()

    listing_keywords = [
        "listing", "title", "description", "keyword",
        "sell", "product", "catalog"
    ]

    pricing_keywords = [
        "price", "pricing", "profit",
        "margin", "cost", "cheap", "expensive"
    ]

    reply_keywords = [
        "reply", "customer", "complaint",
        "return", "refund", "message", "order"
    ]

    listing_score = sum(word in query for word in listing_keywords)
    pricing_score = sum(word in query for word in pricing_keywords)
    reply_score = sum(word in query for word in reply_keywords)

    scores = {
        "listing": listing_score,
        "pricing": pricing_score,
        "reply": reply_score,
    }

    best_agent = max(scores, key=scores.get)
    best_score = scores[best_agent]

    # Low confidence
    if best_score == 0:
        return {
            "action": "clarify",
            "message": "I'm not sure what you want. Please choose an option.",
            "options": [
                "📦 Generate Product Listing",
                "💰 Pricing Strategy",
                "💬 Customer Reply"
            ]
        }

    # Ambiguous request
    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    highest_score = sorted_scores[0][1]
    second_highest = sorted_scores[1][1]

    if highest_score == second_highest:
       return {
        "action": "clarify",
        "message": "Your request could match multiple agents. Please choose one.",
        "options": [
            "📦 Listing Agent",
            "💰 Pricing Agent",
            "💬 Reply Agent"
        ]
    }

    return {
        "action": "route",
        "agent": best_agent
    }