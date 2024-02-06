import TextBlock from '@/components/blocks/TextBlock.vue'
import ConversationBlock from '@/components/blocks/ConversationBlock.vue'
import DividerBlock from '@/components/blocks/DividerBlock.vue'
import HeadingBlock from '@/components/blocks/HeadingBlock.vue'
import QuoteBlock from '@/components/blocks/QuoteBlock.vue'
import ConditionBlock from '@/components/blocks/ConditionBlock.vue'
import OptionsBlock from '@/components/blocks/OptionsBlock.vue'
import RadioBlock from '@/components/blocks/RadioBlock.vue'
import InputAnswerBlock from '@/components/blocks/InputAnswerBlock.vue'
import RangeBlock from '@/components/blocks/RangeBlock.vue'
import CalendarBlock from '@/components/blocks/CalendarBlock.vue'

export interface Block {
    id: string,
    type: BlockType,
    details: Details,
    isHidden?: boolean;
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

export enum ComparisonsValue {
    EqualTo = '=',
    NotEqualTo = '!=',
    Greater = '>',
    Less = '<',
    Contains = 'contains',
    Selected = 'selected'
}

export enum ComparisonsAction {
    Hide = 'hide',
    Jump = 'jump',
}

export enum BlockType {
    Text = 'TEXT',
    ConversationHuman = 'CONVERSATION_HUMAN',
    ConversationBot = 'CONVERSATION_BOT',
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
    InputDecimalAnswer = 'INPUT_DECIMAL_ANSWER',
    InputFileAnswer = 'INPUT_FILE_ANSWER',
    NumberRangeAnswer = 'NUMBER_RANGE_ANSWER',
    CalendarAnswer = 'CALENDAR_ANSWER',
}


export interface BlockText extends Block {
}

export interface BlockConversationBotText extends Block {
}

export interface BlockConversationHumanText extends Block {
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

export interface BlockInputDecimalAnswer extends BlockAnswer {
    minRequired: boolean
    min?: number,
    maxRequired: boolean
    max?: number,
}

export interface BlockInputFileAnswer extends BlockAnswer {
}

export interface BlockNumberRangeAnswer extends BlockAnswer {
}

export interface BlockCalendarAnswer extends BlockAnswer {
    date: string
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
        isMenuVisible: true,
        options: {
            icon: 'bi-text-left',
            label: 'Text',
            isInput: false,
            isNextButton: false,
            isVirtualBlock: false,
            setValueDuringTypeConversion: true,
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            stepVisible: false,
            nameVisible: false,
            conditionVisible: false,
            comparisons: null,
            comparisonType: null
        },
        funcs: {
            getTitle: (block: BlockText) => block.details.value
        }
    },
    [BlockType.ConversationHuman]: {
        component: ConversationBlock,
        isMenuVisible: false,
        options: {
            icon: 'bi-text-left',
            label: 'Conversation Human',
            isInput: false,
            isNextButton: false,
            isVirtualBlock: false,
            setValueDuringTypeConversion: true,
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            stepVisible: false,
            nameVisible: false,
            conditionVisible: false,
            comparisons: null,
            comparisonType: null
        },
        funcs: {
            getTitle: (block: BlockText) => block.details.value
        }
    },
    [BlockType.ConversationBot]: {
        component: ConversationBlock,
        isMenuVisible: false,
        options: {
            icon: 'bi-text-left',
            label: 'Conversation Bot',
            isInput: false,
            isNextButton: false,
            isVirtualBlock: false,
            setValueDuringTypeConversion: true,
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            stepVisible: false,
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
        isMenuVisible: true,
        options: {
            icon: 'bi-type-h1',
            label: 'Heading 1',
            isInput: false,
            isNextButton: false,
            isVirtualBlock: false,
            setValueDuringTypeConversion: true,
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            stepVisible: false,
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
        isMenuVisible: true,
        options: {
            icon: 'bi-type-h2',
            label: 'Heading 2',
            isInput: false,
            isNextButton: false,
            isVirtualBlock: false,
            setValueDuringTypeConversion: true,
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            stepVisible: false,
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
        isMenuVisible: true,
        options: {
            icon: 'bi-type-h3',
            label: 'Heading 3',
            isInput: false,
            isNextButton: false,
            isVirtualBlock: false,
            setValueDuringTypeConversion: true,
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            stepVisible: false,
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
        isMenuVisible: true,
        options: {
            icon: 'bi-hr',
            label: 'Divider',
            isInput: false,
            isNextButton: false,
            isVirtualBlock: false,
            setValueDuringTypeConversion: false,
            canSplit: false,
            emojiVisible: false,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            stepVisible: false,
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
        isMenuVisible: true,
        options: {
            icon: 'bi-quote',
            label: 'Quote',
            isInput: false,
            isNextButton: false,
            isVirtualBlock: false,
            setValueDuringTypeConversion: true,
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            stepVisible: false,
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
        isMenuVisible: true,
        options: {
            icon: 'gi-logic-gate-nor',
            label: 'Condition',
            isInput: false,
            isNextButton: false,
            isVirtualBlock: true,
            setValueDuringTypeConversion: false,
            canSplit: false,
            emojiVisible: false,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            stepVisible: false,
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
        isMenuVisible: true,
        options: {
            icon: 'md-checkbox-outlined',
            label: 'Options',
            isInput: true,
            isNextButton: true,
            isVirtualBlock: false,
            setValueDuringTypeConversion: true,
            canSplit: false,
            emojiVisible: true,
            requiredVisible: true,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            stepVisible: false,
            nameVisible: true,
            conditionVisible: true,
            comparisons: [
                {value: ComparisonsValue.Selected, name: 'Selected'},
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
        isMenuVisible: true,
        options: {
            icon: 'io-radio-button-on-outline',
            label: 'Radio',
            isInput: true,
            isNextButton: true,
            isVirtualBlock: false,
            setValueDuringTypeConversion: true,
            canSplit: false,
            emojiVisible: true,
            requiredVisible: true,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            stepVisible: false,
            nameVisible: true,
            conditionVisible: true,
            comparisons: [
                {value: ComparisonsValue.Selected, name: 'Selected'},
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
        isMenuVisible: true,
        options: {
            icon: 'md-alternateemail',
            label: 'Input Email',
            isInput: true,
            isNextButton: false,
            isVirtualBlock: false,
            setValueDuringTypeConversion: false,
            canSplit: false,
            emojiVisible: false,
            requiredVisible: true,
            hideVisible: true,
            minVisible: true,
            minLabel: 'Min characters',
            maxVisible: true,
            maxLabel: 'Max characters',
            stepVisible: false,
            requiredWorkEmailVisible: true,
            nameVisible: true,
            conditionVisible: true,
            comparisons: [
                {value: ComparisonsValue.EqualTo, name: 'Equal to'},
                {value: ComparisonsValue.NotEqualTo, name: 'Not equal to'},
                {value: ComparisonsValue.Contains, name: 'Contains'},
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
        isMenuVisible: true,
        options: {
            icon: 'co-text-square',
            label: 'Input Text',
            isInput: true,
            isNextButton: false,
            isVirtualBlock: false,
            setValueDuringTypeConversion: false,
            canSplit: false,
            emojiVisible: false,
            requiredVisible: true,
            hideVisible: true,
            minVisible: true,
            minLabel: 'Min characters',
            maxVisible: true,
            maxLabel: 'Max characters',
            stepVisible: false,
            requiredWorkEmailVisible: false,
            nameVisible: true,
            conditionVisible: true,
            comparisons: [
                {value: ComparisonsValue.EqualTo, name: 'Equal to'},
                {value: ComparisonsValue.NotEqualTo, name: 'Not equal to'},
                {value: ComparisonsValue.Contains, name: 'Contains'},
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
        isMenuVisible: true,
        options: {
            icon: 'oi-number',
            label: 'Input Integer Number',
            isInput: true,
            isNextButton: false,
            isVirtualBlock: false,
            setValueDuringTypeConversion: false,
            canSplit: false,
            emojiVisible: false,
            requiredVisible: true,
            hideVisible: true,
            minVisible: true,
            minLabel: 'Min value',
            maxVisible: true,
            maxLabel: 'Max value',
            stepVisible: false,
            requiredWorkEmailVisible: false,
            nameVisible: true,
            conditionVisible: true,
            comparisons: [
                {value: ComparisonsValue.EqualTo, name: 'Equal to'},
                {value: ComparisonsValue.NotEqualTo, name: 'Not equal to'},
                {value: ComparisonsValue.Greater, name: 'Greater than'},
                {value: ComparisonsValue.Less, name: 'Less than'},
            ],
            comparisonType: ComparisonType.Number
        },
        funcs: {
            getTitle: (block: BlockInputNumberAnswer) => {
                return '-'
            }
        },


    },
    [BlockType.InputDecimalAnswer]: {
        component: InputAnswerBlock,
        isMenuVisible: true,
        options: {
            icon: 'oi-number',
            label: 'Input Decimal Number',
            isInput: true,
            isNextButton: false,
            isVirtualBlock: false,
            setValueDuringTypeConversion: false,
            canSplit: false,
            emojiVisible: false,
            requiredVisible: true,
            hideVisible: true,
            minVisible: true,
            minLabel: 'Min value',
            maxVisible: true,
            maxLabel: 'Max value',
            stepVisible: false,
            requiredWorkEmailVisible: false,
            nameVisible: true,
            conditionVisible: true,
            comparisons: [
                {value: ComparisonsValue.Greater, name: 'Greater than'},
                {value: ComparisonsValue.Less, name: 'Less than'},
            ],
            comparisonType: ComparisonType.Number
        },
        funcs: {
            getTitle: (block: BlockInputNumberAnswer) => {
                return '-'
            }
        },


    },
    [BlockType.InputFileAnswer]: {
        component: InputAnswerBlock,
        isMenuVisible: true,
        options: {
            icon: 'bi-upload',
            label: 'Input File',
            isInput: true,
            isNextButton: false,
            isVirtualBlock: false,
            setValueDuringTypeConversion: false,
            canSplit: false,
            emojiVisible: false,
            requiredVisible: true,
            hideVisible: true,
            minVisible: false,
            // minLabel: 'Min value',
            maxVisible: false,
            // maxLabel: 'Max value',
            stepVisible: false,
            requiredWorkEmailVisible: false,
            nameVisible: true,
            conditionVisible: true,
            comparisons: [
            ],
            comparisonType: null
        },
        funcs: {
            getTitle: (block: BlockInputFileAnswer) => {
                return '-'
            }
        },


    },
    [BlockType.NumberRangeAnswer]: {
        component: RangeBlock,
        isMenuVisible: true,
        options: {
            icon: 'bi-plus-slash-minus',
            label: 'Number Range',
            isInput: false,
            isNextButton: true,
            isVirtualBlock: false,
            setValueDuringTypeConversion: false,
            canSplit: false,
            emojiVisible: false,
            requiredVisible: true,
            hideVisible: true,
            minVisible: true,
            minLabel: 'Min',
            maxVisible: true,
            maxLabel: 'Max',
            stepVisible: true,
            requiredWorkEmailVisible: false,
            nameVisible: true,
            conditionVisible: true,
            comparisons: [
                {value: ComparisonsValue.Greater, name: 'Greater than'},
                {value: ComparisonsValue.Less, name: 'Less than'},
            ],
            comparisonType: ComparisonType.Number
        },
        funcs: {
            getTitle: (block: BlockNumberRangeAnswer) => {
                return '-'
            }
        },
    },
    [BlockType.CalendarAnswer]: {
        component: CalendarBlock,
        isMenuVisible: true,
        options: {
            icon: 'bi-calendar-date',
            label: 'Date',
            isInput: false,
            isNextButton: true,
            isVirtualBlock: false,
            setValueDuringTypeConversion: false,
            canSplit: false,
            emojiVisible: false,
            requiredVisible: true,
            hideVisible: true,
            minVisible: true,
            minLabel: 'Min',
            maxVisible: true,
            maxLabel: 'Max',
            stepVisible: false,
            requiredWorkEmailVisible: false,
            nameVisible: true,
            conditionVisible: true,
            comparisons: [
                {value: ComparisonsValue.Greater, name: 'Greater than'},
                {value: ComparisonsValue.Less, name: 'Less than'},
            ],
            comparisonType: ComparisonType.Number
        },
        funcs: {
            getTitle: (block: BlockNumberRangeAnswer) => {
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

export const isConversationBlock = (type: string) => {
    return type === BlockType.ConversationHuman
}

export const isVisibleBlock = (block: Block) => {
    return isFlowBlock(block.type) && !shouldWaitForValueFromInput(block)
}

export const getBlockOptions = (block: Block) => {
    return BlockComponents[block.type].options
}

export const shouldWaitForValueFromInput = (block: Block) => {
    const options = BlockComponents[block.type].options
    return options.isInput && !options.isNextButton
}

export const getBlockFuncs = (block: Block) => {
    return BlockComponents[block.type].funcs
}
