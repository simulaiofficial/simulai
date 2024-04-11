<template>
  <ul v-if="!props.page.isChat" data-type="taskList">
    <li v-for="item, i in props.block.items" ref="itemRefs" :data-index="i" :key="i" data-checked="true">
      <label class="switch" @click="updateItemState">
        -
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
  <div v-if="props.page.isChat" class="py-3.5">
    <div class="relative flex items-center">
      <Dropdown
          v-model="dropdownValue"
          :options="dropdownOptions"
          optionLabel="name"
          optionValue="value"
          placeholder="Select"
          class="w-24 md:w-48 h-full mr-2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType, ref, watch} from "vue";
import {Block, BlockDropdown, BlockRadio, OptionItem} from "@/utils/types"
import Editor from '../elements/Editor.vue'
import {
  setUpInitialValuesForBlock,
  setUpInitialValuesForBlockAnswer,
  unsetInitialValuesForBlockAnswer
} from "@/utils/utils";
import {onMounted} from "vue";
import Dropdown from '../elements/Dropdown.vue';

const props = defineProps({
  block: {
    type: Object as PropType<BlockDropdown>,
    required: true,
  },
  page: {
    type: Object as PropType<{ id: string, name: string, isChat: boolean, isPreview: boolean, workspaceBots: WorkspaceBot[], blocks: Block[], saveUrl: string, uploadUrl: string, avatarUrl: string, askUrl: string, context: string, botName: string }>,
    required: true,
  }
});

const emit = defineEmits([
  'deleteBlock',
  'moveToPrevLine',
  'moveToNextLine',
])

const itemRefs = ref([])
const dropdownValue = ref('')
const dropdownOptions = ref([]);

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

function updateItemState(event) {
  const index = parseInt(event.target.getAttribute('data-index'));

  // Set isChecked to false for all items
  props.block.items.forEach((item, i) => {
    if (i !== index) {
      item.isChecked = false;
    }
  });
}

function updateItemLabel(event) {
  const index = parseInt(event.target.getAttribute('data-index'));
  const updatedLabel = event.target.textContent || '';

  // Update the label for the selected item
  props.block.items[index].label = updatedLabel;
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

watch([dropdownValue],
    () => {
      props.block.items.forEach(item => item.isChecked = false)
      const checkedItem = props.block.items.find(item => item.label === dropdownValue.value)
      if(checkedItem) {
        checkedItem.isChecked = true
      }
    }
)

onMounted(() => {
  if (props.block.items) {
    dropdownOptions.value = props.block.items.map(item => ({
      value: item.label,
      name: item.label,
    }))
  }
});

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

/* Add these styles for the radio button */
.switch {
  position: relative;
  display: inline-block;
  width: 20px; /* Adjusted width */
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
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 50%; /* Changed border-radius for a circular shape */
}

.slider:before {
  content: "";
  height: 14px;
  width: 14px;
  position: absolute;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}
</style>
