"""API tests: authentication, tenant isolation, validation, error mapping."""
from unittest.mock import patch

from conftest import make_user
from gemini_client import AIServiceError


def _auth(token="valid-token"):
    return {"Authorization": f"Bearer {token}"}


# ---------- authentication ----------

def test_history_requires_token(client):
    assert client.get("/history/listings").status_code == 401


def test_invalid_token_rejected(client, supabase_mock):
    supabase_mock.auth.get_user.side_effect = Exception("bad jwt")
    r = client.get("/history/listings", headers=_auth("garbage"))
    assert r.status_code == 401


def test_client_supplied_user_id_is_ignored(client, supabase_mock):
    """The core multi-tenancy guarantee: ?user_id=victim must not be honoured."""
    supabase_mock.auth.get_user.return_value = make_user("alice")
    chain = supabase_mock.table.return_value.select.return_value.eq
    chain.return_value.order.return_value.execute.return_value.data = []

    r = client.get("/history/listings?user_id=victim", headers=_auth())

    assert r.status_code == 200
    chain.assert_called_once_with("user_id", "alice")


def test_generate_stores_row_under_verified_user(client, supabase_mock):
    supabase_mock.auth.get_user.return_value = make_user("alice")
    with patch("listing_agent.generate_text", return_value="TITLE..."):
        r = client.post("/generate", json={"product": "cotton kurti"}, headers=_auth())

    assert r.status_code == 200
    assert r.json() == {"listing": "TITLE..."}
    inserted = supabase_mock.table.return_value.insert.call_args.args[0]
    assert inserted["user_id"] == "alice"


# ---------- validation ----------

def test_generate_rejects_empty_product(client, supabase_mock):
    supabase_mock.auth.get_user.return_value = make_user("alice")
    r = client.post("/generate", json={"product": ""}, headers=_auth())
    assert r.status_code == 422


def test_pricing_rejects_non_positive_cost(client, supabase_mock):
    supabase_mock.auth.get_user.return_value = make_user("alice")
    r = client.post(
        "/pricing", json={"product": "kurti", "cost_price": 0}, headers=_auth()
    )
    assert r.status_code == 422


def test_writes_are_not_reachable_via_get(client):
    assert client.get("/generate?product=x").status_code == 405


# ---------- error mapping ----------

def test_ai_failure_returns_503_not_200(client, supabase_mock):
    supabase_mock.auth.get_user.return_value = make_user("alice")
    with patch("reply_agent.generate_text", side_effect=AIServiceError("down")):
        r = client.post("/reply", json={"message": "where is my order"}, headers=_auth())
    assert r.status_code == 503


def test_unknown_product_returns_404(client, supabase_mock):
    supabase_mock.auth.get_user.return_value = make_user("alice")
    r = client.post(
        "/pricing", json={"product": "zzzqqq xylophone", "cost_price": 100}, headers=_auth()
    )
    assert r.status_code == 404


def test_router_is_public(client):
    assert client.get("/router?query=refund complaint").status_code == 200


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}
