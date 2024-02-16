<template>
  <div class="py-3.5">
    <div class="relative">
      <div>
        <button
            v-if="!props.page.isChat"
            @click="handleFileAttachment"
            :disabled="isUploading"
            class="mt-2 mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300 cursor-pointer"
            :class="{ 'opacity-50 cursor-not-allowed': isUploading }">
          {{ isUploading ? 'Uploading...' : 'Upload Image/GIF' }}
        </button>
        <div>
          <img v-if="props.block.details.value !== ''" :src="props.block.details.value" class="max-w-full h-auto" :style="{ width: props.block.size + '%' }">
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {onMounted, PropType, ref} from 'vue'
import {
  Block, BlockImage,
  BlockInputDecimalAnswer,
  BlockInputEmailAnswer,
  BlockInputNumberAnswer,
  BlockInputTextAnswer,
  BlockType, WorkspaceBot
} from '@/utils/types'
import {
  setUpInitialValuesForBlock,
  setUpInitialValuesForBlockAnswer,
  unsetInitialValuesForBlockAnswer
} from '@/utils/utils'

const props = defineProps({
  block: {
    type: Object as PropType<BlockImage>,
    required: true,
  },
  bgColor: {
    type: String,
    required: true
  },
  page: {
    type: Object as PropType<{ id: string, name: string, isChat: boolean, isPreview: boolean, workspaceBots: WorkspaceBot[], blocks: Block[], saveUrl: string, uploadUrl: string, avatarUrl: string, botName: string }>,
    required: true,
  }
})

const emit = defineEmits(['typingCompleted', 'showMessage'])

const isUploading = ref(false);

const handleFileAttachment = async () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  // fileInput.accept = 'image/*'; // You can adjust the file type as needed

  fileInput.addEventListener('change', async (event) => {
    // textInput.value = ''
    // inputPlaceholder.value = 'Uploading...'
    // emit('gotMessage', 'Ok, you are uploading...')
    // isUploading.value = true;
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name); // Append the filename

        isUploading.value = true;

        const response = await fetch(props.page.uploadUrl, {
          method: 'POST',
          body: formData,
        });

        isUploading.value = false;

        if (!response.ok) {
          const errorMessage = (await response.json()).detail
          emit('showMessage', errorMessage)
        } else {
          const responseData = await response.json();
          props.block.details.value = responseData.url
          // emit('nextBlock', responseData.url)
          // textInput.value = ''
          // inputPlaceholder.value = 'Your message...'
          // isUploading.value = false;
        }
      } catch (error) {
        // inputPlaceholder.value = 'Your message...'
        // emit('gotMessage', 'Oops, something went wrong, maybe try again...')
        // isUploading.value = false;
        console.error('Error uploading file:', error);
      }
    }
  });

  fileInput.click();
};

function disableInput(event) {
  event.preventDefault();
}

function onSet() {
  if (props.block.details.value) {
    props.block.details.value = ''
  }

  setUpInitialValuesForBlock(props.block)
  setUpInitialValuesForBlockAnswer(props.block)

  props.block.minRequired = false
  props.block.maxRequired = false
  props.block.size = 50
}

function onUnset() {
  unsetInitialValuesForBlockAnswer(props.block)
  delete props.block.minRequired
  delete props.block.maxRequired
  delete props.block.minChars
  delete props.block.maxChars
}

onMounted(() => {
  setTimeout(() => emit('typingCompleted'), 500);
});

defineExpose({
  onSet,
  onUnset
})
</script>
