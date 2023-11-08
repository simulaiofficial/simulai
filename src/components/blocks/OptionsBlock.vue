<template>
  <ul data-type="taskList">
    <li v-for="item, i in props.block.items" data-checked="true">
      <label contenteditable="false">
        <input type="checkbox"
               checked="checked"><span></span>
      </label>
      <div><p
          :data-index="i"
          :contenteditable="true" spellcheck="false"
          @input="updateItemLabel"
          @keydown="keyDownHandler"
      >{{ item.label }}</p></div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {BlockOptions, isTextBlock, OptionItem} from "@/utils/types"

const props = defineProps({
  block: {
    type: Object as PropType<BlockOptions>,
    required: true,
  }
});

function onSet() {
  const items: Array<OptionItem> = []

  if (props.block.details.value) {
    items.push(
        {
          label: props.block.details.value,
          isChecked: false
        }
    )
    props.block.details.value = ''
  }
  props.block.items = items
}

function keyDownHandler(event: KeyboardEvent) {
  const cursorIsAtEnd = isCursorAtEnd(event.target)
  if (cursorIsAtEnd && event.key === 'Enter') {
    debugger;
    props.block.items.push({
      label: "",
      isChecked: false
    })
    event.stopPropagation()
    event.preventDefault()
  }
}

function updateItemLabel(event) {
  debugger;
  const index = event.target.getAttribute('data-index');
  props.block.items[index].label = event.target.textContent || '';
}

function isCursorAtEnd(contentEditableDiv) {
  debugger;
  const selection = window.getSelection();

  if (selection.rangeCount === 0) {
    return false;
  }

  const range = selection.getRangeAt(0);
  const endNode = contentEditableDiv.lastChild;
  const endOffset = endNode.textContent.length;

  return (
    range.endContainer === endNode &&
    range.endOffset === endOffset
  );
}

defineExpose({
  onSet,
})
</script>

<style lang="scss" scoped>
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