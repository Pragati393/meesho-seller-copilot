"""Test setup: replace the real Supabase client and Gemini model with fakes so
tests run offline with no credentials."""
import os
import sys
import types
from pathlib import Path
from unittest.mock import MagicMock

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

os.environ.setdefault("GEMINI_API_KEY", "test-key")

# Fake `database` module so importing the app never creates a real client.
_fake_db = types.ModuleType("database")
_fake_db.supabase = MagicMock(name="supabase")
sys.modules["database"] = _fake_db


@pytest.fixture(autouse=True)
def no_real_gemini_calls(monkeypatch):
    """Safety net: any test that forgets to mock Gemini fails fast, offline."""
    import gemini_client

    def _blocked(*args, **kwargs):
        raise RuntimeError("Gemini must be mocked in tests")

    monkeypatch.setattr(gemini_client._model, "generate_content", _blocked)


@pytest.fixture
def supabase_mock():
    mock = _fake_db.supabase
    mock.reset_mock(return_value=True, side_effect=True)
    return mock


@pytest.fixture
def client(supabase_mock):
    from fastapi.testclient import TestClient

    from main import app

    return TestClient(app)


def make_user(user_id: str):
    result = MagicMock()
    result.user.id = user_id
    return result
