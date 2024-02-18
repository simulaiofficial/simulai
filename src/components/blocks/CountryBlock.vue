<template>
  <div class="py-3.5">
    <div class="relative flex items-center">
      <Dropdown
        v-model="selectedCountry"
        :options="countryOptions"
        optionLabel="name"
        optionValue="value"
        placeholder="Select Country"
        class="w-24 md:w-48 h-full mr-2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, PropType, ref, watch} from 'vue'
import {Block, BlockCountryAnswer} from '@/utils/types'
import { setUpInitialValuesForBlock, setUpInitialValuesForBlockAnswer, unsetInitialValuesForBlockAnswer } from '@/utils/utils'
import Dropdown from '../elements/Dropdown.vue';
import {CountryCodes} from "@/utils/consts";

const props = defineProps({
  block: {
    type: Object as PropType<BlockCountryAnswer>,
    required: true,
  },
  bgColor: {
    type: String,
    required: true
  },
  page: {
    type: Object as PropType<{ id: string, name: string, isChat: boolean, isPreview: boolean, workspaceBots: WorkspaceBot[], blocks: Block[], saveUrl: string, uploadUrl: string, avatarUrl: string, botName: string }>,
    required: true,
  }
})

const selectedCountry = ref('');
const countryOptions = ref(CountryCodes.map(country => ({
  value: country.name,
  name: `${country.emoji} ${country.name}`,
})));

function onSet() {
  // Initialize the value of phone number and selected country code if it's not already set
  if (!props.block.details || !props.block.details.value) {
    selectedCountry.value = '';
  }

  setUpInitialValuesForBlock(props.block)
  setUpInitialValuesForBlockAnswer(props.block)
}

function onUnset() {
  unsetInitialValuesForBlockAnswer(props.block)
}

function handleInputUpdate() {
  const country = `${selectedCountry.value}`;

  // Update block.details.value with the formatted phone number
  props.block.details.value = country;
}

watch([selectedCountry], () => {
  handleInputUpdate();
});

onMounted(() => {
  // Set initial values if not already set
  // onSet();
})

defineExpose({
  onSet,
  onUnset
})
</script>

<style scoped>
</style>
