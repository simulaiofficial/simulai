<template>
  <div class="py-3.5">
    <div class="relative">
      <Rating ref="ratingPicker" class="rating-picker" :cancel="false" v-model="rating" :stars="10" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType, ref, watch} from 'vue'
import {Block, BlockRatingAnswer} from '@/utils/types'
import {
  setUpInitialValuesForBlock,
  setUpInitialValuesForBlockAnswer,
  unsetInitialValuesForBlockAnswer
} from '@/utils/utils'
import Rating from 'primevue/rating';

const props = defineProps({
  block: {
    type: Object as PropType<BlockRatingAnswer>,
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

const ratingPicker = ref(null)
const rating = ref()

function onSet() {
  setUpInitialValuesForBlock(props.block)
  setUpInitialValuesForBlockAnswer(props.block)
}

function onUnset() {
  unsetInitialValuesForBlockAnswer(props.block)
}

watch([rating],
    () => {
      const value = rating.value
      props.block.details.value = value
    }
)

defineExpose({
  onSet,
  onUnset
})
</script>

<style lang="scss">
.time-picker input {
  background-color: #374151;
  color: #ffffff;
  &:focus {
    border: none;
    outline: none;
  }
}
</style>
