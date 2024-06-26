<!-- Adapted from https://tiptap.dev/installation/vue3 -->
<template>
  <editor-content :editor="editor" spellcheck="false"
                  @keyup.enter.capture.prevent="() => {}"
                  @keydown.enter.capture.prevent="() => {}"
  />
</template>

<script setup lang="ts">
import {computed, onMounted, watch} from 'vue'
import BulletList from '@tiptap/extension-bullet-list'
import Document from '@tiptap/extension-document'
import ListItem from '@tiptap/extension-list-item'
import Paragraph from '@tiptap/extension-paragraph'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import {useEditor, EditorContent} from '@tiptap/vue-3'
import {markdownToHtml, htmlToMarkdown} from '@/utils/utils'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  showPlaceholder: {
    type: Boolean,
    default: true
  },
  readonly: {
    type: Boolean,
    default: false
  },
  typing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'typingCompleted'])

const value = computed({
  get() {
    const mdValue = props.modelValue
    if (mdValue) {
      return markdownToHtml(mdValue)
    } else {
      return '<p></p>'
    }
  },
  set(newValue) {
    emit('update:modelValue', htmlToMarkdown(newValue))
  },
})

let extensions = [
  Document,
  Paragraph,
  Text,
  Bold,
  Italic,
  Link,
  BulletList,
  ListItem,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
]

// if(props.typing) {
//   extensions.push(Link)
// }

if(props.showPlaceholder) {
  extensions.push(Placeholder.configure({
    placeholder: 'Type \'/\' for a menu'
  }))
}

const editor = useEditor({
  extensions: extensions,
  editorProps: {
    // Removing default behavior for drop event
    handleDrop: () => true
  },
  // content: value.value,
  onUpdate: () => {
    value.value = htmlToMarkdown(editor.value?.getHTML() || '')
  },
  editable: !props.readonly
})

watch(() => props.modelValue, value => {
  const isSame = htmlToMarkdown(editor.value?.getHTML() || '') === value
  if (isSame) return
  editor.value?.commands.setContent(markdownToHtml(value), false)
})


// Typing effect function for HTML as text
function typeHtml(html, index = 0) {
  if (index < html.length) {
    editor.value?.commands.insertContent(html.charAt(index), { updateSelection: false });
    setTimeout(() => typeHtml(html, index + 1), 20); // Adjust delay for typing speed
  } else {
    // After typing out the entire string, replace it with actual HTML
    editor.value?.commands.setContent(html, false);
    emit('typingCompleted')
  }
}

// Trigger the typing effect on component mount or based on a specific condition
onMounted(() => {
  if(props.typing) {
    // typeHtml(htmlToMarkdown(value.value));
    const htmlValue = value.value
    typeHtml(htmlValue);
    // typeHtml(value.value);
  } else {
    const htmlValue = value.value
    editor.value?.commands.setContent(htmlValue, false);
  }
});
</script>
