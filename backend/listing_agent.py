import os
from dotenv import load_dotenv
import google.generativeai as genai
from database import supabase

load_dotenv()
print("Gemini Key Loaded:", os.getenv("GEMINI_API_KEY"))

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")
def generate_listing(product, user_id):

    print("Generating listing...")

    prompt = f"""
Generate:

1. Product Title

2. Product Description

3. Keywords

Product:
{product}
"""

    try:

        response = model.generate_content(prompt)

        print("Gemini response received")

        supabase.table("seller_listings").insert({

            "user_id": user_id,
            "product_name": product,
            "listing": response.text

        }).execute()

        print("Saved to Supabase")

        return response.text

    except Exception as e:

        print("ERROR:", e)

        return f"Error: {str(e)}"