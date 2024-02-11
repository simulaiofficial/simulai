from typing import List, Optional, Union

from pydantic import BaseModel

from api.model import Block, BlockAnswer, BlockDisplayText, BlockCondition, ActionSelectedType


def find_previous_label(blocks: List[Block], current_idx: int):
    i = current_idx - 1
    previous_label = None
    while i >= 0:
        block_i = blocks[i]
        if isinstance(block_i, BlockDisplayText):
            block_text: BlockDisplayText = block_i
            previous_label = block_text.details.value
            break
        i -= 1

    return previous_label

class TableAnswer(BaseModel):
    label: Optional[str] = None
    value: Optional[Union[str, int, float]] = None

def convert_blocks_to_table_answers(blocks: List[Block]) -> List[TableAnswer]:
    table_answers = []

    for idx, block in enumerate(blocks):
        if not block.isHidden and isinstance(block, BlockAnswer):
            block_answer: BlockAnswer = block  # This is already a BlockAnswer

            if block_answer.setName:
                label = block_answer.name
            else:
                label = find_previous_label(blocks, idx)

            value = block_answer.get_value()

            table_answer = TableAnswer(label=label,value=value)

            table_answers.append(table_answer)

    return table_answers


def calculate_dependent_block_ids(blocks: List[Block]) -> List[str]:
    ids = []

    for idx, block in enumerate(blocks):
        if isinstance(block, BlockCondition):
            block_condition: BlockCondition = block  # This is already a BlockAnswer

            if block_condition.actionSelectedId == ActionSelectedType.Go:
                ids.append(block_condition.actionBlockSelectedId)

    return ids

