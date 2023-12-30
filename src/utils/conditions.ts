import {Block, BlockCondition, ComparisonsAction, ComparisonsValue} from './types'

export function calculateConditionAction(
    condition: BlockCondition, blocks: Block[]
) {
    debugger;
    const whenSelectedBlock = blocks.find((block) => block.id === condition.whenBlockSelectedId)
    const resultAction = {
        hide: [],
        jump: []
    }
    const isConditionSatisifed = false
    if (condition.isOperatorSelectedId === ComparisonsValue.EqualTo) {

    } else if (condition.isOperatorSelectedId === ComparisonsValue.NotEqualTo) {

    } else if (condition.isOperatorSelectedId === ComparisonsValue.Greater) {

    } else if (condition.isOperatorSelectedId === ComparisonsValue.Less) {

    } else if (condition.isOperatorSelectedId === ComparisonsValue.Contains) {

    } else if (condition.isOperatorSelectedId === ComparisonsValue.Selected) {
        const foundItem = whenSelectedBlock.items.find(item => item.label === condition.isOperatorValue && item.isChecked === true)
        if (foundItem) {
            isConditionSatisifed = true
        }
    }

    if(isConditionSatisifed) {
        if(condition.actionSelectedId === ComparisonsAction.Hide) {
            resultAction.hide = [condition.actionBlockSelectedId]
        } else if(condition.actionSelectedId === ComparisonsAction.Jump) {
            resultAction.jump = [condition.actionBlockSelectedId]
        }
    }

    return resultAction
}