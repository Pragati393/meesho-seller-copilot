from database import supabase


def get_listing_history(user_id):

    response = (
        supabase
        .table("seller_listings")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return response.data


def get_reply_history(user_id):

    response = (
        supabase
        .table("seller_replies")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return response.data


def get_pricing_history(user_id):

    response = (
        supabase
        .table("seller_pricing")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return response.data