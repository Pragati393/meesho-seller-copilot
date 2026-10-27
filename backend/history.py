from database import supabase


def _history(table: str, user_id: str):
    response = (
        supabase.table(table)
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return response.data


def get_listing_history(user_id: str):
    return _history("seller_listings", user_id)


def get_reply_history(user_id: str):
    return _history("seller_replies", user_id)


def get_pricing_history(user_id: str):
    return _history("seller_pricing", user_id)
