import {Block, BlockCondition, ComparisonsAction, ComparisonsValue, ComparisonType, getBlockOptions} from './types'

export const ALWAYS_CONDITION = 'Always'

export function calculateConditionAction(
    condition: BlockCondition, blocks: Block[]
) {
    let isConditionSatisifed = false
    if (condition.whenBlockSelectedId === ALWAYS_CONDITION) {
        isConditionSatisifed = true
    } else {
        const whenSelectedBlock = blocks.find((block) => block.id === condition.whenBlockSelectedId)
        if (!whenSelectedBlock) {
            return resultAction
        }
        const blockOptions = getBlockOptions(whenSelectedBlock)
        if (condition.isOperatorSelectedId === ComparisonsValue.EqualTo) {
            if (whenSelectedBlock.details.value == condition.isOperatorValue) {
                isConditionSatisifed = true
            }
        } else if (condition.isOperatorSelectedId === ComparisonsValue.NotEqualTo) {
            if (whenSelectedBlock.details.value != condition.isOperatorValue) {
                isConditionSatisifed = true
            }
        } else if (condition.isOperatorSelectedId === ComparisonsValue.Greater) {
            if (whenSelectedBlock.details.value > condition.isOperatorValue) {
                isConditionSatisifed = true
            }
        } else if (condition.isOperatorSelectedId === ComparisonsValue.Less) {
            if (whenSelectedBlock.details.value < condition.isOperatorValue) {
                isConditionSatisifed = true
            }
        } else if (condition.isOperatorSelectedId === ComparisonsValue.Contains) {
            if (whenSelectedBlock.details.value && whenSelectedBlock.details.value.includes(condition.isOperatorValue)) {
                isConditionSatisifed = true
            }
        } else if (condition.isOperatorSelectedId === ComparisonsValue.Selected) {
            const foundItem = whenSelectedBlock.items.find(item => item.label === condition.isOperatorValue && item.isChecked === true)
            if (foundItem) {
                isConditionSatisifed = true
            }
        } else if (condition.isOperatorSelectedId === ComparisonsValue.Before) {
            if (blockOptions.comparisonType === ComparisonType.Time) {
                const blockTimeParts = whenSelectedBlock.details.value.split(":");
                const conditionTimeParts = condition.isOperatorValue.split(":");

                const blockHours = parseInt(blockTimeParts[0]);
                const blockMinutes = parseInt(blockTimeParts[1]);

                const conditionHours = parseInt(conditionTimeParts[0]);
                const conditionMinutes = parseInt(conditionTimeParts[1]);

                if (blockHours < conditionHours || (blockHours === conditionHours && blockMinutes < conditionMinutes)) {
                    isConditionSatisifed = true;
                }
            } else {
                const blockDate = new Date(whenSelectedBlock.details.value)
                const conditionDate = new Date(condition.isOperatorValue)

                if (blockDate < conditionDate) {
                    isConditionSatisifed = true
                }
            }
        } else if (condition.isOperatorSelectedId === ComparisonsValue.After) {
            if (blockOptions.comparisonType === ComparisonType.Time) {
                const blockTimeParts = whenSelectedBlock.details.value.split(":");
                const conditionTimeParts = condition.isOperatorValue.split(":");

                const blockHours = parseInt(blockTimeParts[0]);
                const blockMinutes = parseInt(blockTimeParts[1]);

                const conditionHours = parseInt(conditionTimeParts[0]);
                const conditionMinutes = parseInt(conditionTimeParts[1]);

                if (blockHours > conditionHours || (blockHours === conditionHours && blockMinutes > conditionMinutes)) {
                    isConditionSatisifed = true;
                }
            } else {
                const blockDate = new Date(whenSelectedBlock.details.value)
                const conditionDate = new Date(condition.isOperatorValue)

                if (blockDate > conditionDate) {
                    isConditionSatisifed = true
                }
            }
        } else if (condition.isOperatorSelectedId === ComparisonsValue.AtDate) {
            if (blockOptions.comparisonType === ComparisonType.Time) {
                const blockTimeParts = whenSelectedBlock.details.value.split(":");
                const conditionTimeParts = condition.isOperatorValue.split(":");

                const blockHours = parseInt(blockTimeParts[0]);
                const blockMinutes = parseInt(blockTimeParts[1]);

                const conditionHours = parseInt(conditionTimeParts[0]);
                const conditionMinutes = parseInt(conditionTimeParts[1]);

                if (blockHours === conditionHours && blockMinutes === conditionMinutes) {
                    isConditionSatisifed = true;
                }
            } else {
                const blockDate = new Date(whenSelectedBlock.details.value)
                const conditionDate = new Date(condition.isOperatorValue)

                if (blockDate.getTime() === conditionDate.getTime()) {
                    isConditionSatisifed = true
                }
            }
        }
    }

    const resultAction = {
        hide: [],
        jump: null,
        go: null,
        url: null,
    }

    if (isConditionSatisifed) {
        if (condition.actionSelectedId === ComparisonsAction.Hide) {
            resultAction.hide = [condition.actionBlockSelectedId]
        } else if (condition.actionSelectedId === ComparisonsAction.Jump) {
            resultAction.jump = condition.actionBlockSelectedId
        } else if (condition.actionSelectedId === ComparisonsAction.Go) {
            resultAction.go = condition.actionBlockSelectedId
        } else if (condition.actionSelectedId === ComparisonsAction.Url) {
            resultAction.url = condition.actionUrl
        }
    }

    return resultAction
}