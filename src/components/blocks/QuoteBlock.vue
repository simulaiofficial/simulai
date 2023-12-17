<template>
  <Editor
    v-model="props.block.details.value"
    :readonly="props.page.isChat"
    class="py-1.5 border-l-3 border-black border-solid px-3"
  />
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {Block, BlockQuote} from "@/utils/types"
import {setUpInitialValuesForBlock} from '@/utils/utils'
import Editor from "../elements/Editor.vue"

const props = defineProps({
  block: {
    type: Object as PropType<BlockQuote>,
    required: true,
  },
  page: {
    type: Object as PropType<{ name: string, blocks: Block[] }>,
    required: true,
  }
});

function onSet() {
  setUpInitialValuesForBlock(props.block)
}

defineExpose({
  onSet,
})
</script>
