<template>
  <div :class="{
         'simulai max-w-screen-md mx-auto my-12 font-sans text-base p-5': !props.page.isChat,
         'simulai max-w-screen-md mx-auto font-sans text-base p-5 h-screen flex flex-col justify-between': props.page.isChat
       }" v-if="props.page" ref="editor"
       @keydown.ctrl.cmd.space.prevent="openEmojiPicker">
    <h1 id="title" ref="title" :contenteditable="true" spellcheck="false" data-ph="Untitled"
        @keydown.enter.prevent="splitTitle"
        @keydown.down="blockElements[0]?.moveToFirstLine(); scrollIntoView();"
        @blur="props.page.name=($event.target as HTMLElement).innerText.replace('\n', '')"
        class="focus:outline-none focus-visible:outline-none text-5xl font-bold mb-12"
        :class="props.page.name ? '' : 'empty'">
      {{ props.page.name || '' }}
    </h1>
    <draggable ref="blocks" id="blocks" tag="div" :list="props.page.blocks" handle=".handle"
               v-bind="dragOptions"
               :class="{
         '-ml-24 space-y-2 pb-4': !props.page.isChat,
         'flex-grow overflow-y-auto space-y-1 pb-4 max-h-[calc(100vh-5rem)]': props.page.isChat
       }"
    >
        <div v-for="block, i in props.page.blocks" :key="i">
          <div v-if="checkIfBlockShouldBeVisible(i)" :class="{ 'pt-1': props.page.isChat }">
            <div v-if="props.page.isChat && isBotVisibleBlock(block, i)"
                 class="flex align-items-start rounded-md mt-1"
                 :class="{ 'opacity-50 pointer-events-none': false }">
              <span class="text-xl mr-2">🤖</span><span class="text-sm font-bold">simulai</span>
            </div>

            <div v-if="props.page.isChat && isYouVisibleBlock(block, i)"
                 class="flex align-items-start rounded-md mt-1"
                 :class="{ 'opacity-50 pointer-events-none': false }">
              <span class="text-xl mr-2">👀</span><span class="text-sm font-bold">You</span>
            </div>
            <div :class="{ 'pl-7': props.page.isChat }">
              <BlockComponent :block="block" :id="'block-'+block.id"
                              :blockTypes="props.blockTypes"
                              :blockNumber="i+1"
                              :currentBlockNumber="currentVisibleBlock"
                              :page="props.page"
                              :readonly="checkIfBlockShouldBeReadonly(block, i)"
                              :ref="el => blockElements[i] = (el as unknown as typeof Block)"
                              :style="{backgroundColor: props.bgColor}"
                              :bgColor="props.bgColor"
                              @deleteBlock="deleteBlock(i)"
                              @duplicateBlock="duplicateBlock(i)"
                              @newBlock="insertBlock(i)"
                              @addBlock="type => addBlock(i, type)"
                              @moveToPrevChar="blockElements[i-1]?.moveToEnd(); scrollIntoView();"
                              @moveToNextChar="blockElements[i+1]?.moveToStart(); scrollIntoView();"
                              @moveToPrevLine="handleMoveToPrevLine(i)"
                              @moveToNextLine="blockElements[i+1]?.moveToFirstLine(); scrollIntoView();"
                              @merge="merge(i)"
                              @split="split(i)"
                              @setBlockType="type => setBlockType(i, type)"
                              @openEmoji="openEmoji"
                              @nextBlock="goNextBlock"
              />
            </div>
          </div>
        </div>
    </draggable>
    <div>
      <transition name="fade">
        <ChatInput ref="chatInput" v-if="page.isChat && !isConversationFinished" :bgColor="props.bgColor" @nextBlock="handleChatInput"/>
      </transition>
    </div>
  </div>
  <EmojiPicker v-if="isEmojiPickerOpen" ref="emojiPicker" :native="true" @select="onSelectEmoji"
               :style="{ top: emojiPickerStyle.top + 'px', left: emojiPickerStyle.left + 'px' }" class="absolute z-50"/>
</template>

<script setup lang="ts">
import {ref, onBeforeUpdate, PropType, onMounted, nextTick} from 'vue'
import {VueDraggableNext as draggable} from 'vue-draggable-next'
import {v4 as uuidv4} from 'uuid'
import {
  Block,
  BlockType,
  isTextBlock,
  isConversationBlock,
  BlockComponents,
  getBlockOptions,
  shouldWaitForValueFromInput, isVisibleBlock
} from '@/utils/types'
import {htmlToMarkdown} from '@/utils/utils'
import BlockComponent from './Block.vue'
import ChatInput from './elements/ChatInput.vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import cloneDeep from 'lodash/cloneDeep';
import {computed, watch} from 'vue'

const props = defineProps({
  page: {
    type: Object as PropType<{ name: string, isChat: boolean, blocks: Block[] }>,
    required: true,
  },
  bgColor: {
    type: String,
    required: true
  },
  textColor: {
    type: String,
    required: true
  },
  blockTypes: {
    type: Object as PropType<null | (string | BlockType)[]>,
    default: null,
  },
  onSetAll: {
    type: Function as PropType<(block: Block) => void>,
  },
  onUnsetAll: {
    type: Function as PropType<(block: Block) => void>,
  },
  onCreateBlock: {
    type: Function as PropType<(block: Block) => void>,
  },
  onDeleteBlock: {
    type: Function as PropType<(block: Block) => void>,
  },
})

const editor = ref<HTMLDivElement | null>(null)
const blocks = ref<HTMLDivElement | null>(null)

const emojiPicker = ref<HTMLDivElement | null>(null);
const isEmojiPickerOpen = ref(false);
const emojiPickerStyle = ref({top: 0, left: 0});
const savedCaretPosition = ref(null);
const chatInput = ref(null);
const mousePosition = {x: 0, y: 0}

const currentVisibleBlock = ref(null);
const visibleBlocksSeq = [];
const isConversationFinished = ref(false);

function showNextBlock() {
  if (props.page.blocks.length === 0) {
    setTimeout(() => showNextBlock(), 1000)
    return
  }

  if (currentVisibleBlock.value == props.page.blocks.length - 1) {
    isConversationFinished.value = true;
    return
  }

  if (currentVisibleBlock.value === null) {
    currentVisibleBlock.value = 0
    scrollToBottom()
  } else {
    currentVisibleBlock.value += 1
    scrollToBottom()
  }

  const currentBlock = props.page.blocks[currentVisibleBlock.value]

  if (!currentBlock) {
    return
  }

  if (isVisibleBlock(currentBlock)) {
    visibleBlocksSeq.push(currentBlock)
  }

  if (currentBlock && !getBlockOptions(currentBlock).isInput) {
    const timeout = getBlockOptions(currentBlock).isVirtualBlock ? 0 : 1000;
    setTimeout(() => {
      showNextBlock()
    }, timeout)
  }
}

function getPreviousVisibleBlock(block: Block) {
  const indexOfBlock = visibleBlocksSeq.indexOf(block)
  if (indexOfBlock === -1 || indexOfBlock === 0) {
    return null
  } else {
    return visibleBlocksSeq[indexOfBlock - 1]
  }
}

function isBotVisibleBlock(block: Block, i: number) {
  const previousBlock = getPreviousVisibleBlock(block)
  if (!previousBlock) {
    return true
  }
  const isVisible = isVisibleBlock(block) && !isConversationBlock(block.type) && (i === 0 || isConversationBlock(previousBlock.type))
  return isVisible
}

function isYouVisibleBlock(block: Block, i: number) {
  const previousBlock = getPreviousVisibleBlock(block)
  if (!previousBlock) {
    return false
  }
  const isVisible = isVisibleBlock(block) && isConversationBlock(block.type) && (i === 0 || !isConversationBlock(previousBlock.type))
  return isVisible
}

function goNextBlock() {
  showNextBlock()
  const currentBlock = props.page.blocks[currentVisibleBlock.value]
  if (chatInput.value && shouldWaitForValueFromInput(currentBlock)) {
    chatInput.value.focusInput()
  }
}

function handleChatInput(inputValue) {
  const conversationBlock = {
    id: uuidv4(),
    type: BlockType.ConversationHuman,
    details: {
      value: inputValue
    },
  }
  props.page.blocks.splice(currentVisibleBlock.value + 1, 0, conversationBlock);
  showNextBlock()
  const currentBlock = props.page.blocks[currentVisibleBlock.value]
  if (chatInput.value && shouldWaitForValueFromInput(currentBlock)) {
    chatInput.value.focusInput()
  }
}

document.addEventListener('mousemove', function (mouseMoveEvent) {
  mousePosition.x = mouseMoveEvent.pageX;
  mousePosition.y = mouseMoveEvent.pageY;
}, false);

document.addEventListener('click', (event) => {
  if (isEmojiPickerOpen.value === true) {
    const isClickInsideEmojiPicker = emojiPicker.value.$el.contains(event.target);
    // let isClickInsideEmojiPicker = false

    if (!isClickInsideEmojiPicker) {
      // Clicked outside EmojiPicker, close it or perform your action
      isEmojiPickerOpen.value = false;
    }
  }
});

document.addEventListener('mouseup', (event: MouseEvent) => {
  // Automatically focus on nearest block on click
  const blocks = document.getElementById('blocks')
  const title = document.getElementById('title')
  const editorRect = editor.value?.getClientRects()[0]
  if (!blocks || !title || !editorRect) {
    return
  }
  // Check that click is outside Editor
  if ((event.clientX < ((editorRect as DOMRect).left || -1)) || (event.clientX > (editorRect?.right || window.innerWidth))) {
    // Focus on title
    const titleRect = title?.getClientRects()[0]
    if (event.clientY > (titleRect?.top || window.innerHeight) && event.clientY < (titleRect?.bottom || 0)) {
      // Check if click is on left or right side
      const rect = title?.getClientRects()[0]
      let moveToStart = true
      if (event.x > (rect as DOMRect).right) moveToStart = false
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(title as Node)
      range.collapse(moveToStart)
      selection?.removeAllRanges()
      selection?.addRange(range)
      return
    }
    // or nearest block
    const blockRects = Array.from(blocks?.children as HTMLCollection)
    const block = blockRects.find(child => {
      const rect = child.getClientRects()[0]
      return event.clientY > rect.top && event.clientY < rect.bottom
    })
    const blockIdx = blockRects.findIndex(child => {
      const rect = child.getClientRects()[0]
      return event.clientY > rect.top && event.clientY < rect.bottom
    })
    if (block) {
      // Check if click is on left or right side
      const rect = block.getClientRects()[0]
      if (event.x < rect.left) {
        // Move to start of block
        blockElements.value[blockIdx].moveToStart()
      } else {
        // Move to end of block
        blockElements.value[blockIdx].moveToEnd()
      }
      return
    }
  }
  // If cursor is between Submit button and last block, insert block there 
  const lastBlockRect = blocks?.lastElementChild?.getClientRects()[0]
  if (!lastBlockRect) return
  if (event.clientX > (lastBlockRect as DOMRect).left && event.clientX < (lastBlockRect as DOMRect).right
      && event.clientY > (lastBlockRect as DOMRect).bottom) {
    const lastBlock = props.page.blocks[props.page.blocks.length - 1]
    const lastBlockComponent = blockElements.value[props.page.blocks.length - 1]
    if (lastBlock.type === BlockType.Text && lastBlockComponent && lastBlockComponent.getTextContent() === '') {
      // If last block is empty Text, focus on last block
      setTimeout(lastBlockComponent.moveToEnd)
    } else {
      // Otherwise add new empty Text block
      insertBlock(props.page.blocks.length - 1)
    }
  }
})

const dragOptions = {
  animation: 150,
  group: 'blocks',
  disabled: false,
  ghostClass: 'simulai-ghost',
}

onBeforeUpdate(() => {
  blockElements.value = []
})

const blockElements = ref<typeof BlockComponent[]>([])

function insertTextAtCursor(textToInsert) {
  if (savedCaretPosition.value) {
    const range = document.createRange();
    range.setStart(savedCaretPosition.value.startContainer, savedCaretPosition.value.startOffset);
    range.setEnd(savedCaretPosition.value.endContainer, savedCaretPosition.value.endOffset);
    range.deleteContents();
    const emojiNode = document.createTextNode(textToInsert);
    range.insertNode(emojiNode);
  }
}

function checkIfBlockShouldBeVisible(index) {
  const currentBlock = props.page.blocks[index]
  return !props.page.isChat ||
      (currentVisibleBlock.value !== null && index <= currentVisibleBlock.value && !getBlockOptions(currentBlock).isVirtualBlock
          && !shouldWaitForValueFromInput(currentBlock)
      )
}

function checkIfBlockShouldBeReadonly(block: Block, index) {
  return getBlockOptions(block).isInput && index < currentVisibleBlock.value
}

function onSelectEmoji(emoji) {
  isEmojiPickerOpen.value = false;
  insertTextAtCursor(emoji.i)
  /*
    // result
    {
        i: "😚",
        n: ["kissing face"],
        r: "1f61a", // with skin tone
        t: "neutral", // skin tone
        u: "1f61a" // without tone
    }
    */
}

function openEmoji() {
  emojiPickerStyle.value = {
    top: mousePosition.y,
    left: mousePosition.x - 250,
  };
  savedCaretPosition.value = getCaretPosition();
  isEmojiPickerOpen.value = true;
}

function openEmojiPicker(event) {
  if (event.metaKey && event.ctrlKey && event.key === ' ') {
    openEmoji()
  }
}

function getCaretPosition() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    return {
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset
    };
  }
  return null;
}

function scrollIntoView() {
  const selection = window.getSelection()
  if (!selection || !selection.anchorNode) return
  if (selection?.anchorNode?.nodeType === Node.ELEMENT_NODE) {
    (selection?.anchorNode as HTMLElement).scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
  } else {
    (selection?.anchorNode?.parentElement as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest"
    })
  }
}

function handleMoveToPrevLine(blockIdx: number) {
  if (blockIdx === 0) {
    setTimeout(() => {
      if (!title.value) return
      const selection = window.getSelection()
      const range = document.createRange()
      if (title.value.childNodes.length) {
        range.setStart(title.value.childNodes[0], props.page.name.length)
        range.setEnd(title.value.childNodes[0], props.page.name.length)
      } else {
        range.setStart(title.value, 0)
        range.setEnd(title.value, 0)
      }
      selection?.removeAllRanges()
      selection?.addRange(range)
    })
  } else blockElements.value[blockIdx - 1]?.moveToLastLine()
  scrollIntoView()
}

function insertBlock(blockIdx: number) {
  if (props.page.isChat) {
    return;
  }
  const newBlock = {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '',
    },
  }
  props.page.blocks.splice(blockIdx + 1, 0, newBlock)
  if (props.onCreateBlock) props.onCreateBlock(props.page.blocks[blockIdx + 1])
  setTimeout(() => {
    const bl = blockElements.value[blockIdx + 1]
    if (bl) {
      blockElements.value[blockIdx + 1].moveToStart()
    }
    scrollIntoView()
  })
}

function deleteBlock(blockIdx: number) {
  if (props.onDeleteBlock) props.onDeleteBlock(props.page.blocks[blockIdx])
  props.page.blocks.splice(blockIdx, 1)
  // Always keep at least one block
  if (props.page.blocks.length === 0) {
    insertBlock(0)
  }
}

function duplicateBlock(blockIdx: number) {
  // Clone the block to duplicate it
  const duplicatedBlock = cloneDeep({...props.page.blocks[blockIdx]});

  // Insert the duplicated block after the original block
  props.page.blocks.splice(blockIdx + 1, 0, duplicatedBlock);
}

async function setBlockType(blockIdx: number, type: BlockType) {
  if (props.onUnsetAll) props.onUnsetAll(props.page.blocks[blockIdx])
  if (blockElements.value[blockIdx].content.onUnset) {
    blockElements.value[blockIdx].content.onUnset()
  }
  props.page.blocks[blockIdx].type = type
  if (type === BlockType.Divider) {
    setTimeout(() => {
      props.page.blocks[blockIdx].details = {}
      insertBlock(blockIdx)
    })
  } else setTimeout(() => {
    if (props.onSetAll) props.onSetAll(props.page.blocks[blockIdx])
    if (blockElements.value[blockIdx].content.onSet) {
      blockElements.value[blockIdx].content.onSet()
    }
    blockElements.value[blockIdx].moveToEnd()
  })
}

async function addBlock(blockIdx: number, type: BlockType) {
  insertBlock(blockIdx)
  setBlockType(blockIdx + 1, type)
}

function merge(blockIdx: number) {
  if (props.onDeleteBlock) props.onDeleteBlock(props.page.blocks[blockIdx])
  // When deleting the first character of non-text block
  // the block should first turn into a text block
  if ([BlockType.H1, BlockType.H2, BlockType.H3, BlockType.Quote]
      .includes(props.page.blocks[blockIdx].type)) {
    const prevBlockContent = blockElements.value[blockIdx].getTextContent()
    setBlockType(blockIdx, BlockType.Text)
    props.page.blocks[blockIdx].details.value = prevBlockContent
    setTimeout(() => {
      blockElements.value[blockIdx].moveToStart()
    })
    return
  }

  if (blockIdx === 0) mergeTitle()
  else mergeBlocks(blockIdx - 1, blockIdx)
}

function mergeBlocks(prefixBlockIdx: number, suffixBlockIdx: number) {
  if (isTextBlock(props.page.blocks[prefixBlockIdx].type)) {
    const prevBlockContentLength = blockElements.value[prefixBlockIdx].getTextContent().length
    let suffix = (props.page.blocks[suffixBlockIdx] as any).details.value
    if ([BlockType.H1, BlockType.H2, BlockType.H3, BlockType.Quote].includes(props.page.blocks[suffixBlockIdx].type)) suffix = blockElements.value[suffixBlockIdx].getTextContent()
    props.page.blocks[prefixBlockIdx].details.value = (props.page.blocks[prefixBlockIdx] as any).details.value + suffix
    props.page.blocks.splice(suffixBlockIdx, 1)
    setTimeout(() => {
      blockElements.value[prefixBlockIdx].setCaretPos(prevBlockContentLength)
    })
  } else if ([BlockType.H1, BlockType.H2, BlockType.H3].includes(props.page.blocks[prefixBlockIdx].type)) {
    const prevBlockContentLength = (props.page.blocks[prefixBlockIdx] as any).details.value.length
    props.page.blocks[prefixBlockIdx].details.value += blockElements.value[suffixBlockIdx].getTextContent()
    props.page.blocks.splice(suffixBlockIdx, 1)
    setTimeout(() => {
      blockElements.value[prefixBlockIdx].setCaretPos(prevBlockContentLength)
    })
  } else {
    if (prefixBlockIdx > 0) mergeBlocks(prefixBlockIdx - 1, suffixBlockIdx)
    else mergeTitle(suffixBlockIdx)
  }
}

function mergeTitle(blockIdx: number = 0) {
  const titleElement = document.getElementById('title')
  if (!titleElement) return
  const title = props.page.name
  props.page.name = title + blockElements.value[blockIdx].getTextContent()
  props.page.blocks.splice(blockIdx, 1)
  setTimeout(() => {
    const selection = window.getSelection()
    const range = document.createRange()
    range.setStart(titleElement.childNodes[0], title.length)
    range.setEnd(titleElement.childNodes[0], title.length)
    selection?.removeAllRanges()
    selection?.addRange(range)
  })
}

function split(blockIdx: number) {
  const caretPos = blockElements.value[blockIdx].getCaretPos()
  insertBlock(blockIdx)
  const blockTypeDetails = BlockComponents[props.page.blocks[blockIdx].type].options
  if (!blockTypeDetails) return
  if (blockTypeDetails.canSplit) {
    let htmlValue = blockElements.value[blockIdx].getHtmlContent()
    htmlValue = htmlValue.replace('<br class="ProseMirror-trailingBreak">', '')
    props.page.blocks[blockIdx + 1].details.value = htmlToMarkdown((caretPos.tag ? `<${caretPos.tag}>` : '') + (htmlValue ? htmlValue?.slice(caretPos.pos) : ''))
    props.page.blocks[blockIdx].details.value = htmlToMarkdown((htmlValue ? htmlValue?.slice(0, caretPos.pos) : '') + (caretPos.tag ? `</${caretPos.tag}>` : ''))
  }
  setTimeout(() => blockElements.value[blockIdx + 1].moveToStart())
}

const title = ref<HTMLDivElement | null>(null)

function splitTitle() {
  if (!title.value) return
  const selection = window.getSelection()
  if (!selection) return
  const caretPos = selection.anchorOffset
  insertBlock(-1)
  const titleString = title.value.textContent as string
  props.page.name = titleString.slice(0, caretPos)
  props.page.blocks[0].details.value = titleString.slice(caretPos)
}

const blocksHistory: any[] = []
let currentHistoryIndex: number | null = null
let isUndoNextOperation = false;
const MAX_HISTORY_SIZE = 100

// Attach the keydown event listener to the window object
window.addEventListener('keydown', keydownHandler);

function keydownHandler(event) {
  // Check for Ctrl + Z (Windows/Linux) or Cmd + Z (Mac)
  if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
    event.preventDefault(); // Prevent the browser's default undo behavior
    if (currentHistoryIndex === null && blocksHistory.length > 1) {
      currentHistoryIndex = blocksHistory.length - 2;
    } else if (currentHistoryIndex !== null && blocksHistory.length > 1 && currentHistoryIndex > 0) {
      currentHistoryIndex = currentHistoryIndex - 1;
    }

    if (currentHistoryIndex !== null) {
      // Update the page with the historical state
      isUndoNextOperation = true;

      const historicalState = cloneDeep(blocksHistory[currentHistoryIndex]);

      // Update the page with the historical state
      props.page.blocks = historicalState;

      addStateToHistory(props.page.blocks)

      // Reset the flag after the update
      setTimeout(() => {
        isUndoNextOperation = false;
      }, 0);
    }
  } else if ((event.ctrlKey || event.metaKey) && event.key === 'z' && event.shiftKey) {
    event.preventDefault(); // Prevent the browser's default redo behavior

    if (currentHistoryIndex !== null && currentHistoryIndex < blocksHistory.length - 1) {
      // Update the page with the next historical state
      isUndoNextOperation = true;

      currentHistoryIndex = currentHistoryIndex + 1;
      const historicalState = cloneDeep(blocksHistory[currentHistoryIndex]);
      props.page.blocks = historicalState;

      // Reset the flag after the update
      setTimeout(() => {
        isUndoNextOperation = false;
      }, 0);
    }
  }
}

function addStateToHistory(blocks) {
  const currentState = cloneDeep(blocks);
  blocksHistory.push(currentState);
}

// Method to scroll to bottom
function scrollToBottom() {
  setTimeout(() => {
    if (blocks.value) {
      blocks.value.$el.scrollTop = blocks.value.$el.scrollHeight;
    }
  }, 100)
}

watch(() => props.page.blocks, blocks => {
  if (!isUndoNextOperation) {
    addStateToHistory(blocks);
    currentHistoryIndex = null

    // Trim the history to the maximum size
    if (blocksHistory.length > MAX_HISTORY_SIZE) {
      blocksHistory.shift(); // Remove the oldest element
    }
  }
}, {deep: true})

onMounted(() => {
  // Add the initial state to the history after mount
  addStateToHistory(props.page.blocks);
  currentHistoryIndex = null
  showNextBlock()
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
