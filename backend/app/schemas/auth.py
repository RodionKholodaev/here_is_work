from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    email: EmailStr  
    password: str
    name: str
    role: str
    address: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    token: str
    user_id: int