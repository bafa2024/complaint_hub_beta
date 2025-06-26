# backend/app/websocket.py
from fastapi import WebSocket

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Handle real-time updates
            await websocket.send_text(f"Message: {data}")
    except WebSocketDisconnect:
        pass