<template>
  <div class="py-3.5">
    <div class="relative">
      <!-- File Attachment Button -->
      <button
          @click="handleFileAttachment"
          :disabled="!props.isUploadEnabled"
          class="file-attach-button absolute left-3 top-3 bottom-3 rounded-md p-1 cursor-pointer"
      >
        <v-icon name="ri-attachment-2" class="w-5 h-5"
                :class="{'icon-white': props.isUploadEnabled, 'text-slate-400': !props.isUploadEnabled}"/>
        <!-- Adjust icon name as needed -->
      </button>

      <!-- Chat Input -->
      <input
          class="chat-input w-full h-full bg-gray-700 placeholder-gray-500 text-gray-300 focus:outline-none p-4 rounded-md"
          :style="{ backgroundColor: props.bgColor }"
          :placeholder="inputPlaceholder"
          type="text"
          :disabled="isUploading"
          @keyup.enter.prevent.stop="handleSubmit"
          @keydown.enter.prevent.stop="() => {}"
          v-model="textInput"
          ref="input"
      />

      <!-- Send Button -->
      <button
          @click="handleSubmit"
          :class="['absolute right-3 top-3 bottom-3 text-gray-700 rounded-md p-1 cursor-pointer', buttonClass]"
      >
        <v-icon name="bi-arrow-up" class="w-5 h-5"/>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';

const textInput = ref('');
const input = ref(null);
const inputPlaceholder = ref('Your message...');
const isUploading = ref(false);

const buttonClass = computed(() => {
  return textInput.value ? 'bg-white' : 'bg-darker'; // 'bg-darker' is a custom class for darker background
});

const emit = defineEmits([
  'nextBlock',
  'gotMessage'
])

const props = defineProps({
  isPreview: {
    type: Boolean,
    required: true
  },
  bgColor: {
    type: String,
    required: true
  },
  uploadUrl: {
    type: String,
    required: true
  },
  isUploadEnabled: {
    type: Boolean,
    required: true
  }
});

const handleSubmit = () => {
  emit('nextBlock', textInput.value)
  textInput.value = ''
};

const handleFileAttachment = async () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  // fileInput.accept = 'image/*'; // You can adjust the file type as needed

  fileInput.addEventListener('change', async (event) => {
    textInput.value = ''
    inputPlaceholder.value = 'Uploading...'
    emit('gotMessage', 'Ok, you are uploading...')
    isUploading.value = true;
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (props.isPreview) {
        setTimeout(() => {
          emit('nextBlock', 'https://preview.url/file/1234')
        }, 3000);
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name); // Append the filename

        const response = await fetch(props.uploadUrl, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorMessage = (await response.json()).detail
          emit('gotMessage', errorMessage)
        } else {
          const responseData = await response.json();
          emit('nextBlock', responseData.url)
          textInput.value = ''
          inputPlaceholder.value = 'Your message...'
          isUploading.value = false;
        }
      } catch (error) {
        inputPlaceholder.value = 'Your message...'
        emit('gotMessage', 'Oops, something went wrong, maybe try again...')
        isUploading.value = false;
        console.error('Error uploading file:', error);
      }
    }
  });

  fileInput.click();
};

function focusInput() {
  input.value.focus()
}

defineExpose({
  focusInput,
})
</script>

<style lang="scss" scoped>
.chat-input {
  border: 1px solid rgb(88, 76, 76);
  padding-right: 50px;
  padding-left: 50px; /* Adjust padding for the file attachment button */
}

.chat-input:focus {
  border-color: rgb(100 95 96); /* Replace with your desired color */
}

.file-attach-button {
  background-color: transparent; /* Transparent background */
  border: none; /* Remove default button border */
}

.icon-white {
  color: white; /* White color for the icon */
}

.bg-darker {
  opacity: 0.2;
  pointer-events: none;
}
</style>
