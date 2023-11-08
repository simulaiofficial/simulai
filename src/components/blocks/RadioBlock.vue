<template>
  {{ props.block.details.value }}
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {Block, BlockRadio} from "@/utils/types"
import Editor from "../elements/Editor.vue"
import {ref} from 'vue'

const props = defineProps({
  block: {
    type: Object as PropType<BlockRadio>,
    required: true,
  }
});

const content = ref<Editor>()

function onSet() {
  props.block.details.value = `<ul data-type=\"taskList\"><li data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>${props.block.details.value}</p><p></p></div></li></ul>`
}

// function clickCheckbox(event) {
//   if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
//     debugger;
//     // Perform your action when a checkbox is clicked
//     // Access event.target to get the clicked checkbox element
//     // Get all checkbox inputs inside the Editor component
//     const checkbox = event.target;
//     const isChecked = checkbox.checked
//
//     const editorElement = content.value.$el;
//
//     const checkboxInputs = editorElement.querySelectorAll('input[type="checkbox"]');
//
//     // Uncheck all checkboxes
//     checkboxInputs.forEach((checkbx) => {
//       checkbx.checked = false;
//       // checkbx.parentElement.parentElement.setAttribute('data-checked', false.toString());
//     });
//     if (isChecked === true) {
//       checkbox.checked = isChecked
//       // checkbox.parentElement.parentElement.setAttribute('data-checked', true.toString());
//     }
//   }
// }

defineExpose({
  onSet,
})
</script>

<style lang="scss" scoped>
:deep(ul[data-type="taskList"]) {
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