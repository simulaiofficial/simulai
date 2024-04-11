<template>
  <div class="py-3.5">
    <div class="relative">
      <CustomSlider :min="block.min" :max="block.max" :step="block.step" v-model="props.block.details.value" />
    </div>
  </div>
</template>


<script setup lang="ts">
import {PropType, ref} from 'vue'
import {Block, BlockInputNumberAnswer, BlockInputTextAnswer, BlockNumberRangeAnswer, BlockType} from '@/utils/types'
import {
  setUpInitialValuesForBlock,
  setUpInitialValuesForBlockAnswer,
  unsetInitialValuesForBlockAnswer
} from '@/utils/utils'

import CustomSlider from "../elements/CustomSlider.vue";

const props = defineProps({
  block: {
    type: Object as PropType<BlockNumberRangeAnswer>,
    required: true,
  },
  bgColor: {
    type: String,
    required: true
  },
  page: {
    type: Object as PropType<{ id: string, name: string, isChat: boolean, isPreview: boolean, workspaceBots: WorkspaceBot[], blocks: Block[], saveUrl: string, uploadUrl: string, avatarUrl: string, askUrl: string, context: string, botName: string }>,
    required: true,
  }
})

function onSet() {
  if (props.block.details) {
    props.block.details.value = 1
  }

  setUpInitialValuesForBlock(props.block)
  setUpInitialValuesForBlockAnswer(props.block)

  delete props.block.minRequired
  delete props.block.maxRequired
  props.block.min = 1
  props.block.max = 100
  props.block.step = 1
}

function onUnset() {
  unsetInitialValuesForBlockAnswer(props.block)
  delete props.block.minRequired
  delete props.block.maxRequired
  delete props.block.minChars
  delete props.block.maxChars
  delete props.block.min
  delete props.block.max
  delete props.block.step
}

defineExpose({
  onSet,
  onUnset
})
</script>

<style scoped>
.slider {
  /* overwrite slider styles */
  width: 200px;
}
</style>
