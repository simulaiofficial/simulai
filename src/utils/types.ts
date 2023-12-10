import TextBlock from '@/components/blocks/TextBlock.vue'
import DividerBlock from '@/components/blocks/DividerBlock.vue'
import HeadingBlock from '@/components/blocks/HeadingBlock.vue'
import QuoteBlock from '@/components/blocks/QuoteBlock.vue'
import ConditionBlock from '@/components/blocks/ConditionBlock.vue'
import OptionsBlock from '@/components/blocks/OptionsBlock.vue'
import RadioBlock from '@/components/blocks/RadioBlock.vue'
import InputAnswerBlock from '@/components/blocks/InputAnswerBlock.vue'

export interface Block {
    id: string,
    type: BlockType,
    details: Details,
    isHidden: boolean;
}

export interface BlockAnswer extends Block {
    isRequired: boolean,
    setName: boolean,
    name: string;
}

export interface BlockCondition extends Block {
    whenBlockSelectedId: string,
    isOperatorSelectedId: string,
    isOperatorValue: string,
    actionSelectedId: string,
    actionBlockSelectedId: string
}

export enum ComparisonType {
    Text = 'TEXT',
    Number = 'NUMBER',
    Dropdown = 'DROPDOWN'
}

export enum BlockType {
    Text = 'TEXT',
    H1 = 'H1',
    H2 = 'H2',
    H3 = 'H3',
    Divider = 'DIVIDER',
    Quote = 'QUOTE',
    Condition = 'CONDITION',
    Options = 'OPTIONS',
    Radio = 'RADIO',
    InputEmailAnswer = 'INPUT_EMAIL_ANSWER',
    InputTextAnswer = 'INPUT_TEXT_ANSWER',
    InputNumberAnswer = 'INPUT_NUMBER_ANSWER',
}


export interface BlockText extends Block {
}

export interface BlockHeading extends Block {
}

export interface BlockDivider extends Block {
}

export interface BlockQuote extends Block {
}

export interface BlockOptions extends BlockAnswer {
    items: OptionItem[];
}

export interface BlockRadio extends BlockAnswer {
    items: OptionItem[];
}

export interface BlockInputTextAnswer extends BlockAnswer {
    minRequired: boolean
    min?: number,
    maxRequired: boolean
    max?: number,
}

export interface BlockInputEmailAnswer extends BlockAnswer {
    isCompany: boolean
}

export interface BlockInputNumberAnswer extends BlockAnswer {
    minRequired: boolean
    min?: number,
    maxRequired: boolean
    max?: number,
}

export interface Details {
    value?: string;
    blockTypes?: BlockType[];
}

export interface OptionItem {
    label: string,
    isChecked: boolean
}

export const BlockComponents = {
    [BlockType.Text]: {
        component: TextBlock,
        options: {
            icon: 'bi-text-left',
            label: 'Text',
            setValueDuringTypeConversion: true,
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: false,
            conditionVisible: false,
            comparisons: null,
            comparisonType: null
        },
        funcs: {
            getTitle: (block: BlockText) => block.details.value
        }
    },
    [BlockType.H1]: {
        component: HeadingBlock,
        options: {
            icon: 'bi-type-h1',
            label: 'Heading 1',
            setValueDuringTypeConversion: true,
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: false,
            conditionVisible: false,
            comparisons: null,
            comparisonType: null
        },
        funcs: {
            getTitle: (block: BlockHeading) => block.details.value
        }
    },
    [BlockType.H2]: {
        component: HeadingBlock,
        options: {
            icon: 'bi-type-h2',
            label: 'Heading 2',
            setValueDuringTypeConversion: true,
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: false,
            conditionVisible: false,
            comparisons: null,
            comparisonType: null
        },
        funcs: {
            getTitle: (block: BlockHeading) => block.details.value
        }
    },
    [BlockType.H3]: {
        component: HeadingBlock,
        options: {
            icon: 'bi-type-h3',
            label: 'Heading 3',
            setValueDuringTypeConversion: true,
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: false,
            conditionVisible: false,
            comparisons: null,
            comparisonType: null
        },
        funcs: {
            getTitle: (block: BlockHeading) => block.details.value
        }
    },
    [BlockType.Divider]: {
        component: DividerBlock,
        options: {
            icon: 'bi-hr',
            label: 'Divider',
            setValueDuringTypeConversion: false,
            canSplit: false,
            emojiVisible: false,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: false,
            conditionVisible: false,
            comparisons: null,
            comparisonType: null
        },
        funcs: {
            getTitle: (block: BlockDivider) => '-'
        }
    },
    [BlockType.Quote]: {
        component: QuoteBlock,
        options: {
            icon: 'bi-quote',
            label: 'Quote',
            setValueDuringTypeConversion: true,
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: false,
            conditionVisible: false,
            comparisons: null,
            comparisonType: null
        },
        funcs: {
            getTitle: (block: BlockQuote) => block.details.value
        }
    },
    [BlockType.Condition]: {
        component: ConditionBlock,
        options: {
            icon: 'gi-logic-gate-nor',
            label: 'Condition',
            setValueDuringTypeConversion: false,
            canSplit: false,
            emojiVisible: false,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: false,
            conditionVisible: false,
            comparisons: null,
            comparisonType: null

        },
        funcs: {
            getTitle: (block: BlockCondition) => '-'
        }
    },
    [BlockType.Options]: {
        component: OptionsBlock,
        options: {
            icon: 'md-checkbox-outlined',
            label: 'Options',
            setValueDuringTypeConversion: true,
            canSplit: false,
            emojiVisible: true,
            requiredVisible: true,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: true,
            conditionVisible: true,
            comparisons: [
                {value: 'selected', name: 'Selected'},
            ],
            comparisonType: ComparisonType.Dropdown
        },
        funcs: {
            getTitle: (block: BlockOptions) => {
                if (block.items && block.items.length > 0) {
                    return block.items[0].label
                } else {
                    return '-'
                }
            }
        }
    },
    [BlockType.Radio]: {
        component: RadioBlock,
        options: {
            icon: 'io-radio-button-on-outline',
            label: 'Radio',
            setValueDuringTypeConversion: true,
            canSplit: false,
            emojiVisible: true,
            requiredVisible: true,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: true,
            conditionVisible: true,
            comparisons: [
                {value: 'selected', name: 'Selected'},
            ],
            comparisonType: ComparisonType.Dropdown
        },
        funcs: {
            getTitle: (block: BlockRadio) => {
                if (block.items && block.items.length > 0) {
                    return block.items[0].label
                } else {
                    return '-'
                }
            }
        }
    },
    [BlockType.InputEmailAnswer]: {
        component: InputAnswerBlock,
        options: {
            icon: 'md-alternateemail',
            label: 'Input Email',
            setValueDuringTypeConversion: false,
            canSplit: false,
            emojiVisible: false,
            requiredVisible: true,
            hideVisible: true,
            minVisible: true,
            minLabel: 'Min characters',
            maxVisible: true,
            maxLabel: 'Max characters',
            requiredWorkEmailVisible: true,
            nameVisible: true,
            conditionVisible: true,
            comparisons: [
                {value: '=', name: 'Equal to'},
                {value: '!=', name: 'Not equal to'},
                {value: 'contains', name: 'Contains'},
            ],
            comparisonType: ComparisonType.Text
        },
        funcs: {
            getTitle: (block: BlockInputEmailAnswer) => {
                return '-'
            }
        },


    },
    [BlockType.InputTextAnswer]: {
        component: InputAnswerBlock,
        options: {
            icon: 'co-text-square',
            label: 'Input Text',
            setValueDuringTypeConversion: false,
            canSplit: false,
            emojiVisible: false,
            requiredVisible: true,
            hideVisible: true,
            minVisible: true,
            minLabel: 'Min characters',
            maxVisible: true,
            maxLabel: 'Max characters',
            requiredWorkEmailVisible: false,
            nameVisible: true,
            conditionVisible: true,
            comparisons: [
                {value: '=', name: 'Equal to'},
                {value: '!=', name: 'Not equal to'},
                {value: 'contains', name: 'Contains'},
            ],
            comparisonType: ComparisonType.Text
        },
        funcs: {
            getTitle: (block: BlockInputTextAnswer) => {
                return '-'
            }
        },


    },
    [BlockType.InputNumberAnswer]: {
        component: InputAnswerBlock,
        options: {
            icon: 'oi-number',
            label: 'Input Number',
            setValueDuringTypeConversion: false,
            canSplit: false,
            emojiVisible: false,
            requiredVisible: true,
            hideVisible: true,
            minVisible: true,
            minLabel: 'Min value',
            maxVisible: true,
            maxLabel: 'Max value',
            requiredWorkEmailVisible: false,
            nameVisible: true,
            conditionVisible: true,
            comparisons: [
                {value: '=', name: 'Equal to'},
                {value: '!=', name: 'Not equal to'},
                {value: '>', name: 'Greater than'},
                {value: '<', name: 'Less than'},
            ],
            comparisonType: ComparisonType.Number
        },
        funcs: {
            getTitle: (block: BlockInputNumberAnswer) => {
                return '-'
            }
        },


    },
}

export const textBlockMap = [BlockType.Text, BlockType.Quote]

export const isTextBlock = (type: string) => {
    return textBlockMap.some(textBlock => textBlock === type)
}

export const isFlowBlock = (type: string) => {
    return type !== BlockType.Condition
}

export const getBlockOptions = (block: Block) => {
    return BlockComponents[block.type].options
}

export const getBlockFuncs = (block: Block) => {
    return BlockComponents[block.type].funcs
}
