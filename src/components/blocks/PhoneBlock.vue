<template>
  <div class="py-3.5">
    <div class="relative flex items-center">
      <Dropdown
        v-model="selectedCountryCode"
        :options="countryCodeOptions"
        optionLabel="name"
        optionValue="value"
        placeholder="Select Country Code"
        class="w-24 md:w-48 h-full mr-2"
      />
      <input v-model="phoneNumber" type="number" class="bg-gray-700 placeholder-gray-200 text-gray-300 focus:outline-none p-4 rounded-md h-full" placeholder="Phone Number"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, PropType, ref, watch} from 'vue'
import { Block, BlockCalendarAnswer } from '@/utils/types'
import { setUpInitialValuesForBlock, setUpInitialValuesForBlockAnswer, unsetInitialValuesForBlockAnswer } from '@/utils/utils'
import Dropdown from '../elements/Dropdown.vue';
import {CountryCodes} from "@/utils/consts";

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
const phoneNumber = ref('');
const selectedCountryCode = ref('');
const countryCodeOptions = ref(CountryCodes.map(country => ({
  value: country.dial_code,
  name: `${country.emoji} (${country.dial_code}) ${country.name} `,
})));

function onSet() {
  // Initialize the value of phone number and selected country code if it's not already set
  if (!props.block.details || !props.block.details.value) {
    phoneNumber.value = '';
    selectedCountryCode.value = '';
  }

  setUpInitialValuesForBlock(props.block)
  setUpInitialValuesForBlockAnswer(props.block)
}

function onUnset() {
  unsetInitialValuesForBlockAnswer(props.block)
}

function handleInputUpdate() {
  const formattedNumber = `${selectedCountryCode.value} ${phoneNumber.value}`;

  // Update block.details.value with the formatted phone number
  props.block.details.value = formattedNumber;
}

watch([selectedCountryCode, phoneNumber], () => {
  handleInputUpdate();
});

onMounted(() => {
  // Set initial values if not already set
  onSet();
})

defineExpose({
  onSet,
  onUnset
})
</script>

<style scoped>
</style>
