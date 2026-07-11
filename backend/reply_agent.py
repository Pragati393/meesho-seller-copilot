import google.generativeai as genai
from database import supabase

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_reply(message, user_id):

    prompt = f"""
You are a professional Meesho seller.

Write a polite, professional and concise reply.

Customer Message:

{message}
"""

    try:

        response = model.generate_content(prompt)

        supabase.table("seller_replies").insert({

            "user_id": user_id,

            "customer_message": message,

            "reply": response.text

        }).execute()

        return response.text

    except Exception as e:

        print("Reply Agent Error:", e)

        return "⚠️ AI service is temporarily unavailable. Please try again later."