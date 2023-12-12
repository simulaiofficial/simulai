<template>
  <div class="flex flex-col" :style="{ color: textColor }">
    <div class="w-full" :style="{ backgroundColor: bgColor }">
      <Simulai :bgColor="bgColor" :textColor="textColor" :page="page"/>
    </div>
    <div class="w-full overflow-y-auto" style="background-color: #202123;">
      <Markdown :page="page"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import Markdown from './Markdown.vue'
import Simulai from './Simulai.vue'

const bgColor = "#343541"
const textColor = "#ffffff"

const page = ref({
  // Initial empty structure
  name: '',
  blocks: []
});

// Function to fetch data
async function fetchData() {
  try {
    const response = await fetch('http://127.0.0.1:8000/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers you need
      },
      body: JSON.stringify({
        // Your request payload
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Update the page variable with the response data
    page.value = data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Fetch data when component mounts
onMounted(fetchData);

// const page = ref({
//   name: '🤖 simulai',
//   blocks: [{
//     id: uuidv4(),
//     type: BlockType.H1,
//     details: {
//       value: 'Get Started'
//     },
//   }, {
//     id: uuidv4(),
//     type: BlockType.Divider,
//     details: {},
//   }, {
//     id: uuidv4(),
//     type: BlockType.Text,
//     details: {
//       value: '👋 Welcome! This is a private page for you to play around with.'
//     },
//   }, {
//     id: uuidv4(),
//     type: BlockType.Text,
//     details: {
//       value: 'Give these things a try:'
//     },
//   }, {
//     id: uuidv4(),
//     type: BlockType.Text,
//     details: {
//       value: '1. Hover on the left of each line for quick actions'
//     },
//   }, {
//     id: uuidv4(),
//     type: BlockType.Text,
//     details: {
//       value: '2. Click on the + button to add a new line'
//     },
//   }, {
//     id: uuidv4(),
//     type: BlockType.Text,
//     details: {
//       value: '3. Drag the ⋮⋮ button to reorder'
//     },
//   }, {
//     id: uuidv4(),
//     type: BlockType.Text,
//     details: {
//       value: '4. Click the trash icon to delete this block'
//     },
//   }, {
//     id: uuidv4(),
//     type: BlockType.Text,
//     details: {
//       value: '5. **Bold** and *italicize* using markdown e.g. \\*\\*bold\\*\\* and \\*italics\\*'
//     },
//   }, {
//     id: uuidv4(),
//     type: BlockType.Text,
//     details: {
//       value: '6. Add headers and dividers with \'#\', \'##\' or \'---\' followed by a space'
//     },
//   }, {
//     id: uuidv4(),
//     type: BlockType.Text,
//     details: {
//       value: '7. Type \'/\' for a menu to quickly switch blocks and search by typing'
//     },
//   },]
// })
</script>
