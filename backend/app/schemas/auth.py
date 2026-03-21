from pydantic import BaseModel


class RegisterRequest(BaseModel):
    name: str
    password: str
    role: str  # client / worker
    adress: str


class LoginRequest(BaseModel):
    name: str
    password: str


class AuthResponse(BaseModel):
    token: str
    user_id: int