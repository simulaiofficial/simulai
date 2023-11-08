<template>
  <ul data-type="taskList">
    <li v-for="item, i in props.block.items" data-checked="true">
      <label contenteditable="false">
        <input type="checkbox"
               checked="checked"><span></span>
      </label>
      <div><p
          :data-index="i"
          :contenteditable="true" spellcheck="false" @input="updateItemLabel">{{ item.label }}</p></div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {Block, BlockOptions, OptionItem} from "@/utils/types"
import Editor from "../elements/Editor.vue"
import {ref} from 'vue'

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

function updateItemLabel(event) {
  const index = event.target.getAttribute('data-index');
  const newText = event.target.textContent || '';
  props.block.items[index].label = newText;
}

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