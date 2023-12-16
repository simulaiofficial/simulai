<template>
  <div class="py-3.5">
    <div class="relative">
      <input
        class="w-full h-full bg-gray-700 placeholder-gray-200 text-gray-300 focus:outline-none p-4 rounded-md"
        style="border: 1px solid #706161;"
        :style="{backgroundColor: props.bgColor}"
        placeholder="Your message..."
        type="text"
        ref="input"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType, ref} from 'vue'
import {BlockText} from '@/utils/types'
import Editor from './Editor.vue'

const textInput = ref('')

const props = defineProps({
  bgColor: {
    type: String,
    required: true
  }
})
</script>
