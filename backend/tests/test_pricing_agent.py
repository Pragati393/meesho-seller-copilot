import pytest

from pricing_agent import compute_prices, find_similar_product


def test_compute_prices_tiers():
    p = compute_prices(meesho_price=500, cost_price=300)
    assert p["aggressive_price"] == 450.0
    assert p["balanced_price"] == 475.0
    assert p["premium_price"] == 525.0
    assert p["recommended_price"] == 475.0


def test_compute_prices_profit_and_margin():
    p = compute_prices(meesho_price=500, cost_price=300)
    assert p["profit"] == 175.0
    assert p["profit_margin"] == pytest.approx(36.84, abs=0.01)


def test_negative_profit_when_cost_exceeds_price():
    p = compute_prices(meesho_price=100, cost_price=200)
    assert p["profit"] < 0
    assert p["profit_margin"] < 0


def test_exact_name_matches():
    assert find_similar_product("Women Cotton Kurti")["product_name"] == "Women Cotton Kurti"


def test_fuzzy_and_keyword_match():
    assert find_similar_product("cotton kurti")["product_name"] == "Women Cotton Kurti"
    assert find_similar_product("bluetooth earbuds black")["product_name"] == "Bluetooth Earbuds"


def test_typo_still_matches_via_keyword_similarity():
    assert find_similar_product("kurta")["product_name"] == "Women Cotton Kurti"


def test_unrelated_products_return_none():
    assert find_similar_product("zzzqqq xylophone") is None  # contains "phone" as a substring only
    assert find_similar_product("garden hose pipe") is None
