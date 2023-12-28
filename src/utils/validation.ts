import {Block, BlockType} from './types'
import Joi from 'joi'

function validateInputNumberAnswer(joiValidation, inputValue: string, block: Block) {
    if (joiValidation !== null) return joiValidation

    if (block.type === BlockType.InputNumberAnswer) {
        const joiValidation = Joi.number().integer()
        return joiValidation
    }

    return null;
}

function validateInputTextAnswer(joiValidation, inputValue: string, block: Block) {
    if (joiValidation !== null) return joiValidation

    if (block.type === BlockType.InputTextAnswer) {
        const joiValidation = Joi.string()
        return joiValidation
    }

    return null;
}

function validateInputEmailAnswer(joiValidation, inputValue: string, block: Block) {
    if (joiValidation !== null) return joiValidation

    if (block.type === BlockType.InputEmailAnswer) {
        const joiValidation = Joi.string().email({tlds: false})
        return joiValidation
    }

    return null;
}

export function validateBlock(inputValue: string, block: Block | null) {
    if (block === null) {
        return {}
    }

    let joiValidation = null;

    joiValidation = validateInputTextAnswer(joiValidation, inputValue, block)
    joiValidation = validateInputNumberAnswer(joiValidation, inputValue, block)
    joiValidation = validateInputEmailAnswer(joiValidation, inputValue, block)

    if (block.isRequired) {
        joiValidation = joiValidation.required()
    }

    if (block.minRequired && block.min) {
        joiValidation = joiValidation.min(block.min)
    }

    if (block.maxRequired && block.max) {
        joiValidation = joiValidation.max(block.max)
    }

    const schema = Joi.object({
        value: joiValidation
    })

    const validationResult = schema.validate({value: inputValue});

    if (validationResult.error) {
        validationResult.error = validationResult.error.toString().replace('ValidationError: "value" ', 'Please try again, your answer ')
    }

    return validationResult
}