<template>
  <div class="py-3.5">
    <div class="relative">
      <input
        class="chat-input w-full h-full bg-gray-700 placeholder-gray-500 text-gray-300 focus:outline-none p-4 rounded-md"
        :style="{ backgroundColor: props.bgColor }"
        placeholder="Your message..."
        type="text"
        @keyup.enter="handleSubmit"
        v-model="textInput"
        ref="input"
      />
      <button
        @click="handleSubmit"
        :class="['absolute right-3 top-3 bottom-3 text-gray-700 rounded-md p-1 cursor-pointer', buttonClass]"
      >
        <v-icon name="bi-arrow-up" class="w-5 h-5"/>
      </button>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref, computed } from 'vue';

const textInput = ref('');
const input = ref(null);

const buttonClass = computed(() => {
  return textInput.value ? 'bg-white' : 'bg-darker'; // 'bg-darker' is a custom class for darker background
});

const emit = defineEmits([
  'nextBlock'
])

const props = defineProps({
  bgColor: {
    type: String,
    required: true
  }
});

const handleSubmit = () => {
  textInput.value = ''
  emit('nextBlock')
};

function focusInput() {
  input.value.focus()
}

defineExpose({
  focusInput,
})
</script>


<style lang="scss" scoped>
.chat-input {
  border: 1px solid rgb(88, 76, 76);
  padding-right: 80px;
}

.chat-input:focus {
  border-color: rgb(100 95 96); /* Replace with your desired color */
}

.bg-darker {
  opacity: 0.2;
  pointer-events: none;
}
</style>
