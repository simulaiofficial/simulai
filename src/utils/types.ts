import TextBlock from '@/components/blocks/TextBlock.vue'
import DividerBlock from '@/components/blocks/DividerBlock.vue'
import HeadingBlock from '@/components/blocks/HeadingBlock.vue'
import QuoteBlock from '@/components/blocks/QuoteBlock.vue'
import OptionsBlock from '@/components/blocks/OptionsBlock.vue'
import RadioBlock from '@/components/blocks/RadioBlock.vue'
import InputTextAnswerBlock from '@/components/blocks/InputTextAnswerBlock.vue'

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

export enum BlockType {
    Text = 'TEXT',
    H1 = 'H1',
    H2 = 'H2',
    H3 = 'H3',
    Divider = 'DIVIDER',
    Quote = 'QUOTE',
    Options = 'OPTIONS',
    Radio = 'RADIO',
    InputTextAnswer = 'INPUT_TEXT_ANSWER'
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
    minChars: number,
    maxRequired: boolean
    maxChars: number,
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
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: false,
            conditionVisible: false,
        }
    },
    [BlockType.H1]: {
        component: HeadingBlock,
        options: {
            icon: 'bi-type-h1',
            label: 'Heading 1',
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: false,
            conditionVisible: false,
        }
    },
    [BlockType.H2]: {
        component: HeadingBlock,
        options: {
            icon: 'bi-type-h2',
            label: 'Heading 2',
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: false,
            conditionVisible: false,
        }
    },
    [BlockType.H3]: {
        component: HeadingBlock,
        options: {
            icon: 'bi-type-h3',
            label: 'Heading 3',
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: false,
            conditionVisible: false,
        }
    },
    [BlockType.Divider]: {
        component: DividerBlock,
        options: {
            icon: 'bi-hr',
            label: 'Divider',
            canSplit: false,
            emojiVisible: false,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: false,
            conditionVisible: false,
        }
    },
    [BlockType.Quote]: {
        component: QuoteBlock,
        options: {
            icon: 'bi-quote',
            label: 'Quote',
            canSplit: true,
            emojiVisible: true,
            requiredVisible: false,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: false,
            conditionVisible: false,
        }
    },
    [BlockType.Options]: {
        component: OptionsBlock,
        options: {
            icon: 'md-checkbox-outlined',
            label: 'Options',
            canSplit: false,
            emojiVisible: true,
            requiredVisible: true,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: true,
            conditionVisible: true,
        }
    },
    [BlockType.Radio]: {
        component: RadioBlock,
        options: {
            icon: 'io-radio-button-on-outline',
            label: 'Radio',
            canSplit: false,
            emojiVisible: true,
            requiredVisible: true,
            hideVisible: true,
            minVisible: false,
            maxVisible: false,
            nameVisible: true,
            conditionVisible: true,
        }
    },
    [BlockType.InputTextAnswer]: {
        component: InputTextAnswerBlock,
        options: {
            icon: 'co-text-square',
            label: 'Input Text Answer',
            canSplit: false,
            emojiVisible: false,
            requiredVisible: true,
            hideVisible: true,
            minVisible: true,
            maxVisible: true,
            nameVisible: true,
            conditionVisible: true,
        }
    },
}

export const textBlockMap = [BlockType.Text, BlockType.Quote]

export const isTextBlock = (type: string) => {
    return textBlockMap.some(textBlock => textBlock === type)
}
