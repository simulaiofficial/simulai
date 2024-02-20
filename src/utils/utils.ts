import {Block, BlockAnswer, BlockComponents} from './types'

// export function markdownToHtml(mdString: string) {
//     // Adapted from https://randyperkins2k.medium.com/writing-a-simple-markdown-parser-using-javascript-1f2e9449a558
//
//     // Regular expression to match URLs
//     // const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
//     const urlRegex = /(?:^|[^'"])(\b(?:https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
//
//     return mdString
//         .replace(/\\\*/g, '\\*\\*')
//         // .replace(/_p/g, '<p>')
//         // .replace(/p_/g, '</p>')
//         .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//         .replace(/\*(.*?)\*/g, '<em>$1</em>')
//         .replaceAll('\\<em>\\</em>', '*')
//         // .replace(/(?<!\\)\*(?<!\\)\*(.*?)(?<!\\)\*(?<!\\)\*/g, '<strong>$1</strong>')
//         // .replace(/(?<!\\)\*(.*?)(?<!\\)\*/g, '<em>$1</em>')
//         // .replace(/\\\*/g, '*')
//         .replace(urlRegex, '<a href="$1" rel="nofollow">$1</a>') // Replace URLs with anchor tags
//         .trim()
// }
export function markdownToHtml(mdString: string) {
    // Regular expression to match URLs and Markdown links
    // const linkRegex = /(?:^|[^'"])(\[(.*?)\]\((.*?)\)|\b(?:https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
    const linkRegex = /(?:^|[^)\]])(\[(.*?)\]\((.*?)\)|\b(?:https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;


    return mdString
        .replace(/\\\*/g, '\\*\\*')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replaceAll('\\<em>\\</em>', '*')
        .replace(linkRegex, (match, p1, p2, p3) => {
            if (p2 && p3) {
                return ` <a href="${p3}" rel="nofollow">${p2}</a> `;
            } else {
                return `<a href="${match}" rel="nofollow">${match}</a>`;
            }
        }) // Replace URLs and Markdown links with anchor tags
        .trim()
}

//
// export function htmlToMarkdown(htmlString: string) {
//     debugger;
//     // Regular expression to match HTML anchor tags
//     const anchorRegex = /<a href="([^"]+)"[^>]*>(.*?)<\/a>/gi;
//
//     return htmlString
//         .replace(anchorRegex, '$1') // Convert anchor tags to Markdown link syntax
//         .replaceAll('<p>', '')
//         .replaceAll('</p>', '')
//         .replaceAll('<strong>', '**')
//         .replaceAll('</strong>', '**')
//         .replaceAll('<em>', '*')
//         .replaceAll('</em>', '*')
//         .replaceAll(/\<br.*?\>/g, '')
// }

export function htmlToMarkdown(htmlString: string) {
    // Regular expression to match HTML anchor tags with and without href attribute
    const anchorRegex = /<a(?:\s+[^>]*)?\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi;
    const enclosedAnchorRegex = /\((<a\s+[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>)\)/gi;

    return htmlString
        .replace(enclosedAnchorRegex, '($2)') // Convert anchor tags to Markdown link syntax
        .replace(anchorRegex, '[$2]($1)') // Convert anchor tags to Markdown link syntax
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
    block.isHidden = false
}

export function unsetInitialValuesForBlockAnswer(block: BlockAnswer) {
    delete block.isRequired
    delete block.setName
    delete block.name
    delete block.items
    delete block.isCompany
    delete block.minRequired
    delete block.maxRequired
    delete block.max
    delete block.min
}
