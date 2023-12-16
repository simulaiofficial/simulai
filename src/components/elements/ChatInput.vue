<template>
  <div class="py-3.5">
    <div class="relative">
      <input
        class="w-full h-full bg-gray-700 placeholder-gray-200 text-gray-300 border border-gray-500 focus:outline-none p-4 rounded-md"
        placeholder="Your message..."
        type="text"
        ref="input"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-gray-700 to-transparent rounded-md pointer-events-none"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType, ref} from 'vue'
import {BlockText} from '@/utils/types'
import Editor from './Editor.vue'

const textInput = ref('')

const props = defineProps({})
</script>
