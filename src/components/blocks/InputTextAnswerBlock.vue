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
          class="w-full bg-gray-700 placeholder-gray-200 text-gray-300 border border-gray-500 focus:outline-none p-4 rounded-md cursor-not-allowed"
          placeholder="Text answer..."
          ref="input"
      />
      <div
          class="absolute inset-0 bg-gradient-to-t from-gray-700 to-transparent  rounded-md pointer-events-none"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType} from 'vue'
import {Block, BlockInputTextAnswer, OptionItem} from '@/utils/types'
import {markdownToHtml, setUpInitialValuesForBlock, setUpInitialValuesForBlockAnswer} from '@/utils/utils'
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

  setUpInitialValuesForBlock(props.block)
  setUpInitialValuesForBlockAnswer(props.block)
}

defineExpose({
  onSet
})
</script>
