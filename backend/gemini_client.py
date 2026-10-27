"""Single place where the Gemini SDK is configured.

Previously each agent built its own model and only listing_agent called
genai.configure(), so reply/pricing worked only because of import order.
"""
import logging
import os

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

MODEL_NAME = "gemini-2.5-flash"
REQUEST_TIMEOUT_SECONDS = 30

_api_key = os.getenv("GEMINI_API_KEY")
if not _api_key:
    logger.warning("GEMINI_API_KEY is not set; AI endpoints will fail.")

genai.configure(api_key=_api_key, transport="rest")
_model = genai.GenerativeModel(MODEL_NAME)


class AIServiceError(Exception):
    """Raised when the Gemini call fails or returns nothing usable."""


def generate_text(prompt: str) -> str:
    try:
        response = _model.generate_content(
            prompt,
            request_options={"timeout": REQUEST_TIMEOUT_SECONDS},
        )
        text = response.text
    except Exception as exc:  # SDK raises many types (quota, timeout, safety block)
        logger.exception("Gemini request failed")
        raise AIServiceError("AI service is temporarily unavailable") from exc

    if not text or not text.strip():
        raise AIServiceError("AI service returned an empty response")
    return text
