<template>
  <div class="py-3.5">
    <div class="relative">
      <DatePicker ref="datePicker" v-model="date" :format="format" :language="language"
                  @update:model-value="handleDatePickerUpdate"
                  class="bg-gray-700 placeholder-gray-200 text-gray-300 focus:outline-none p-4 rounded-md"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, PropType, ref} from 'vue'
import {Block, BlockCalendarAnswer} from '@/utils/types'
import {
  setUpInitialValuesForBlock,
  setUpInitialValuesForBlockAnswer,
  unsetInitialValuesForBlockAnswer
} from '@/utils/utils'
import DatePicker from "vue3-datepicker";

const props = defineProps({
  block: {
    type: Object as PropType<BlockCalendarAnswer>,
    required: true,
  },
  bgColor: {
    type: String,
    required: true
  },
  page: {
    type: Object as PropType<{ id: string, name: string, isChat: boolean, isPreview: boolean, workspaceBots: WorkspaceBot[], blocks: Block[], saveUrl: string, uploadUrl: string, avatarUrl: string, askUrl: string, context: string, botName: string }>,
    required: true,
  }
})

// Define data
const format = 'yyyy-MM-dd';
const language = 'en'; // Change this to your desired language
const datePicker = ref(null)
const date = ref(null)

function onSet() {
  // Initialize the value of the date picker if it's not already set
  if (!props.block.details || !props.block.details.value) {
    date.value = new Date();
  }

  setUpInitialValuesForBlock(props.block)
  setUpInitialValuesForBlockAnswer(props.block)
}

function onUnset() {
  unsetInitialValuesForBlockAnswer(props.block)
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
  props.block.details.value = formattedDate;

  setTimeout(() => {
    datePicker.value.$el.querySelector('input').blur()
  }, 0)
}

onMounted(() => {
  date.value = new Date();
})

defineExpose({
  onSet,
  onUnset
})
</script>

<style scoped>
</style>
