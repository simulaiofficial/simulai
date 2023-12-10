<template>
  <Editor
    v-model="props.block.details.value"
    class="py-1.5 border-l-3 border-black border-solid px-3"
  />
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {BlockQuote} from "@/utils/types"
import {setUpInitialValuesForBlock} from '@/utils/utils'
import Editor from "../elements/Editor.vue"

const props = defineProps({
  block: {
    type: Object as PropType<BlockQuote>,
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
