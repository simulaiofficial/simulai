import {Block, BlockType} from './types'
import Joi from 'joi'

function validateInputFileAnswer(joiValidation, inputValue: string, block: Block) {
    if (joiValidation !== null) return joiValidation

    if (block.type === BlockType.InputFileAnswer) {
        const joiValidation = Joi.string().uri()
        return joiValidation
    }

    return null;
}

function validateInputNumberAnswer(joiValidation, inputValue: string, block: Block) {
    if (joiValidation !== null) return joiValidation

    if (block.type === BlockType.InputNumberAnswer) {
        const joiValidation = Joi.number().integer()
        return joiValidation
    }

    return null;
}

function validateInputDecimalAnswer(joiValidation, inputValue: string, block: Block) {
    if (joiValidation !== null) return joiValidation

    if (block.type === BlockType.InputDecimalAnswer) {
        const joiValidation = Joi.number().precision(2)
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

function validateInputUrlAnswer(joiValidation, inputValue: string, block: Block) {
    if (joiValidation !== null) return joiValidation

    if (block.type === BlockType.InputUrlAnswer) {
        const joiValidation = Joi.string().uri()
        return joiValidation
    }

    return null;
}

function validateInputEmailAnswer(joiValidation, inputValue: string, block: Block) {
    if (joiValidation !== null) return joiValidation

    if (block.type === BlockType.InputEmailAnswer) {
        if (block.isWorkEmailRequired === true) {
            const customEmailValidator = (value, helpers) => {
                const forbiddenDomains = ['gmail.com', 'yahoo.com', 'yahoo.fr', 'clearmailhub.com', 'epicemailpro.com', 'qq.com', 'hotmail.sg', 'outlook.com', 'yandex.ru', 'list.ru', 'mail.ru', 'hotmail.nl', 'yopmail.com', 'hotmail.com.tr'];

                if (forbiddenDomains.some(domain => value.toLowerCase().endsWith(domain))) {
                    return helpers.error('any.invalid', {domain: forbiddenDomains.join(', ')});
                }

                return value;
            };
            const joiValidation = Joi.string().email({tlds: false}).custom(customEmailValidator, 'custom validation');
            return joiValidation
        } else {
            const joiValidation = Joi.string().email({tlds: false})
            return joiValidation
        }
    }

    return null;
}

export function validateBlock(inputValue: string, block: Block | null) {
    if (block === null) {
        return {}
    }

    // Additional condition to pass validation when input is empty and not required
    if (inputValue === '' && !block.isRequired) {
        return {};
    }

    let joiValidation = null;

    joiValidation = validateInputTextAnswer(joiValidation, inputValue, block)
    joiValidation = validateInputUrlAnswer(joiValidation, inputValue, block)
    joiValidation = validateInputNumberAnswer(joiValidation, inputValue, block)
    joiValidation = validateInputEmailAnswer(joiValidation, inputValue, block)
    joiValidation = validateInputFileAnswer(joiValidation, inputValue, block)
    joiValidation = validateInputDecimalAnswer(joiValidation, inputValue, block)

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
        if (block.type === BlockType.InputEmailAnswer && block.isWorkEmailRequired && validationResult.error.toString().indexOf('an invalid value') !== -1) {
            validationResult.error = 'I am sorry, but you need to provide valid work email address';
        } else if(block.type === BlockType.InputUrlAnswer && validationResult.error.toString().indexOf('must be a valid uri') !== -1) {
            validationResult.error = 'I am sorry, but you need to provide valid url link address, which starts with "http://" or "https://"';
        } else {
            validationResult.error = validationResult.error.toString().replace('ValidationError: "value" ', 'Please try again, your answer ')
        }

    }

    return validationResult
}