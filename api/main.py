# main.py
from typing import List

import httpx
from fastapi import FastAPI, Depends
from fastapi import Request
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from api.model import Block, get_blocks, Page, PageBlocks
from api.sample import get_sample_page

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


def deserialize_page(json_page):
    # Extract the blocks JSON
    blocks_json = json_page.get('blocks', [])
    # Create a PageBlocks instance from the blocks JSON
    page_blocks = PageBlocks(blocks=blocks_json)
    # Use get_blocks to deserialize the blocks
    deserialized_blocks = get_blocks(page_blocks)
    # Replace the blocks list in json_page with the deserialized blocks
    json_page['blocks'] = deserialized_blocks
    page_object = Page(**json_page)
    return page_object

@app.get("/page", response_model=Page)
async def get_page(src: str):
    print("Source URL:", src)

    try:
        # Set a timeout for the request
        timeout = httpx.Timeout(10.0, connect=5.0)
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.get(src)

        # Check if the response was successful
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Failed to fetch data from src URL: {src}")

        json_page = response.json()

    except httpx.RequestError as e:
        # Handle connection errors
        raise HTTPException(status_code=500, detail=f"An error occurred while requesting {src}: {str(e)}")

    except httpx.HTTPStatusError as e:
        # Handle HTTP status errors
        raise HTTPException(status_code=e.response.status_code,
                            detail=f"Error response {e.response.status_code} while requesting {src}")

    # Deserialize the JSON page
    page_object = deserialize_page(json_page)

    return page_object


class BlocksData(BaseModel):
    blocks: List[Block]


@app.post("/save")
async def save_data(dst: str, blocks: List[Block] = Depends(get_blocks)):
    print("Destination URL:", dst)
    blocks_data = BlocksData(blocks=blocks)
    json_blocks = blocks_data.json()
    print(json_blocks)

    try:
        timeout = httpx.Timeout(10.0, connect=5.0)
        headers = {'Content-Type': 'application/json'}
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(dst, content=json_blocks, headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to post data to dst URL")

        return response.json()

    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while posting to {dst}: {str(e)}")


# Following endpoints should be endpoints for some external service
# from which we get blocks configuration (src) and where we save final blocks (dst)
# these endpoints are here just for demonstration purposes

@app.get("/src")
async def get_src():
    # Sample response data
    json_page = jsonable_encoder(get_sample_page())
    return json_page


@app.post("/dst")
async def get_dst(request: Request):
    # Parse the request body as JSON
    data = await request.json()

    print("Received data:", data)

    return {"message": "Data received successfully", "received_data": data}
