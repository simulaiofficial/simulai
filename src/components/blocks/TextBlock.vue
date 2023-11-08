<template>
  <Editor v-model="props.block.details.value"
    class="py-1.5" />
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import {Block, BlockText} from '@/utils/types'
import { markdownToHtml } from '@/utils/utils'
import Editor from '../elements/Editor.vue'

const props = defineProps({
  block: {
    type: Object as PropType<BlockText>,
    required: true,
  }
})
</script>
