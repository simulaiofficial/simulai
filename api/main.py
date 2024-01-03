# main.py
from typing import List
import httpx

from fastapi import FastAPI, Depends
from fastapi import HTTPException
from fastapi import Query
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from api.model import BlockText, BlockType, Details, BlockHeading, BlockDivider, BlockQuote, BlockOptions, BlockRadio, \
    BlockInputTextAnswer, BlockInputEmailAnswer, BlockInputNumberAnswer, OptionItem, Page, BlockCondition, \
    ActionSelectedType, IsOperatorSelectedType, Block, get_blocks, PageBlocks

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Sample instances of each block type
block_text0 = BlockText(id='text0', type=BlockType.Text, details=Details(value='Give me value'),
                        isHidden=False)
block_input_number0 = BlockInputNumberAnswer(id='0', type=BlockType.InputNumberAnswer, details=Details(),
                                             isHidden=False, isRequired=True, setName=True, name='Number Input Block',
                                             minRequired=False, min=None, maxRequired=True, max=100)
block_condition0 = BlockCondition(
    id='con0',
    type=BlockType.Condition,
    details=Details(),
    isHidden=False,
    whenBlockSelectedId='0',  # Assuming the condition depends on the BlockOptions with id '5'
    isOperatorSelectedId=IsOperatorSelectedType.Greater,
    # This is a hypothetical operator ID, replace with actual if different
    isOperatorValue='6',  # The value to compare against, in this case, it could be a selection from BlockOptions
    actionSelectedId=ActionSelectedType.Jump,  # This is a hypothetical action ID, replace with actual if different
    actionBlockSelectedId='text5'  # The id of the block to show/hide, in this case, BlockInputTextAnswer with id '7'
)
block_text = BlockText(id='1', type=BlockType.Text, details=Details(
    value='*Hi* my name is **simulai**. Well, actually I am a bot, which you can build by yourself, using our service https://www.simulai.co to build your **conversational form**'),
                       isHidden=False)
block_heading = BlockHeading(id='2', type=BlockType.H1,
                             details=Details(value='So I am a kind of "**Conversation Form**"'), isHidden=False)
block_divider = BlockDivider(id='3', type=BlockType.Divider, details=Details(), isHidden=False)
block_quote = BlockQuote(id='4', type=BlockType.Quote, details=Details(
    value='"**Conversational Form**" is a type of a web form which is used to chat with users to gather some data from them'),
                         isHidden=False)
block_text1 = BlockText(id='text1', type=BlockType.Text, details=Details(
    value='Do you think that by conversation like that with a bot people may have easier time to share info about themselves?'),
                        isHidden=False)
block_radio = BlockRadio(id='6', type=BlockType.Radio, details=Details(), isHidden=False, isRequired=False,
                         setName=True, name='Radio Block',
                         items=[OptionItem(label='Yes', isChecked=False), OptionItem(label='No', isChecked=True)])
block_text2 = BlockText(id='text2', type=BlockType.Text,
                        details=Details(value='What type of form you used in the past?'), isHidden=False)
block_options = BlockOptions(id='5', type=BlockType.Options, details=Details(), isHidden=False, isRequired=True,
                             setName=False, name='Options Block', items=[OptionItem(label='Web Form', isChecked=False),
                                                                         OptionItem(label='Conversational Form',
                                                                                    isChecked=True)])
block_condition = BlockCondition(
    id='10',
    type=BlockType.Condition,
    details=Details(),
    isHidden=False,
    whenBlockSelectedId='5',  # Assuming the condition depends on the BlockOptions with id '5'
    isOperatorSelectedId=IsOperatorSelectedType.Selected,
    # This is a hypothetical operator ID, replace with actual if different
    isOperatorValue='Conversational Form',
    # The value to compare against, in this case, it could be a selection from BlockOptions
    actionSelectedId=ActionSelectedType.Jump,  # This is a hypothetical action ID, replace with actual if different
    actionBlockSelectedId='text5'  # The id of the block to show/hide, in this case, BlockInputTextAnswer with id '7'
)
block_text3 = BlockText(id='text3', type=BlockType.Text, details=Details(value='Btw. what is your name?'),
                        isHidden=False)
block_input_text = BlockInputTextAnswer(id='7', type=BlockType.InputTextAnswer, details=Details(), isHidden=False,
                                        isRequired=True, setName=True, name='Text Input Block', minRequired=True, min=2,
                                        maxRequired=False, max=None)
block_text4 = BlockText(id='text4', type=BlockType.Text, details=Details(value='and your email?'), isHidden=False)
block_input_email = BlockInputEmailAnswer(id='8', type=BlockType.InputEmailAnswer, details=Details(), isHidden=False,
                                          isRequired=False, setName=False, name='Email Input Block', isCompany=True)
block_text5 = BlockText(id='text5', type=BlockType.Text,
                        details=Details(value='could you share also your phone number?'), isHidden=False)
block_input_number = BlockInputNumberAnswer(id='9', type=BlockType.InputNumberAnswer, details=Details(), isHidden=False,
                                            isRequired=True, setName=True, name='Number Input Block', minRequired=False,
                                            min=None, maxRequired=True, max=100)
block_text_finish = BlockText(id='10', type=BlockType.Text, details=Details(value='That\'s all, thanks!'),
                              isHidden=False)

# Creating the sample page with all block types
sample_page = Page(
    name="🤖 simulai",
    isChat=True,
    blocks=[
        block_text0, block_input_number0, block_condition0,
        block_text, block_heading, block_divider, block_quote, block_text1,
        block_radio, block_text2, block_options, block_condition, block_text3, block_input_text, block_text4,
        block_input_email, block_text5, block_input_number, block_text_finish
    ],
    saveUrl='http://127.0.0.1:8000/save'
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


class CoreRequest(BaseModel):
    src: str
    dst: str


@app.post("/core", response_model=Page)
async def get_core(request_data: CoreRequest):
    src = request_data.src
    dst = request_data.dst

    print("Source URL:", src)
    print("Destination URL:", dst)

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
        raise HTTPException(status_code=e.response.status_code, detail=f"Error response {e.response.status_code} while requesting {src}")

    # Deserialize the JSON page
    page_object = deserialize_page(json_page)

    return page_object


@app.post("/save")
async def save_data(blocks: List[Block] = Depends(get_blocks)):
    print(blocks)
    return


@app.get("/src")
async def get_src():
    # Sample response data
    json_page = jsonable_encoder(sample_page)
    return json_page


@app.get("/dst")
async def get_dst():
    # Sample response data
    response_data = {"message": "This is the src endpoint", "data": "Sample data from src"}
    return response_data
