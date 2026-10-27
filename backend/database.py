import os

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set (see .env.example)")

# Service-role client: bypasses RLS, so every query MUST filter by the
# user id verified in auth.get_current_user_id (never a client-supplied id).
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
