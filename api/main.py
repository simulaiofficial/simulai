# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from uuid import uuid4
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class Block(BaseModel):
    id: str
    type: str
    details: dict

class Page(BaseModel):
    name: str
    blocks: list[Block]

# Sample data to return
sample_data = Page(
    name='🤖 simulai',
    blocks=[
        {"id": str(uuid4()), "type": "H1", "details": {"value": 'Get Started'}},
        # Add more blocks as needed
    ]
)

@app.post("/data")
async def get_data():
    return sample_data
