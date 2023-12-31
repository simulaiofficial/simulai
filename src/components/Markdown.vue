<template>
  <pre class="simulai-md whitespace-pre-wrap p-10 m-0 text-base">
{{ JSON.stringify(props.page.blocks, null, 2) }}
  </pre>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Block } from '@/utils/types'

const props = defineProps({
  page: {
    type: Object as PropType<{ name: string, isChat: boolean, blocks: Block[], saveUrl: string }>,
    required: true,
  }
})
</script>
