<template>
  <div class="py-3.5">
    <div class="relative">
      <input
          v-if="block.type === BlockType.InputTextAnswer"
        @input.prevent
        @keydown.enter.prevent
        @keydown.space.prevent
        @keydown.tab.prevent
        @keydown.delete.prevent
        @keydown="disableInput"
        class="w-full h-full bg-gray-700 placeholder-gray-200 text-gray-300 border border-gray-500 focus:outline-none p-4 rounded-md cursor-not-allowed"
        placeholder="Text input..."
        type="text"
        ref="input"
      />
      <input
          v-if="block.type === BlockType.InputNumberAnswer"
        @input.prevent
        @keydown.enter.prevent
        @keydown.space.prevent
        @keydown.tab.prevent
        @keydown.delete.prevent
        @keydown="disableInput"
        class="w-full h-full bg-gray-700 placeholder-gray-200 text-gray-300 border border-gray-500 focus:outline-none p-4 rounded-md cursor-not-allowed"
        placeholder="Number input..."
        type="number"
        ref="input"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-gray-700 to-transparent rounded-md pointer-events-none"
      ></div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {PropType, ref} from 'vue'
import {Block, BlockType, BlockAnswer, BlockInputTextAnswer, OptionItem} from '@/utils/types'
import {
  markdownToHtml,
  setUpInitialValuesForBlock,
  setUpInitialValuesForBlockAnswer,
  unsetInitialValuesForBlockAnswer
} from '@/utils/utils'

const props = defineProps({
  block: {
    type: Object as PropType<BlockAnswer>,
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

  setUpInitialValuesForBlock(props.block)
  setUpInitialValuesForBlockAnswer(props.block)

  props.block.minRequired = false
  props.block.maxRequired = false
}

function onUnset() {
  unsetInitialValuesForBlockAnswer(props.block)
  delete props.block.minRequired
  delete props.block.maxRequired
  delete props.block.minChars
  delete props.block.maxChars
}

defineExpose({
  onSet,
  onUnset
})
</script>
