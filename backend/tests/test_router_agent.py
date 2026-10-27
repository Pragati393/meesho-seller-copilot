import pytest

from router_agent import router_agent


@pytest.mark.parametrize(
    "query, agent",
    [
        ("Generate a listing title for a cotton kurti", "listing"),
        ("What price and profit margin should I keep", "pricing"),
        ("Customer sent a refund complaint, write a reply", "reply"),
    ],
)
def test_routes_clear_intent(query, agent):
    result = router_agent(query)
    assert result == {"action": "route", "agent": agent}


def test_no_keyword_match_asks_for_clarification():
    result = router_agent("hello there")
    assert result["action"] == "clarify"
    assert len(result["options"]) == 3


def test_tie_between_agents_asks_for_clarification():
    # one pricing keyword + one reply keyword
    result = router_agent("price refund")
    assert result["action"] == "clarify"


def test_is_case_insensitive():
    assert router_agent("PRICING and MARGIN")["agent"] == "pricing"
