<template>
  <div class="py-3.5">
    <div class="relative">
      <input
          @input.prevent
          @keydown.enter.prevent
          @keydown.space.prevent
          @keydown.tab.prevent
          @keydown.delete.prevent
          @keydown="disableInput"
          class="w-full bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none p-3 rounded-md shadow-md cursor-not-allowed"
          placeholder="Enter your answer..."
          ref="input"
      />
      <div
          class="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent shadow-md rounded-md pointer-events-none"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType} from 'vue'
import {Block, BlockInputTextAnswer, OptionItem} from '@/utils/types'
import {markdownToHtml} from '@/utils/utils'
import Editor from '../elements/Editor.vue'

const props = defineProps({
  block: {
    type: Object as PropType<BlockInputTextAnswer>,
    required: true,
  }
})

function disableInput(event) {
  event.preventDefault();
}

function onSet() {
  if (props.block.details.value) {
    props.block.details.value = ''
  }
}

defineExpose({
  onSet
})
</script>
