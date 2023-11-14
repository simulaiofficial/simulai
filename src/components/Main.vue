<template>
  <div class="flex flex-col" :style="{ color: textColor }">
    <div class="w-full" :style="{ backgroundColor: bgColor }">
      <Lotion :bgColor="bgColor" :textColor="textColor" :page="page" />
    </div>
    <div class="w-full overflow-y-auto" style="background-color: #202123;">
      <Markdown :page="page" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BlockType } from '@/utils/types'
import Markdown from './Markdown.vue'
import Lotion from './Lotion.vue'
import { v4 as uuidv4 } from 'uuid'

const bgColor = "#343541"
const textColor = "#ffffff"

const page = ref({
  name: '🤖 simulai',
  blocks:[{
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
</script>
