<template>
  <div class="py-3.5">
    <div class="mt-4 flex flex-wrap">
      <div class="flex items-center w-full mt-2 md:mt-2 ">
        <label class="text-gray-300 mr-2">When:</label>
        <div class="flex items-center h-full"> <!-- Set the parent container's height to 100% -->
          <div class="relative">
            <Dropdown
                v-model="props.block.whenBlockSelectedId"
                :options="inputBlockOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Select block"
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
                v-model="props.block.isOperatorSelectedId"
                :options="comparisonOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Select operator"
                class="w-32 md:w-64 h-full"
            />
          </div>
          <!-- Input for the index to jump to -->
          <div class="relative h-full">
            <input
                v-model="props.block.isOperatorValue"
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
                v-model="props.block.actionSelectedId"
                :options="actionOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Select action"
                class="w-32 md:w-64 h-full"
            />
          </div>
          <!-- Input for the index to jump to -->
          <div class="relative h-full">
            <div class="relative">
              <Dropdown
                  v-model="props.block.actionBlockSelectedId"
                  :options="allBlockOptions"
                  optionLabel="name"
                  optionValue="value"
                  placeholder="Select block"
                  class="w-32 md:w-64 h-full ml-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {onMounted, onBeforeMount, PropType, ref, watch} from 'vue'
import {
  Block,
  BlockCondition,
  BlockInputTextAnswer,
  getBlockFuncs,
  getBlockOptions,
  isFlowBlock,
  OptionItem
} from '@/utils/types'
import {
  setUpInitialValuesForBlock,
  setUpInitialValuesForBlockAnswer,
  unsetInitialValuesForBlockAnswer
} from '@/utils/utils'
import Dropdown from '../elements/Dropdown.vue';

const inputBlockOptions = ref([])
const allBlockOptions = ref([])

const comparisonOptions = ref([
  {value: '=', name: 'Equal to'},
  {value: '!=', name: 'Not equal to'},
  {value: '>', name: 'Greater than'},
  {value: '<', name: 'Less than'},
]);

const actionOptions = ref([
  {value: 'jump', name: 'Jump to block'},
  {value: 'hide', name: 'Hide block'},
]);

const selectedWhenBlock = ref(null);
const selectedActionBlock = ref(null);
const selectedComparison = ref('=');
const comparisonValue = ref(null);
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

function updateInputBlocksDropdowns() {
  let blocksWithIndex = props.page.blocks
      .map((block, index) => ({block, index})) // Create an array of objects containing both block and index
      .filter(({block}) => getBlockOptions(block).conditionVisible);

  inputBlockOptions.value = blocksWithIndex.map(({block, index}) => {
    const title = getBlockFuncs(block).getTitle(block);
    const optionTitle = `[${index + 1}] ${title} ...`; // Adding 1 to the index to start from 1 instead of 0
    return {'value': block.id, 'name': optionTitle};
  });
}

function updateAllBlocksDropdowns() {
  let blocksWithIndex = props.page.blocks
      .map((block, index) => ({block, index})) // Create an array of objects containing both block and index
      .filter(({block}) => isFlowBlock(block.type));

  allBlockOptions.value = blocksWithIndex.map(({block, index}) => {
    const title = getBlockFuncs(block).getTitle(block);
    const optionTitle = `[${index + 1}] ${title} ...`; // Adding 1 to the index to start from 1 instead of 0
    return {'value': block.id, 'name': optionTitle};
  });
}

onBeforeMount(() => {
  updateInputBlocksDropdowns()
  updateAllBlocksDropdowns()
})

watch(() => props.page.blocks, (blocks) => {
  updateInputBlocksDropdowns()
  updateAllBlocksDropdowns()
}, {deep: true})

defineExpose({
  onSet,
  onUnset
})
</script>
