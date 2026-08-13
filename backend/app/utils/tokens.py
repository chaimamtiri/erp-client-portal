from itsdangerous import URLSafeTimedSerializer
from flask import current_app

def generate_reset_token(user_id: int) -> str:
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(user_id, salt='password-reset')


def verify_reset_token(token: str, max_age: int = 3600) -> int | None:
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        return serializer.loads(token, salt='password-reset', max_age=max_age)
    except Exception:
        return None