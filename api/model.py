from pydantic import BaseModel
from enum import Enum
from typing import Optional, List, Union

class BlockType(str, Enum):
    Text = 'TEXT'
    H1 = 'H1'
    H2 = 'H2'
    H3 = 'H3'
    Divider = 'DIVIDER'
    Quote = 'QUOTE'
    Condition = 'CONDITION'
    Options = 'OPTIONS'
    Radio = 'RADIO'
    InputEmailAnswer = 'INPUT_EMAIL_ANSWER'
    InputTextAnswer = 'INPUT_TEXT_ANSWER'
    InputNumberAnswer = 'INPUT_NUMBER_ANSWER'

class ComparisonType(str, Enum):
    Text = 'TEXT'
    Number = 'NUMBER'
    Dropdown = 'DROPDOWN'

class Details(BaseModel):
    value: Optional[str] = None
    blockTypes: Optional[List[BlockType]] = None

class Block(BaseModel):
    id: str
    type: BlockType
    details: Details
    isHidden: bool

class BlockAnswer(Block):
    isRequired: bool
    setName: bool
    name: str

class BlockCondition(Block):
    whenBlockSelectedId: str
    isOperatorSelectedId: str
    isOperatorValue: str
    actionSelectedId: str
    actionBlockSelectedId: str

class OptionItem(BaseModel):
    label: str
    isChecked: bool

class BlockOptions(BlockAnswer):
    items: List[OptionItem]

class BlockRadio(BlockAnswer):
    items: List[OptionItem]

class BlockInputTextAnswer(BlockAnswer):
    minRequired: bool
    min: Optional[int]
    maxRequired: bool
    max: Optional[int]

class BlockInputEmailAnswer(BlockAnswer):
    isCompany: bool

class BlockInputNumberAnswer(BlockAnswer):
    minRequired: bool
    min: Optional[int]
    maxRequired: bool
    max: Optional[int]

# Other Block types
class BlockText(Block):
    pass

class BlockHeading(Block):
    pass

class BlockDivider(Block):
    pass

class BlockQuote(Block):
    pass

class Page(BaseModel):
    name: str
    blocks: List[Block]
