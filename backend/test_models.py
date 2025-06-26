from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

# Test the model
test_data = {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "password": "password123"
}

try:
    user = UserCreate(**test_data)
    print("Model validation successful:", user.dict())
except Exception as e:
    print("Model validation failed:", str(e))