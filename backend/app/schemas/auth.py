from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    email: EmailStr  # Pydantic сам проверит формат name@domain.com
    password: str
    name: str
    role: str
    address: str

# class RegisterRequest(BaseModel):
#     name: str
#     password: str
#     role: str  # client / worker
#     adress: str


class LoginRequest(BaseModel):
    name: str
    password: str


class AuthResponse(BaseModel):
    token: str
    user_id: int