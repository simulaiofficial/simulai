<template>
  <div class="py-3.5">
    <div class="mt-4 flex flex-wrap">
      <div class="flex items-center w-full mt-2 md:mt-2 ">
        <label class="text-gray-300 mr-2">When:</label>
        <div class="flex items-center h-full"> <!-- Set the parent container's height to 100% -->
          <div class="relative">
            <Dropdown
                v-model="selectedComparison"
                :options="comparisonOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Select a City"
                class="w-32 md:w-64 h-full"
            />
          </div>
        </div>
      </div>

      <div class="flex items-center w-full mt-2 md:mt-2 ">
        <label class="text-gray-300 mr-2">Is:</label>
        <div class="flex items-center h-full"> <!-- Set the parent container's height to 100% -->
          <div class="relative">
            <Dropdown
                v-model="selectedComparison"
                :options="comparisonOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Select a City"
                class="w-32 md:w-64 h-full"
            />
          </div>
          <!-- Input for the index to jump to -->
          <div class="relative h-full">
            <input
                v-model="jumpIndex"
                type="number"
                class="w-full h-full bg-gray-700 placeholder-gray-200 text-gray-300 focus:outline-none p-2 rounded-md ml-1"
                placeholder=""
            />
          </div>
        </div>
      </div>

      <div class="flex items-center w-full mt-2 md:mt-2 ">
        <label class="text-gray-300 mr-2">Then:</label>
        <div class="flex items-center h-full"> <!-- Set the parent container's height to 100% -->
          <div class="relative">
            <Dropdown
                v-model="selectedComparison"
                :options="comparisonOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Select a City"
                class="w-32 md:w-64 h-full"
            />
          </div>
          <!-- Input for the index to jump to -->
          <div class="relative h-full">
            <input
                v-model="jumpIndex"
                type="number"
                class="w-full h-full bg-gray-700 placeholder-gray-200 text-gray-300 focus:outline-none p-2 rounded-md ml-1"
                placeholder=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {onMounted, PropType, ref} from 'vue'
import {Block, BlockCondition, BlockInputTextAnswer, getBlockFuncs, getBlockOptions, OptionItem} from '@/utils/types'
import {
  markdownToHtml,
  setUpInitialValuesForBlock,
  setUpInitialValuesForBlockAnswer,
  unsetInitialValuesForBlockAnswer
} from '@/utils/utils'
import Editor from '../elements/Editor.vue'
import Dropdown from '../elements/Dropdown.vue';

const comparisonOptions = ref([
  {value: '=', name: 'Equal to'},
  {value: '!=', name: 'Not equal to'},
  {value: '>', name: 'Greater than'},
  {value: '<', name: 'Less than'},
]);

const actionOptions = ref([
  {value: 'jump', name: 'Jump to section'},
  {value: 'other', name: 'Other action'},
]);

const selectedComparison = ref('=');
const comparisonValue = ref('');
const selectedAction = ref('jump');
const jumpIndex = ref('');

const props = defineProps({
  block: {
    type: Object as PropType<BlockCondition>,
    required: true,
  },
  page: {
    type: Object as PropType<{ name: string, blocks: Block[] }>,
    required: true,
  },
})

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

onMounted(() => {
  comparisonOptions.value = props.page.blocks
      .filter((block) => getBlockOptions(block).conditionVisible)
      .map((block) => {
        const title = getBlockFuncs(block).getTitle(block)
        return {'value': title, 'name': title}
      })
})

defineExpose({
  onSet,
  onUnset
})
</script>
