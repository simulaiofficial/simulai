<template>
  <div class="py-3.5">
    <div class="relative">
      <DatePicker ref="datePicker" v-model="block.details.value" :format="format" :language="language"
                  @update:model-value="handleDatePickerUpdate" class="bg-gray-700 placeholder-gray-200 text-gray-300 focus:outline-none p-4 rounded-md"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, PropType, ref} from 'vue'
import {Block, BlockCalendarAnswer} from '@/utils/types'
import { setUpInitialValuesForBlock, setUpInitialValuesForBlockAnswer, unsetInitialValuesForBlockAnswer } from '@/utils/utils'
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
    type: Object as PropType<{ name: string, isChat: boolean, isPreview: boolean, blocks: Block[], saveUrl: string }>,
    required: true,
  }
})

// Define data
const format = 'yyyy-MM-dd';
const language = 'en'; // Change this to your desired language
const datePicker = ref(null)

function onSet() {
  // Initialize the value of the date picker if it's not already set
  if (!props.block.details || !props.block.details.value) {
    props.block.details.value = new Date();
  }

  setUpInitialValuesForBlock(props.block)
  setUpInitialValuesForBlockAnswer(props.block)
}

function onUnset() {
  unsetInitialValuesForBlockAnswer(props.block)
}

function handleDatePickerUpdate() {
  setTimeout(() => {
    datePicker.value.$el.querySelector('input').blur()
  }, 0)
}

onMounted(() => {
  props.block.details.value = new Date();
})

defineExpose({
  onSet,
  onUnset
})
</script>

<style scoped>
</style>
