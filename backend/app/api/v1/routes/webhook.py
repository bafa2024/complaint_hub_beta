from fastapi import APIRouter

router = APIRouter()

@router.post("/voice/{provider}")
def handle_voice_webhook(provider: str):
    return {"message": f"Received voice webhook from {provider}"}

@router.post("/chat/{channel}")
def handle_chat_webhook(channel: str):
    return {"message": f"Received chat webhook from {channel}"}
