<template>
  <div class="flex flex-col" :style="{ color: textColor }">
    <div class="w-full" :style="{ backgroundColor: bgColor }">
      <Lotion :bgColor="bgColor" :textColor="textColor" :page="page"/>
    </div>
    <div class="w-full overflow-y-auto" style="background-color: #202123;">
      <Markdown :page="page"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {BlockType} from '@/utils/types'
import Markdown from './Markdown.vue'
import Lotion from './Lotion.vue'
import {v4 as uuidv4} from 'uuid'
import {computed, watch} from 'vue'
import cloneDeep from 'lodash/cloneDeep';
import {htmlToMarkdown, markdownToHtml} from "@/utils/utils";

const bgColor = "#343541"
const textColor = "#ffffff"

const page = ref({
  name: '🤖 simulai',
  blocks: [{
    id: uuidv4(),
    type: BlockType.H1,
    details: {
      value: 'Get Started'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Divider,
    details: {},
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '👋 Welcome! This is a private page for you to play around with.'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: 'Give these things a try:'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '1. Hover on the left of each line for quick actions'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '2. Click on the + button to add a new line'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '3. Drag the ⋮⋮ button to reorder'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '4. Click the trash icon to delete this block'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '5. **Bold** and *italicize* using markdown e.g. \\*\\*bold\\*\\* and \\*italics\\*'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '6. Add headers and dividers with \'#\', \'##\' or \'---\' followed by a space'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '7. Type \'/\' for a menu to quickly switch blocks and search by typing'
    },
  },]
})

const blocksHistory: any[] = []
let currentHistoryIndex: number | null = null
let isUndoNextOperation = false;
const MAX_HISTORY_SIZE = 50

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

      debugger;

      const historicalState = cloneDeep(blocksHistory[currentHistoryIndex]);

      // Update the page with the historical state
      page.value.blocks = historicalState;

      addStateToHistory(page.value.blocks)

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
      page.value.blocks = historicalState;

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

  // Trim the history to the maximum size
  if (blocksHistory.length > MAX_HISTORY_SIZE) {
    blocksHistory.shift(); // Remove the oldest element
  }
}

watch(() => page.value.blocks, blocks => {
  if (!isUndoNextOperation) {
    addStateToHistory(blocks);
    currentHistoryIndex = null
  }
}, {deep: true})

onMounted(() => {
  // Add the initial state to the history after mount
  addStateToHistory(page.value.blocks);
  currentHistoryIndex = null
});


</script>
