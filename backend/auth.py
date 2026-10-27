"""JWT verification for Supabase Auth.

The frontend sends `Authorization: Bearer <supabase access token>`. We ask
Supabase Auth to validate it and use the returned user id as the tenant id.
The client never supplies a user_id, so one seller cannot read another's data.
"""
import logging

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from database import supabase

logger = logging.getLogger(__name__)

_bearer = HTTPBearer(auto_error=False)


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> str:
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        result = supabase.auth.get_user(credentials.credentials)
        user = result.user if result else None
    except Exception:
        logger.info("Token validation failed", exc_info=True)
        user = None

    if user is None or not getattr(user, "id", None):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return str(user.id)
