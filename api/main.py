# main.py
import json

import httpx
from fastapi import FastAPI, Depends
from fastapi import HTTPException
from fastapi import Request
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware

from api.blocks_processing import convert_blocks_to_table_answers, calculate_dependent_block_ids
from api.model import get_blocks, Page, PageBlocks
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
    workspace_bots_json = json_page.get('workspaceBots', [])
    # Create a PageBlocks instance from the blocks JSON
    page_blocks = PageBlocks(name="", avatarUrl=None, blocks=blocks_json)
    # Use get_blocks to deserialize the blocks
    name, avatar_url, deserialized_blocks = get_blocks(page_blocks)
    # Replace the blocks list in json_page with the deserialized blocks
    json_page['blocks'] = deserialized_blocks

    for workspace_bot_json in workspace_bots_json:
        bot_page_blocks = PageBlocks(name="", avatarUrl=None, blocks=workspace_bot_json['blocks'])
        print('Processing:', workspace_bot_json['name'])
        n, avatar_url, deserialized_bot_blocks = get_blocks(bot_page_blocks)
        workspace_bot_json['blocks'] = deserialized_bot_blocks

    json_page['workspaceBots'] = workspace_bots_json

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

@app.post("/save")
async def save_data(dst: str, pay = Depends(get_blocks)):
    name, avatar_url, blocks = pay

    print("Payload:", blocks)
    print("Destination URL:", dst)
    print("Avatar URL", avatar_url)
    print("Name:", name)

    table_answers = convert_blocks_to_table_answers(blocks)
    dependent_ids = calculate_dependent_block_ids(blocks)

    save_data = {
        'name': name,
        'blocks': blocks,
        'avatar_url': avatar_url,
        'table_answers': table_answers,
        'dependent_ids': dependent_ids
    }

    json_blocks_result = jsonable_encoder(save_data)
    json_blocks_result = json.dumps(json_blocks_result)

    try:
        timeout = httpx.Timeout(10.0, connect=5.0)
        headers = {'Content-Type': 'application/json'}
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(dst, content=json_blocks_result, headers=headers)

        if response.status_code == 400:
            raise HTTPException(status_code=400, detail=response.text)

        if response.status_code == 409:
            raise HTTPException(status_code=409, detail=response.text)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to post data to dst URL")

        return response.json()

    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while posting to {dst}: {str(e)}")


# Following endpoints should be endpoints for some external service
# from which we get blocks configuration (src) and where we save final blocks (dst)
# these endpoints are here just for demonstration purposes

@app.get("/src/{uuid}")
async def get_src(uuid: str):
    # Sample response data
    json_page = jsonable_encoder(get_sample_page())
    return json_page


@app.post("/dst")
async def get_dst(request: Request):
    # Parse the request body as JSON
    data = await request.json()

    print("Received data:", data)

    return {"publishUrl": "http://127.0.0.1:5173/published/1234",
            "previewUrl": "http://127.0.0.1:5173/preview/1234"}

@app.get("/health")
async def get_health():
    return "OK"
