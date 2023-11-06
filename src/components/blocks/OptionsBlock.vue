<template>
  <Editor ref="content"
    v-model="props.block.details.value"
    class="py-1.5 border-l-3 border-black border-solid px-3"
  />
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { Block } from "@/utils/types"
import { markdownToHtml } from '@/utils/utils'
import Editor from "../elements/Editor.vue"
import { ref } from 'vue'

const props = defineProps({
  block: {
    type: Object as PropType<Block>,
    required: true,
  }
});

const content = ref<Editor>()

function onSet () {
  props.block.details.value = `<ul data-type=\"taskList\"><li data-checked=\"true\" data-type=\"taskItem\"><label><input type=\"checkbox\" checked=\"checked\"><span></span></label><div><p>${props.block.details.value}</p><p></p></div></li></ul>`
}

defineExpose({
  onSet,
})
</script>