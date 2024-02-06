from pydantic import BaseModel
from pydantic import root_validator, ValidationError
from enum import Enum
from typing import Optional, List, Union


class BlockType(str, Enum):
    Text = 'TEXT'
    ConversationHuman = 'CONVERSATION_HUMAN'
    ConversationBot = 'CONVERSATION_BOT'
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
    InputDecimalAnswer = 'INPUT_DECIMAL_ANSWER'
    InputFileAnswer = 'INPUT_FILE_ANSWER'
    NumberRangeAnswer = 'NUMBER_RANGE_ANSWER'
    CalendarAnswer = 'CALENDAR_ANSWER'


class ComparisonType(str, Enum):
    Text = 'TEXT'
    Number = 'NUMBER'
    Dropdown = 'DROPDOWN'


class Details(BaseModel):
    value: Optional[Union[str, int, float]] = None
    blockTypes: Optional[List[BlockType]] = None


class Block(BaseModel):
    id: str
    type: BlockType
    details: Details
    isHidden: bool = False


class BlockDisplayText(Block):
    pass


class BlockAnswer(Block):
    isRequired: bool = False
    setName: bool = False
    name: Optional[str] = None

    def get_value(self):
        return self.details.value


class ActionSelectedType(str, Enum):
    Jump = 'jump'
    Hide = 'hide'


class IsOperatorSelectedType(str, Enum):
    Equal = '='
    NotEqual = '!='
    Greater = '>'
    Less = '<'
    Contains = 'contains'
    Selected = 'selected'
    Before = 'before'
    After = 'after'
    AtDate = 'at'


class BlockCondition(Block):
    whenBlockSelectedId: str
    isOperatorSelectedId: IsOperatorSelectedType
    isOperatorValue: Union[str, int]
    actionSelectedId: ActionSelectedType
    actionBlockSelectedId: str

    @root_validator(pre=True)
    def check_type(cls, values):
        if values.get("type") != BlockType.Condition:
            raise ValidationError("Incorrect type")
        return values


class OptionItem(BaseModel):
    label: str
    isChecked: bool


class BlockOptions(BlockAnswer):
    items: List[OptionItem]

    @root_validator(pre=True)
    def check_type(cls, values):
        if values.get("type") != BlockType.Options:
            raise ValidationError("Incorrect type")
        return values

    def get_value(self):
        selected_labels = [item.label for item in self.items if item.isChecked]
        return ', '.join(selected_labels) if selected_labels else None


class BlockRadio(BlockAnswer):
    items: List[OptionItem]

    @root_validator(pre=True)
    def check_type(cls, values):
        if values.get("type") != BlockType.Radio:
            raise ValidationError("Incorrect type")
        return values

    def get_value(self):
        for item in self.items:
            if item.isChecked:
                return item.label
        return None  # Return None if no item is checked


class BlockInputTextAnswer(BlockAnswer):
    minRequired: bool = False
    min: Optional[int] = None
    maxRequired: bool = False
    max: Optional[int] = None

    @root_validator(pre=True)
    def check_type(cls, values):
        if values.get("type") != BlockType.InputTextAnswer:
            raise ValidationError("Incorrect type")
        return values


class BlockInputEmailAnswer(BlockAnswer):
    isWorkEmailRequired: bool = False

    @root_validator(pre=True)
    def check_type(cls, values):
        if values.get("type") != BlockType.InputEmailAnswer:
            raise ValidationError("Incorrect type")
        return values


class BlockInputNumberAnswer(BlockAnswer):
    minRequired: bool = False
    min: Optional[int] = None
    maxRequired: bool = False
    max: Optional[int] = None

    @root_validator(pre=True)
    def check_type(cls, values):
        if values.get("type") != BlockType.InputNumberAnswer:
            raise ValidationError("Incorrect type")
        return values


class BlockInputDecimalAnswer(BlockAnswer):
    minRequired: bool = False
    min: Optional[float] = None
    maxRequired: bool = False
    max: Optional[float] = None

    @root_validator(pre=True)
    def check_type(cls, values):
        if values.get("type") != BlockType.InputDecimalAnswer:
            raise ValidationError("Incorrect type")
        return values


class BlockInputFileAnswer(BlockAnswer):

    @root_validator(pre=True)
    def check_type(cls, values):
        if values.get("type") != BlockType.InputFileAnswer:
            raise ValidationError("Incorrect type")
        return values


class BlockNumberRangeAnswer(BlockAnswer):
    min: int
    max: int
    step: int

    @root_validator(pre=True)
    def check_type(cls, values):
        if values.get("type") != BlockType.NumberRangeAnswer:
            raise ValidationError("Incorrect type")
        return values


class BlockCalendarAnswer(BlockAnswer):
    @root_validator(pre=True)
    def check_type(cls, values):
        if values.get("type") != BlockType.CalendarAnswer:
            raise ValidationError("Incorrect type")
        return values


class BlockHumanConversation(Block):
    @root_validator(pre=True)
    def check_type(cls, values):
        if values.get("type") != BlockType.ConversationHuman:
            raise ValidationError("Incorrect type")
        return values


class BlockBotConversation(Block):
    @root_validator(pre=True)
    def check_type(cls, values):
        if values.get("type") != BlockType.ConversationBot:
            raise ValidationError("Incorrect type")
        return values


class BlockText(BlockDisplayText):
    @root_validator(pre=True)
    def check_type(cls, values):
        if values.get("type") != BlockType.Text:
            raise ValidationError("Incorrect type")
        return values


class BlockHeading(BlockDisplayText):
    @root_validator(pre=True)
    def check_type(cls, values):
        if values.get("type") != BlockType.H1 and values.get("type") != BlockType.H2 and values.get(
                "type") != BlockType.H3:
            raise ValidationError("Incorrect type")
        return values


class BlockDivider(Block):
    @root_validator(pre=True)
    def check_type(cls, values):
        if values.get("type") != BlockType.Divider:
            raise ValidationError("Incorrect type")
        return values


class BlockQuote(BlockDisplayText):
    @root_validator(pre=True)
    def check_type(cls, values):
        if values.get("type") != BlockType.Quote:
            raise ValidationError("Incorrect type")
        return values


class Page(BaseModel):
    name: str
    isChat: bool
    isPreview: bool
    blocks: List[Union[
        Block, BlockAnswer, BlockCondition, BlockOptions, BlockRadio, BlockInputTextAnswer,
        BlockInputEmailAnswer, BlockInputNumberAnswer, BlockInputDecimalAnswer, BlockInputFileAnswer, BlockNumberRangeAnswer,
        BlockCalendarAnswer, BlockText, BlockHeading, BlockDivider, BlockQuote, BlockHumanConversation, BlockBotConversation]]
    saveUrl: str
    uploadUrl: Optional[str] = None


class PageBlocks(BaseModel):
    name: str
    blocks: List[dict]


def get_blocks(page_blocks: PageBlocks) -> (str, List[Block]):
    block_objects = []
    print(page_blocks)
    for json_data in page_blocks.blocks:
        block_type = json_data.get("type")
        if block_type == BlockType.Condition:
            block_objects.append(BlockCondition(**json_data))
        elif block_type == BlockType.Options:
            block_objects.append(BlockOptions(**json_data))
        elif block_type == BlockType.Radio:
            block_objects.append(BlockRadio(**json_data))
        elif block_type == BlockType.InputTextAnswer:
            block_objects.append(BlockInputTextAnswer(**json_data))
        elif block_type == BlockType.InputNumberAnswer:
            block_objects.append(BlockInputNumberAnswer(**json_data))
        elif block_type == BlockType.InputDecimalAnswer:
            block_objects.append(BlockInputDecimalAnswer(**json_data))
        elif block_type == BlockType.InputEmailAnswer:
            block_objects.append(BlockInputEmailAnswer(**json_data))
        elif block_type == BlockType.InputFileAnswer:
            block_objects.append(BlockInputFileAnswer(**json_data))
        elif block_type == BlockType.NumberRangeAnswer:
            block_objects.append(BlockNumberRangeAnswer(**json_data))
        elif block_type == BlockType.CalendarAnswer:
            block_objects.append(BlockCalendarAnswer(**json_data))
        elif block_type == BlockType.H1 or block_type == BlockType.H2 or block_type == BlockType.H3:
            block_objects.append(BlockHeading(**json_data))
        elif block_type == BlockType.Text:
            block_objects.append(BlockText(**json_data))
        elif block_type == BlockType.Divider:
            block_objects.append(BlockDivider(**json_data))
        elif block_type == BlockType.Quote:
            block_objects.append(BlockQuote(**json_data))
        elif block_type == BlockType.ConversationHuman:
            block_objects.append(BlockHumanConversation(**json_data))
        elif block_type == BlockType.ConversationBot:
            block_objects.append(BlockBotConversation(**json_data))
        # Add other conditions for each BlockType
        else:
            raise ValueError("Invalid BlockType")
    return page_blocks.name, block_objects
