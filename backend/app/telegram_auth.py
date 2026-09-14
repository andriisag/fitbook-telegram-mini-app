import hashlib
import hmac
import json
from urllib.parse import parse_qsl

from fastapi import HTTPException

from app.config import settings


def validate_telegram_init_data(init_data: str) -> dict:
    try:
        parsed_data = dict(parse_qsl(init_data, strict_parsing=True))
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Telegram init data.",
        )

    received_hash = parsed_data.pop("hash", None)

    if not received_hash:
        raise HTTPException(
            status_code=401,
            detail="Telegram hash is missing.",
        )

    data_check_string = "\n".join(
        f"{key}={value}"
        for key, value in sorted(parsed_data.items())
    )

    secret_key = hmac.new(
        b"WebAppData",
        settings.telegram_bot_token.encode(),
        hashlib.sha256,
    ).digest()

    calculated_hash = hmac.new(
        secret_key,
        data_check_string.encode(),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(calculated_hash, received_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid Telegram signature.",
        )

    user_data = parsed_data.get("user")

    if not user_data:
        raise HTTPException(
            status_code=401,
            detail="Telegram user is missing.",
        )

    try:
        return json.loads(user_data)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Telegram user data.",
        )