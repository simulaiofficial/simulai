<template>
  <div class="w-full py-0 h-[1px] bg-neutral-300 mt-[1.2rem]">
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import {Block, BlockDivider} from '@/utils/types'
import {setUpInitialValuesForBlock} from "@/utils/utils";

const props = defineProps({
  block: {
    type: Object as PropType<BlockDivider>,
    required: true,
  }
})

function onSet() {
  setUpInitialValuesForBlock(props.block)
}

defineExpose({
  onSet,
})
</script>
