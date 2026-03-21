from pydantic import BaseModel, EmailStr
from datetime import time
class UserScheme(BaseModel):
    email: EmailStr  
    name: str
    role: str
    address: str

class UserAddress(BaseModel):
    address: str

class WorkerScheme(BaseModel):
    address: str
    work_radius: int
    available_from: time
    available_to: time
    is_active: bool
