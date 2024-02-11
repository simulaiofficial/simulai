<template>
  <div class="py-3.5">
    <div class="relative">
      <Calendar ref="timePicker" v-model="time" timeOnly class="time-picker"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType, ref, watch} from 'vue'
import {Block, BlockTimeAnswer} from '@/utils/types'
import {
  setUpInitialValuesForBlock,
  setUpInitialValuesForBlockAnswer,
  unsetInitialValuesForBlockAnswer
} from '@/utils/utils'
import Calendar from 'primevue/calendar';

const props = defineProps({
  block: {
    type: Object as PropType<BlockTimeAnswer>,
    required: true,
  },
  bgColor: {
    type: String,
    required: true
  },
  page: {
    type: Object as PropType<{ id: string, name: string, isChat: boolean, isPreview: boolean, workspaceBots: WorkspaceBot[], blocks: Block[], saveUrl: string }>,
    required: true,
  }
})

const timePicker = ref(null)
const time = ref()

function onSet() {
  setUpInitialValuesForBlock(props.block)
  setUpInitialValuesForBlockAnswer(props.block)
}

function onUnset() {
  unsetInitialValuesForBlockAnswer(props.block)
}

watch([time],
    () => {
      const date = new Date(time.value);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      props.block.details.value = `${hours}:${minutes}`
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
