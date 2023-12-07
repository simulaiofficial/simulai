<template>
  <div ref="dropdownContainer" class="relative">
    <div
      class="p-2 w-full bg-gray-700 placeholder-gray-200 text-gray-300 border border-gray-500 focus:outline-none rounded-md cursor-pointer"
      @click="toggleDropdown"
    >
      {{ selectedOption ? selectedOption[optionLabel] : placeholder }}
    </div>
    <transition name="fade">
      <div
        v-if="isDropdownOpen"
        class="absolute z-10 top-full left-0 mt-2 w-full bg-gray-700 border border-gray-500 rounded-md shadow-lg"
      >
        <div
          v-for="(option, index) in options"
          :key="option[optionValue]"
          class="p-2 cursor-pointer hover:bg-gray-600"
          :class="{ 'rounded-t-md': index === 0, 'rounded-b-md': index === options.length - 1 }"
          @click="selectOption(option)"
        >
          {{ option[optionLabel] }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {ref, defineProps, defineEmits, onMounted, watch} from 'vue';

const dropdownContainer = ref(null)

const { modelValue, options, placeholder, optionValue, optionLabel } = defineProps([
  'modelValue',
  'options',
  'placeholder',
  'optionValue',
  'optionLabel',
]);

const emits = defineEmits(['update:modelValue']);

const isDropdownOpen = ref(false);
const selectedOption = ref(null);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function selectOption(option) {
  selectedOption.value = option;
  isDropdownOpen.value = false;

  emits('update:modelValue', option[optionValue]);
}

const closeDropdownOnOutsideClick = (event) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener('mousedown', closeDropdownOnOutsideClick);
  if(modelValue) {
    const selected = options.find(option => option.value === modelValue)
    selectedOption.value = selected
  }
});

</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
