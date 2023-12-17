# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.model import BlockText, BlockType, Details, BlockHeading, BlockDivider, BlockQuote, BlockOptions, BlockRadio, \
    BlockInputTextAnswer, BlockInputEmailAnswer, BlockInputNumberAnswer, OptionItem, Page, BlockCondition, \
    ActionSelectedType, IsOperatorSelectedType

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


# Sample instances of each block type
block_text = BlockText(id='1', type=BlockType.Text, details=Details(value='Text Example'), isHidden=False)
block_heading = BlockHeading(id='2', type=BlockType.H1, details=Details(value='Heading Example'), isHidden=False)
block_divider = BlockDivider(id='3', type=BlockType.Divider, details=Details(), isHidden=False)
block_quote = BlockQuote(id='4', type=BlockType.Quote, details=Details(value='Quote Example'), isHidden=False)
block_options = BlockOptions(id='5', type=BlockType.Options, details=Details(), isHidden=False, isRequired=True, setName=False, name='Options Block', items=[OptionItem(label='Option 1', isChecked=False), OptionItem(label='Option 2', isChecked=True)])
block_condition = BlockCondition(
    id='10',
    type=BlockType.Condition,
    details=Details(),
    isHidden=False,
    whenBlockSelectedId='5',  # Assuming the condition depends on the BlockOptions with id '5'
    isOperatorSelectedId=IsOperatorSelectedType.Selected,  # This is a hypothetical operator ID, replace with actual if different
    isOperatorValue='Option 2',  # The value to compare against, in this case, it could be a selection from BlockOptions
    actionSelectedId=ActionSelectedType.Hide,  # This is a hypothetical action ID, replace with actual if different
    actionBlockSelectedId='7'  # The id of the block to show/hide, in this case, BlockInputTextAnswer with id '7'
)
block_radio = BlockRadio(id='6', type=BlockType.Radio, details=Details(), isHidden=False, isRequired=False, setName=True, name='Radio Block', items=[OptionItem(label='Radio 1', isChecked=False), OptionItem(label='Radio 2', isChecked=True)])
block_input_text = BlockInputTextAnswer(id='7', type=BlockType.InputTextAnswer, details=Details(), isHidden=False, isRequired=True, setName=True, name='Text Input Block', minRequired=True, min=1, maxRequired=False, max=None)
block_input_email = BlockInputEmailAnswer(id='8', type=BlockType.InputEmailAnswer, details=Details(), isHidden=False, isRequired=False, setName=False, name='Email Input Block', isCompany=True)
block_input_number = BlockInputNumberAnswer(id='9', type=BlockType.InputNumberAnswer, details=Details(), isHidden=False, isRequired=True, setName=True, name='Number Input Block', minRequired=False, min=None, maxRequired=True, max=100)
block_text_finish = BlockText(id='10', type=BlockType.Text, details=Details(value='Finish'), isHidden=False)

# Creating the sample page with all block types
sample_page = Page(
    name="🤖 simulai",
    isChat=True,
    blocks=[
        block_text, block_heading, block_divider, block_quote,
        block_options, block_condition,
        block_radio, block_input_text, block_input_email, block_input_number, block_text_finish
    ]
)

@app.post("/data", response_model=Page)
async def get_data():
    print(sample_page)
    return sample_page
