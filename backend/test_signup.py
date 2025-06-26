import requests
import json

# Test signup
signup_data = {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "password": "password123"
}

# First, try to signup
print("Testing signup...")
response = requests.post(
    "http://localhost:8000/api/v1/auth/signup",
    json=signup_data
)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")

if response.status_code == 201:
    print("\nSignup successful! Now testing login...")
    
    # Test login
    login_data = {
        "username": signup_data["email"],
        "password": signup_data["password"]
    }
    
    response = requests.post(
        "http://localhost:8000/api/v1/auth/login",
        data=login_data  # Note: using data, not json for form data
    )
    
    print(f"Login Status Code: {response.status_code}")
    print(f"Login Response: {response.text}")