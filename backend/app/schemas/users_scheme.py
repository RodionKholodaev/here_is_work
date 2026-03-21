from pydantic import BaseModel, EmailStr

class UserScheme(BaseModel):
    email: EmailStr  
    name: str
    role: str
    address: str

class UserAddress(BaseModel):
    address: str