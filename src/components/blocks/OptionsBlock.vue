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

<style lang="scss">
ul[data-type="taskList"] {
  list-style: none;
  padding: 0;

  p {
    margin: 0;
  }

  li {
    display: flex;

    > label {
      flex: 0 0 auto;
      margin-right: 0.5rem;
      user-select: none;
    }

    > div {
      flex: 1 1 auto;
    }

    ul li,
    ol li {
      display: list-item;
    }

    ul[data-type="taskList"] > li {
      display: flex;
    }
  }
}
</style>