<template>
  <ul data-type="taskList">
    <li v-for="item, i in props.block.items" ref="itemRefs" :data-index="i" :key="i" data-checked="true">
      <label contenteditable="false">
        <input type="checkbox"
               v-model="item.isChecked"><span></span>
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
import {PropType, ref} from "vue";
import {BlockOptions, isTextBlock, OptionItem} from "@/utils/types"

const props = defineProps({
  block: {
    type: Object as PropType<BlockOptions>,
    required: true,
  }
});

const itemRefs = ref([])

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

function keyDownHandler(event) {
  const index = parseInt(event.target.getAttribute('data-index'))

  if (event.key === 'Enter') {
    console.log(itemRefs.value)
    const cursorIsAtEnd: boolean = isCursorAtEnd(event.target)
    if (cursorIsAtEnd) {
      event.stopPropagation()
      event.preventDefault()
      props.block.items.splice(index + 1, 0, {
        label: "",
        isChecked: false
      })
      setTimeout(() => {
        const createdTextNode = findItemRef(index + 1);
        setCursorAtBeginning(createdTextNode.querySelector('p'))
      })
    }
  } else if (event.key === 'Backspace') {
    const cursorIsAtBeginning: boolean = isCursorAtBeginning(event.target)
    if (cursorIsAtBeginning) {
      props.block.items.splice(index, 1)
    }
  } else if (event.key === 'ArrowUp') {
    if (index > 0) {
      const liNode = findItemRef(index-1);
      setCursorAtBeginning(liNode.querySelector('p'))
    }
  } else if (event.key === 'ArrowDown') {
    if (index < props.block.items.length) {
      const liNode = findItemRef(index+1);
      setCursorAtBeginning(liNode.querySelector('p'))
    }
  }
}

function updateItemLabel(event) {
  const index = parseInt(event.target.getAttribute('data-index'))
  props.block.items[index].label = event.target.textContent || '';
}

function isCursorAtEnd(paragraphElement) {
  const selection = window.getSelection();

  if (selection.rangeCount === 0) {
    return false;
  }

  const range = selection.getRangeAt(0);
  const endNode = paragraphElement.lastChild;
  const endOffset = endNode.textContent.length;

  return (
      range.endContainer === endNode &&
      range.endOffset === endOffset
  );
}

function isCursorAtBeginning(paragraphElement) {
  // Get the selection object
  var selection = window.getSelection();

  // Check if there is a selection and it is a Range
  if (selection.rangeCount > 0) {
    var range = selection.getRangeAt(0);

    if (range.startOffset === 0) {
      return true;
    }
  }

  return false;
}

function setCursorAtBeginning(element) {
  if (element) {
    const range = document.createRange();
    const selection = window.getSelection();

    range.setStart(element, 0);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);

    element.focus();
  }
}

function findItemRef(index) {
  const foundRefs = itemRefs.value.filter((ref) => parseInt(ref.getAttribute('data-index')) === index)
  return foundRefs[0]
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