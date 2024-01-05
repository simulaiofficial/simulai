<template>
  <ul data-type="taskList">
    <li v-for="item, i in props.block.items" ref="itemRefs" :data-index="i" :key="i" data-checked="true">
      <label class="switch">
        <input type="checkbox" v-model="item.isChecked">
        <span class="slider"></span>
      </label>
      <div>
        <Editor v-model="item.label" :data-index="i"
                :contenteditable="true" spellcheck="false"
                :showPlaceholder="false"
                :readonly="props.page.isChat"
                :typing="props.page.isChat"
                @input="updateItemLabel"
                @keydown="keyDownHandler"
                class=""/>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import {PropType, ref, watch} from "vue";
import {Block, BlockOptions, isTextBlock, OptionItem} from "@/utils/types"
import Editor from '../elements/Editor.vue'
import {
  setUpInitialValuesForBlock,
  setUpInitialValuesForBlockAnswer,
  unsetInitialValuesForBlockAnswer
} from "@/utils/utils";

const props = defineProps({
  block: {
    type: Object as PropType<BlockOptions>,
    required: true,
  },
  page: {
    type: Object as PropType<{ name: string, isChat: boolean, isPreview: boolean, blocks: Block[], saveUrl: string }>,
    required: true,
  }
});

const emit = defineEmits([
  'deleteBlock',
  'moveToPrevLine',
  'moveToNextLine',
])

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
  } else {
    items.push(
        {
          label: '',
          isChecked: false
        }
    )
  }
  props.block.items = items
  setUpInitialValuesForBlock(props.block)
  setUpInitialValuesForBlockAnswer(props.block)
}

function onUnset() {
  delete props.block.items
  unsetInitialValuesForBlockAnswer(props.block)
}

function keyDownHandler(event) {
  const index = parseInt(event.target.getAttribute('data-index'))

  if (event.key === 'Enter') {
    const cursorIsAtEnd: boolean = isCursorAtEnd(event.target)
    if (cursorIsAtEnd) {
      event.stopPropagation()
      event.preventDefault()
      props.block.items.splice(index + 1, 0, {
        label: "",
        isChecked: false
      })
      setTimeout(() => {
        const liNode = findItemRef(index + 1);
        setCursorAtBeginning(liNode.querySelector('p'))
      })
    }
  } else if (event.key === 'Backspace') {
    const cursorIsAtBeginning: boolean = isCursorAtBeginning(event.target)
    if (cursorIsAtBeginning) {
      props.block.items.splice(index, 1)
      if (index > 0) {
        const liNode = findItemRef(index - 1);
        setTimeout(() => {
          setCursorAtBeginning(liNode.querySelector('p'))
        })
      }
    }
  } else if (event.key === 'ArrowUp') {
    if (index > 0) {
      const liNode = findItemRef(index - 1);
      setTimeout(() => {
        setCursorAtBeginning(liNode.querySelector('p'))
      })
    } else {
      emit('moveToPrevLine')
    }
  } else if (event.key === 'ArrowDown') {
    if (index < props.block.items.length - 1) {
      const liNode = findItemRef(index + 1);
      setTimeout(() => {
        setCursorAtBeginning(liNode.querySelector('p'))
      })
    } else {
      emit('moveToNextLine')
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
  // const endNode = paragraphElement.lastChild;
  const endOffset = paragraphElement.textContent.length;

  return (
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

    // if (element.innerHTML === '') {
    //   // If the paragraph is empty, insert a zero-width space character
    //   element.innerHTML = '&#8203;'; // Zero-width space character
    // }

    // range.setStart(offsetNode.firstChild || offsetNode, caretPos - offset)
    // range.setEnd(offsetNode.firstChild || offsetNode, caretPos - offset)
    // selection?.removeAllRanges()
    // selection?.addRange(range)

    range.setStart(element, 0);
    range.setEnd(element, 0);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);

    element.focus();

    setTimeout(() => {
      element.innerHTML = element.innerHTML.replace(/[\u200B-\u200D\uFEFF]/g, '');
    })
  }
}

function findItemRef(index) {
  const foundRefs = itemRefs.value.filter((ref) => parseInt(ref.getAttribute('data-index')) === index)
  return foundRefs[0]
}

function goIntoStart() {
  if (itemRefs.value.length > 0) {
    const liNode = findItemRef(0);
    setCursorAtBeginning(liNode.querySelector('p'))
  }
}

function goIntoEnd() {
  if (itemRefs.value.length > 0) {
    const liNode = findItemRef(itemRefs.value.length - 1);
    setCursorAtBeginning(liNode.querySelector('p'))
  }
}

watch(
    () => props.block.items,
    (newItems) => {
      // Check if there are no items and emit an action
      if (newItems && newItems.length === 0) {
        emit('deleteBlock');
      }
    },
    {deep: true}
);

defineExpose({
  onSet,
  onUnset,
  goIntoStart,
  goIntoEnd
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

/* Add these styles for the switch */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0; /* Adjusted right property to 0 */
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}
</style>