import os
from dotenv import load_dotenv
load_dotenv()

class Settings:
    PROJECT_NAME = "AI Complaint Management"
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost/complaintdb")
    SECRET_KEY = os.getenv("SECRET_KEY", "changeme")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY", "")
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")

settings = Settings()
