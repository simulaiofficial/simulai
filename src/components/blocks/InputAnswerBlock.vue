<template>
  <div class="py-3.5">
    <div class="relative">
      <input
          v-if="block.type === BlockType.InputEmailAnswer"
          @input.prevent
          @keydown.enter.prevent
          @keydown.space.prevent
          @keydown.tab.prevent
          @keydown.delete.prevent
          @keydown="disableInput"
          class="w-full h-full bg-gray-700 placeholder-gray-200 text-gray-300 focus:outline-none p-4 rounded-md cursor-not-allowed"
          style="border: 1px solid #706161;"
          :style="{backgroundColor: props.bgColor}"
          placeholder="Email input..."
          type="email"
          ref="input"
      />
      <input
          v-if="block.type === BlockType.InputTextAnswer"
          @input.prevent
          @keydown.enter.prevent
          @keydown.space.prevent
          @keydown.tab.prevent
          @keydown.delete.prevent
          @keydown="disableInput"
          class="w-full h-full bg-gray-700 placeholder-gray-200 text-gray-300 focus:outline-none p-4 rounded-md cursor-not-allowed"
          style="border: 1px solid #706161;"
          :style="{backgroundColor: props.bgColor}"
          placeholder="Text input..."
          type="text"
          ref="input"
      />
      <input
          v-if="block.type === BlockType.InputUrlAnswer"
          @input.prevent
          @keydown.enter.prevent
          @keydown.space.prevent
          @keydown.tab.prevent
          @keydown.delete.prevent
          @keydown="disableInput"
          class="w-full h-full bg-gray-700 placeholder-gray-200 text-gray-300 focus:outline-none p-4 rounded-md cursor-not-allowed"
          style="border: 1px solid #706161;"
          :style="{backgroundColor: props.bgColor}"
          placeholder="Link address input..."
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
          class="w-full h-full bg-gray-700 placeholder-gray-200 text-gray-300 focus:outline-none p-4 rounded-md cursor-not-allowed"
          style="border: 1px solid #706161;"
          :style="{backgroundColor: props.bgColor}"
          placeholder="Number input..."
          type="number"
          ref="input"
      />
      <input
          v-if="block.type === BlockType.InputDecimalAnswer"
          @input.prevent
          @keydown.enter.prevent
          @keydown.space.prevent
          @keydown.tab.prevent
          @keydown.delete.prevent
          @keydown="disableInput"
          class="w-full h-full bg-gray-700 placeholder-gray-200 text-gray-300 focus:outline-none p-4 rounded-md cursor-not-allowed"
          style="border: 1px solid #706161;"
          :style="{backgroundColor: props.bgColor}"
          step=".01"
          placeholder="Decimal input..."
          type="number"
          ref="input"
      />
      <input
          v-if="block.type === BlockType.InputFileAnswer"
          @input.prevent
          @keydown.enter.prevent
          @keydown.space.prevent
          @keydown.tab.prevent
          @keydown.delete.prevent
          @keydown="disableInput"
          class="w-full h-full bg-gray-700 placeholder-gray-200 text-gray-300 focus:outline-none p-4 rounded-md cursor-not-allowed"
          style="border: 1px solid #706161;"
          :style="{backgroundColor: props.bgColor}"
          placeholder="File input..."
          type="file"
          ref="input"
      />
<!--      <div v-if="block.type === BlockType.InputFileAnswer">-->
<!--        <button-->
<!--            class="mt-2 mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300 cursor-pointer">-->
<!--          Upload-->
<!--        </button>-->
<!--      </div>-->
    </div>
  </div>
</template>


<script setup lang="ts">
import {PropType} from 'vue'
import {
  Block,
  BlockInputDecimalAnswer,
  BlockInputEmailAnswer,
  BlockInputNumberAnswer,
  BlockInputTextAnswer,
  BlockType
} from '@/utils/types'
import {
  setUpInitialValuesForBlock,
  setUpInitialValuesForBlockAnswer,
  unsetInitialValuesForBlockAnswer
} from '@/utils/utils'

const props = defineProps({
  block: {
    type: Object as PropType<BlockInputTextAnswer | BlockInputNumberAnswer | BlockInputDecimalAnswer | BlockInputEmailAnswer>,
    required: true,
  },
  bgColor: {
    type: String,
    required: true
  },
  page: {
    type: Object as PropType<{ id: string, name: string, isChat: boolean, isPreview: boolean, workspaceBots: WorkspaceBot[], blocks: Block[], saveUrl: string }>,
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
