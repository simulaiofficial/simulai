<template>
  <div :class="{
         'simulai max-w-screen-md mx-auto my-12 font-sans text-base p-5 pb-8': !props.page.isChat,
         'simulai max-w-screen-md mx-auto font-sans text-base p-5 pb-32 h-screen flex flex-col justify-between': props.page.isChat
       }" v-if="props.page" ref="editor"
       @keydown.ctrl.cmd.space.prevent="openEmojiPicker">
    <div v-if="showButtons" class="buttons-container fixed top-0 right-0 mt-4 mr-4" style="z-index:9999;">
      <button @click="previewPage"
              class="preview-button bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 mr-2 rounded cursor-pointer">
        Preview
      </button>
      <button @click="saveData"
              class="save-button bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2 cursor-pointer">
        {{ isDataSaved ? 'Saved!' : 'Save' }}
      </button>
      <button @click="publishPage"
              class="publish-button bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded cursor-pointer">
        Publish
      </button>
    </div>

    <h1 id="title" ref="title" :contenteditable="!props.page.isChat" spellcheck="false" data-ph="Untitled"
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
         '-ml-24 space-y-2 pb-24': !props.page.isChat,
         'flex-grow overflow-y-auto space-y-1 pb-4 max-h-[calc(100vh-8rem)]': props.page.isChat
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
                            @typingCompleted="goNextBlock"
            />
          </div>
        </div>
        <div
            v-if="page.isChat && block.isRequired === false && i === currentVisibleBlock">
          <button
              @click="showNextBlock()"
              class="mt-2 mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300 cursor-pointer">
            Skip
          </button>
        </div>
      </div>
    </draggable>
    <div>
      <transition name="fade">
        <ChatInput ref="chatInput" v-if="page.isChat && !isConversationFinished"
                   :isPreview="props.page.isPreview"
                   :bgColor="props.bgColor"
                   :uploadUrl="props.page.uploadUrl"
                   :isUploadEnabled="isUploadEnabled"
                   @nextBlock="handleChatInput" @gotMessage="handleMessage"
                   class="fixed left-0 right-0 w-full max-w-screen-md mx-auto bottom-8"/>
      </transition>
    </div>
  </div>
  <EmojiPicker v-if="isEmojiPickerOpen" ref="emojiPicker" :native="true" @select="onSelectEmoji"
               :style="{ top: emojiPickerStyle.top + 'px', left: emojiPickerStyle.left + 'px' }" class="absolute z-50"/>
  <div v-if="showModal" class="modal fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center font-sans">
    <div class="modal-content p-4 rounded shadow-lg border border-solid border-gray-600"
         :style="{ backgroundColor: props.bgColor }">
      <h2 class="text-gray-200 text-lg mb-2 mt-0">Share following URL address</h2>
      <input type="text" readonly :value="publishUrl" class="w-full p-2 border-2 border-gray-300 rounded mb-2"
             ref="publishUrlInput">
      <button @click="copyPublishUrl"
              class="copy-button bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded cursor-pointer">
        Copy URL
      </button>
      <button @click="showModal = false"
              class="close-button ml-2 bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded cursor-pointer">
        Close
      </button>
    </div>
  </div>
  <div v-if="showError" class="modal fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center font-sans">
    <div class="modal-content p-4 rounded shadow-lg border border-solid border-gray-600"
         :style="{ backgroundColor: props.bgColor }">
      <h2 class="text-gray-200 text-lg mb-2 mt-0">Error</h2>
      <div>
        {{ errorMessage }}
      </div>
      <div>
        <button @click="showError = false"
                class="close-button mt-2 bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded cursor-pointer">
          Close
        </button>
      </div>
    </div>
  </div>
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
import Joi from 'joi'
import {validateBlock} from "@/utils/validation";
import {calculateConditionAction} from "@/utils/conditions";

const showButtons = computed(() => {
  // console.log(props.page.isChat)
  return !props.page.isChat
});

const props = defineProps({
  page: {
    type: Object as PropType<{
      name: string, isChat: boolean, isPreview: boolean, blocks: Block[], saveUrl: string, uploadUrl: string
    }>,
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
const isUploadEnabled = ref(false);
const emojiPickerStyle = ref({top: 0, left: 0});
const savedCaretPosition = ref(null);
const chatInput = ref(null);
const mousePosition = {x: 0, y: 0}

const currentVisibleBlock = ref(null);
const lastInputBlock = ref(null);
const visibleBlocksSeq = [];
const isConversationFinished = ref(false);
let showUntilAndWait = null

const showError = ref(false); // Controls visibility of the modal
const showModal = ref(false); // Controls visibility of the modal
const publishUrl = ref(''); // Stores the publish URL
const publishUrlInput = ref(null); // Reference to the input element

const isDataSaved = ref(false); // This will track the save status

const errorMessage = ref('');

// Function to save data
async function saveData() {
  if (props.page.isPreview) {
    return
  }
  try {
    const response = await fetch(props.page.saveUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers you need
      },
      body: JSON.stringify({
        'name': props.page.name,
        'blocks': props.page.blocks,
      }),
    });

    if (!response.ok) {
      showErrorMessage((await response.json()).detail)
      throw new Error('Network response was not ok');
    }

    if (response.ok) {
      isDataSaved.value = true; // Set to true on successful save
      setTimeout(() => {
        isDataSaved.value = false; // Reset after 1 second
      }, 1000); // 1000 milliseconds = 1 second
    }

    const data = await response.json();
    console.log("Data saved", data);
    return {
      publishUrl: data.publishUrl,
      previewUrl: data.previewUrl
    };
  } catch (error) {
    showErrorMessage('Cannot save! You may have an invalid configuration of your bot, please check it.')
    console.error('Error fetching data:', error);
  }
}

async function publishPage() {
  try {
    const {publishUrl} = await saveData(); // Await the result of saveData
    if (publishUrl) {
      showModalWithUrl(publishUrl); // Call function to show modal with URL
    } else {
      console.error('Publish URL not received');
    }
  } catch (error) {
    console.error('Error during publish:', error);
  }
}

async function previewPage() {
  try {
    const {previewUrl} = await saveData(); // Await the result of saveData
    if (previewUrl) {
      window.open(previewUrl, '_blank'); // Open new tab with the preview URL
    } else {
      console.error('Preview URL not received');
    }
  } catch (error) {
    console.error('Error during preview:', error);
  }
}

// Function to display modal with URL
function showModalWithUrl(url) {
  console.log('Modal should display URL:', url);

  publishUrl.value = url;
  showModal.value = true;
}

function showErrorMessage(message) {
  console.log('Show message:', message);

  errorMessage.value = message;
  showError.value = true;
}

// Function to copy publishUrl to clipboard
function copyPublishUrl() {
  if (publishUrlInput.value) {
    publishUrlInput.value.select();
    document.execCommand('copy');
  }
}

function showNextBlock() {
  debugger;
  if (props.page.blocks.length === 0) {
    setTimeout(() => showNextBlock(), 1000)
    return
  }

  if (currentVisibleBlock.value == props.page.blocks.length - 1) {
    isConversationFinished.value = true;
    saveData();
    return
  }

  if (currentVisibleBlock.value === null) {
    currentVisibleBlock.value = 0
    scrollToBottom()
  } else if (showUntilAndWait && currentVisibleBlock.value === showUntilAndWait) {
    chatInput.value.focusInput()
    return
  } else {
    currentVisibleBlock.value += 1
    scrollToBottom()
  }

  const currentBlock = props.page.blocks[currentVisibleBlock.value]

  if (!currentBlock) {
    return
  }

  const isEmptyTextBlock = currentBlock.type === BlockType.Text && currentBlock.details.value === ''
  if (currentBlock.isHidden || isEmptyTextBlock) {
    setTimeout(() => {
      showNextBlock()
    }, 0);
    return;
  } else if (currentBlock.type === BlockType.InputFileAnswer) {
    isUploadEnabled.value = true;
  } else if (currentBlock.type !== BlockType.ConversationBot
      && currentBlock.type !== BlockType.ConversationHuman) {
    isUploadEnabled.value = false;
  }

  if (isVisibleBlock(currentBlock)) {
    visibleBlocksSeq.push(currentBlock)
  }

  if (currentBlock && !getBlockOptions(currentBlock).isInput) {
    // const timeout = getBlockOptions(currentBlock).isVirtualBlock ? 0 : 1000;
    if (currentBlock.type === BlockType.Condition) {
      debugger;
      const resultAction = calculateConditionAction(currentBlock, props.page.blocks)
      const hide = resultAction.hide
      const jump = resultAction.jump
      if (hide.length > 0) {
        hide.forEach(hideId => {
          const foundItem = props.page.blocks.find(block => block.id === hideId)
          if (foundItem) {
            foundItem.isHidden = true
          }
        })
      }

      if (jump !== null) {
        // const foundItem = props.page.blocks.find(block => block.id === jump)
        let i = currentVisibleBlock.value + 1
        while (true) {
          const block = props.page.blocks[i]
          if (block.id === jump) {
            currentVisibleBlock.value = i - 1
            break;
          } else {
            block.isHidden = true
          }
          i++;
        }
      }

      setTimeout(() => {
        showNextBlock()
      }, 0)
    }
  } else if (getBlockOptions(currentBlock).isInput) {
    lastInputBlock.value = currentVisibleBlock.value
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
  debugger;
  showNextBlock()
  const currentBlock = props.page.blocks[currentVisibleBlock.value]
  if (chatInput.value && shouldWaitForValueFromInput(currentBlock)) {
    chatInput.value.focusInput()
  }
}

function addBlockAfterCurrent(block: Block, from?: Number) {
  if (from) {
    const putIndex = from + 1
    props.page.blocks.splice(putIndex, 0, block);
    return putIndex
  } else {
    const putIndex = currentVisibleBlock.value + 1
    props.page.blocks.splice(putIndex, 0, block);
    return putIndex
  }
}

function handleMessage(message) {
  const conversationBotBlock = {
    id: uuidv4(),
    type: BlockType.ConversationBot,
    details: {
      value: message
    },
  }
  const lastBotIndex = addBlockAfterCurrent(conversationBotBlock)
  showUntilAndWait = lastBotIndex
  showNextBlock()
}

function handleChatInput(inputValue) {
  const conversationBlock = {
    id: uuidv4(),
    type: BlockType.ConversationHuman,
    details: {
      value: inputValue
    },
  }
  const putIndex = addBlockAfterCurrent(conversationBlock)

  let inputBlock = null

  if (lastInputBlock.value !== null && props.page.blocks.length > lastInputBlock.value) {
    inputBlock = props.page.blocks[lastInputBlock.value]
  }

  const validationResult = validateBlock(inputValue, inputBlock)

  if (validationResult.error) {
    const conversationBotBlock = {
      id: uuidv4(),
      type: BlockType.ConversationBot,
      details: {
        value: validationResult.error
      },
    }
    const lastBotIndex = addBlockAfterCurrent(conversationBotBlock, putIndex)
    showUntilAndWait = lastBotIndex
    showNextBlock()
  } else {
    if (lastInputBlock.value) {
      const lastInput = props.page.blocks[lastInputBlock.value]
      lastInput.details.value = inputValue
    }
    showUntilAndWait = null
    showNextBlock()
  }

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
  const isEmptyTextBlock = currentBlock.type === BlockType.Text && currentBlock.details.value === ''
  return !props.page.isChat ||
      (currentVisibleBlock.value !== null && index <= currentVisibleBlock.value && !currentBlock.isHidden && !getBlockOptions(currentBlock).isVirtualBlock
          && !shouldWaitForValueFromInput(currentBlock) && !isEmptyTextBlock
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
  if (props.page.blocks.length <= 1) {
    showErrorMessage('You must have at least one block');
    return
  }

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
