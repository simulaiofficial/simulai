import {Block, BlockAnswer, BlockComponents} from './types'

export function markdownToHtml(mdString: string) {
    // Adapted from https://randyperkins2k.medium.com/writing-a-simple-markdown-parser-using-javascript-1f2e9449a558
    return mdString
        .replace(/\\\*/g, '\\*\\*')
        // .replace(/_p/g, '<p>')
        // .replace(/p_/g, '</p>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replaceAll('\\<em>\\</em>', '*')
        // .replace(/(?<!\\)\*(?<!\\)\*(.*?)(?<!\\)\*(?<!\\)\*/g, '<strong>$1</strong>')
        // .replace(/(?<!\\)\*(.*?)(?<!\\)\*/g, '<em>$1</em>')
        // .replace(/\\\*/g, '*')
        .trim()
}

export function htmlToMarkdown(htmlString: string) {
    return htmlString
        .replaceAll('<p>', '')
        .replaceAll('</p>', '')
        .replaceAll('<strong>', '**')
        .replaceAll('</strong>', '**')
        .replaceAll('<em>', '*')
        .replaceAll('</em>', '*')
        .replaceAll(/\<br.*?\>/g, '')
}

export function setUpInitialValuesForBlock(block: Block) {
    block.isHidden = false
}


export function setUpInitialValuesForBlockAnswer(block: BlockAnswer) {
    block.isRequired = true
    block.setName = false
}

export function unsetInitialValuesForBlockAnswer(block: BlockAnswer) {
    delete block.isRequired
    delete block.setName
    delete block.name
}
