import secrets
import hashlib

def hash_password(password: str) -> str:
    """Временное хеширование (не для production!)"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hashlib.sha256(password.encode()).hexdigest() == hashed


def generate_token() -> str:
    return secrets.token_hex(32)