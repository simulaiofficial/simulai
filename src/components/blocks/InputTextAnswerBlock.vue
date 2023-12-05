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

    <!-- New block for conditional logic -->
    <div class="mt-4">
      <div class="flex items-center">
        <label class="text-gray-300 mr-2">When:</label>
        <div class="flex items-center">
          <Dropdown v-model="selectedComparison" :options="comparisonOptions" optionLabel="name" optionValue="value" placeholder="Select a City" class="w-full md:w-14rem" />
          <input
              class="w-1/2 bg-gray-700 placeholder-gray-200 text-gray-300 border border-gray-500 focus:outline-none p-2 rounded-md"
              placeholder="Value..."
          />
        </div>
      </div>

      <div class="flex items-center mt-2">
        <label class="text-gray-300 mr-2">Then:</label>
        <Dropdown v-model="selectedComparison" :options="comparisonOptions" optionLabel="name" optionValue="value" placeholder="Select a City" class="w-full md:w-14rem" />
        <!-- Input for the index to jump to -->
        <input
            v-model="jumpIndex"
            type="number"
            class="w-1/4 bg-gray-700 placeholder-gray-200 text-gray-300 border border-gray-500 focus:outline-none p-2 rounded-md ml-2"
            placeholder="Index..."
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType, ref} from 'vue'
import {Block, BlockInputTextAnswer, OptionItem} from '@/utils/types'
import {
  markdownToHtml,
  setUpInitialValuesForBlock,
  setUpInitialValuesForBlockAnswer,
  unsetInitialValuesForBlockAnswer
} from '@/utils/utils'
import Editor from '../elements/Editor.vue'
// import Dropdown from 'primevue/dropdown';
import Dropdown from '../elements/Dropdown.vue';

const comparisonOptions = ref([
  { value: '=', name: 'Equal to' },
  { value: '!=', name: 'Not equal to' },
  { value: '>', name: 'Greater than' },
  { value: '<', name: 'Less than' },
]);

const actionOptions = ref([
  { value: 'jump', name: 'Jump to section' },
  { value: 'other', name: 'Other action' },
]);

const selectedComparison = ref('=');
const comparisonValue = ref('');
const selectedAction = ref('jump');
const jumpIndex = ref('');

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
