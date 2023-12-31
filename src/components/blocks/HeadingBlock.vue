<template>
  <Editor v-model="props.block.details.value"
          :readonly="props.page.isChat"
          :typing="props.page.isChat"
          :class="headingConfig[props.block.type]?.class"
    class="focus:outline-none focus-visible:outline-none w-full py-1.5 font-semibold" />
</template>

<script setup lang="ts">
import {PropType, ref} from 'vue'
import {Block, BlockHeading, BlockType} from '@/utils/types'
import {setUpInitialValuesForBlock} from "@/utils/utils";
import Editor from '../elements/Editor.vue'

const headingConfig = {
  [BlockType.H1]: {
    placeholder: 'Heading 1',
    class: 'text-4xl font-semibold',
  },
  [BlockType.H2]: {
    placeholder: 'Heading 2',
    class: 'text-3xl font-medium',
  },
  [BlockType.H3]: {
    placeholder: 'Heading 3',
    class: 'text-2xl font-medium',
  },
  // Irrelevant BlockTypes
  [BlockType.Text]: null,
  [BlockType.Divider]: null,
  [BlockType.Quote]: null,
}

const props = defineProps({
  block: {
    type: Object as PropType<BlockHeading>,
    required: true,
  },
  page: {
    type: Object as PropType<{ name: string, isChat: boolean, blocks: Block[], saveUrl: string }>,
    required: true,
  }
})

const content = ref<HTMLDivElement>()

// function onSet () {
//   if (content.value && props.block.details.value) content.value.innerText = props.block.details.value
//   setUpInitialValuesForBlock(props.block)
// }

function onSet() {
  setUpInitialValuesForBlock(props.block)
}

defineExpose({
  onSet,
})
</script>
