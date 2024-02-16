<template>
  <div class="py-3.5">
    <div class="mt-4 flex flex-wrap">
      <div class="flex items-center w-full mt-2 md:mt-2 ">
        <label class="text-gray-300 mr-2">When:</label>
        <div class="flex items-center h-full"> <!-- Set the parent container's height to 100% -->
          <div class="relative">
            <Dropdown
                v-model="props.block.whenBlockSelectedId"
                :options="previousInputBlockOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Select block"
                class="w-32 md:w-64 h-full"
                :key="blocksHistoryKey"
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
                :key="blocksHistoryKey"
            />
          </div>
          <!-- Input for the index to jump to -->
          <div class="relative h-full">
            <input
                v-if="comparisonType === ComparisonType.Number"
                v-model="props.block.isOperatorValue"
                type="number"
                class="w-full h-full bg-gray-700 placeholder-gray-200 text-gray-300 focus:outline-none p-2 rounded-md ml-1"
                placeholder=""
            />
            <input
                v-if="comparisonType === ComparisonType.Text"
                v-model="props.block.isOperatorValue"
                type="text"
                class="w-full h-full bg-gray-700 placeholder-gray-200 text-gray-300 focus:outline-none p-2 rounded-md ml-1"
                placeholder=""
            />
            <Dropdown
                v-if="comparisonType === ComparisonType.Dropdown"
                v-model="props.block.isOperatorValue"
                :options="operatorOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Select value"
                class="w-32 md:w-64 h-full ml-1"
                :key="blocksHistoryKey"
            />
            <DatePicker
                ref="datePicker"
                v-if="comparisonType === ComparisonType.Date"
                v-model="date" :format="format" :language="language"
                @update:model-value="handleDatePickerUpdate"
                class="w-32 md:w-64 h-full ml-1 bg-gray-700 placeholder-gray-200 text-gray-300 focus:outline-none p-4 rounded-md"/>
            <Calendar v-if="comparisonType === ComparisonType.Time" ref="timePicker" class="mt-1 ml-1 time-picker"
                      v-model="time" timeOnly/>
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
                :key="blocksHistoryKey"
            />
          </div>
          <!-- Input for the index to jump to -->
          <div class="relative h-full">
            <div class="relative">
              <Dropdown
                  v-model="props.block.actionBlockSelectedId"
                  :options="allNextBlockOptions"
                  optionLabel="name"
                  optionValue="value"
                  :placeholder="props.block.actionSelectedId === ComparisonsAction.Go ? 'Select bot' : 'Select block'"
                  class="w-32 md:w-64 h-full ml-1"
                  :key="blocksHistoryKey"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {onBeforeMount, PropType, ref, watch} from 'vue'
import {
  Block,
  BlockCondition,
  ComparisonsAction,
  ComparisonType,
  getBlockFuncs,
  getBlockOptions,
  isFlowBlock
} from '@/utils/types'
import {
  setUpInitialValuesForBlock,
  setUpInitialValuesForBlockAnswer,
  unsetInitialValuesForBlockAnswer
} from '@/utils/utils'
import Dropdown from '../elements/Dropdown.vue';
import DatePicker from "vue3-datepicker";
import Calendar from 'primevue/calendar';

const previousInputBlockOptions = ref([])
const allNextBlockOptions = ref([])

const blocksHistoryKey = ref(0);

const comparisonOptions = ref([]);
const comparisonType = ref(ComparisonType.Number);

const operatorOptions = ref([]);

const format = 'yyyy-MM-dd';
const language = 'en'; // Change this to your desired language
const datePicker = ref(null)
const timePicker = ref()
const date = ref(null)
const time = ref()

const actionOptions = ref([
  {value: ComparisonsAction.Jump, name: 'Jump to block'},
  {value: ComparisonsAction.Hide, name: 'Hide block'},
  {value: ComparisonsAction.Go, name: 'Go to bot'},
]);

const props = defineProps({
  block: {
    type: Object as PropType<BlockCondition>,
    required: true,
  },
  page: {
    type: Object as PropType<{ id: string, name: string, isChat: boolean, isPreview: boolean, workspaceBots: WorkspaceBot[], blocks: Block[], saveUrl: string, uploadUrl: string, avatarUrl: string, botName: string }>,
    required: true,
  },
  blockNumber: {
    type: Number,
    default: null
  }
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

function handleDatePickerUpdate() {
  const selectedDate = date.value
  // Extract year, month, and day from the selected date
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month
  const day = String(selectedDate.getDate()).padStart(2, '0');

  // Construct the string in 'yyyy-mm-dd' format
  const formattedDate = `${year}-${month}-${day}`;

  // Update block.details.value with the formatted date
  props.block.isOperatorValue = formattedDate;

  setTimeout(() => {
    datePicker.value.$el.querySelector('input').blur()
  }, 0)
}

function updatePreviousInputBlocksDropdowns() {
  let blocksWithIndex = props.page.blocks
      .map((block, index) => ({block, index})) // Create an array of objects containing both block and index
      .filter(({
                 block,
                 index
               }) => index < props.blockNumber && getBlockOptions(block).conditionVisible && !block.isHidden);

  previousInputBlockOptions.value = blocksWithIndex.map(({block, index}) => {
    const title = getBlockFuncs(block).getTitle(block);
    const optionTitle = `[${index + 1}] ${title} ...`; // Adding 1 to the index to start from 1 instead of 0
    return {'value': block.id, 'name': optionTitle};
  });
}

function updateAllNextBlocksDropdowns() {
  if (props.block.actionSelectedId === ComparisonsAction.Jump
      || props.block.actionSelectedId === ComparisonsAction.Hide) {
    let blocksWithIndex = props.page.blocks
        .map((block, index) => ({block, index})) // Create an array of objects containing both block and index
        .filter(({block, index}) => index >= props.blockNumber && isFlowBlock(block.type) && !block.isHidden);

    allNextBlockOptions.value = blocksWithIndex.map(({block, index}) => {
      const title = getBlockFuncs(block).getTitle(block);
      const optionTitle = `[${index + 1}] ${title} ...`; // Adding 1 to the index to start from 1 instead of 0
      return {'value': block.id, 'name': optionTitle};
    });
  } else {
    allNextBlockOptions.value = props.page.workspaceBots.filter((bot) => bot.id !== props.page.id).map((workspaceBot, index) => {
      return {'value': workspaceBot.id, 'name': workspaceBot.name};
    });
  }
}

function updateComparisonDropdownAndValue() {
  comparisonOptions.value = []
  comparisonType.value = null
  operatorOptions.value = []
  const whenSelectedBlock = props.page.blocks.find((block) => block.id === props.block.whenBlockSelectedId)
  if (whenSelectedBlock) {
    const blockOptions = getBlockOptions(whenSelectedBlock)
    if (blockOptions.conditionVisible) {
      comparisonOptions.value = blockOptions.comparisons
      comparisonType.value = blockOptions.comparisonType
      if (comparisonType.value === ComparisonType.Dropdown) {
        const items = whenSelectedBlock.items
        if (items) {
          operatorOptions.value = items.map((item) => {
            return {'value': item.label, 'name': item.label}
          })
        }
      } else if (comparisonType.value === ComparisonType.Date) {

      }
    }
  }
}

onBeforeMount(() => {
  updatePreviousInputBlocksDropdowns()
  updateAllNextBlocksDropdowns()
  updateComparisonDropdownAndValue()
})

watch(() => props.page.blocks, () => {
  updatePreviousInputBlocksDropdowns()
  updateAllNextBlocksDropdowns()
  updateComparisonDropdownAndValue()
  blocksHistoryKey.value += 1;
}, {deep: true})

watch(() => props.block.whenBlockSelectedId, () => {
  delete props.block.isOperatorValue;
  updateComparisonDropdownAndValue()
})

watch([time],
    () => {
      const date = new Date(time.value);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      props.block.isOperatorValue = `${hours}:${minutes}`
    }
)

defineExpose({
  onSet,
  onUnset
})
</script>
