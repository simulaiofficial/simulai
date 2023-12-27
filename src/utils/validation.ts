import {Block, BlockType} from './types'
import Joi from 'joi'

export function validateBlock(inputValue: string, block: Block | null) {
    debugger;

    if(block === null) {
        return {}
    }

    let joiValidation = Joi.string()

    if(block.type === BlockType.InputNumberAnswer) {
        joiValidation = joiValidation.pattern(/^[0-9]+$/)
    }

    if(block.type === BlockType.InputEmailAnswer) {
        joiValidation = joiValidation.email({tlds: false})
    }

    if(block.isRequired) {
        joiValidation = joiValidation.required()
    }

    if(block.minRequired && block.min) {
        joiValidation = joiValidation.min(block.min)
    }

    if(block.maxRequired && block.max) {
        joiValidation = joiValidation.max(block.max)
    }

    const schema = Joi.object({
        value: joiValidation
    })

    const validationResult = schema.validate({value: inputValue});

    return validationResult
}