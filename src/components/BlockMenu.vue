<template>
  <div ref="container" as="div" class="relative w-max h-max">
    <div @click="open = !open; openTurnInto = false; openMainMenu = true;" class="handle" data-test-id="block-menu">
      <Tooltip
          value="<span class='text-neutral-400'><span class='text-white'>Drag</span> to move<br/><span class='text-white'>Click</span> to open menu</span>">
        <v-icon name="md-dragindicator" @mouseup="$event.stopPropagation()"
                class="w-6 h-6 hover:bg-slate-800 hover:text-neutral-400 p-0.5 rounded group-hover:opacity-100 opacity-0"
                :class="open ? 'opacity-100' : ''"/>
      </Tooltip>
    </div>
    <div v-show="open" class="block-menu">
      <div ref="mainMenu"
           v-if="openMainMenu"
           class="main-menu w-[10rem] lg:w-[12rem] xl:w-[16rem] absolute z-10 shadow-block rounded py-1 text-white text-sm bg-slate-800 max-h-[24rem] overflow-auto focus-visible:outline-none top-0">
        <div class="text-left divide-y">
          <div class="px-2 py-2">
            <div class="px-2 pb-2 font-semibold uppercase text-xs text-neutral-400">Menu</div>
            <div @click="openTurnIntoMenu"
                 class="px-2 py-1 rounded flex items-center gap-2 hover:bg-slate-600" data-test-id="turn-into-menu">
              <span class="truncate">Turn Into</span>
            </div>
            <div v-if="BlockComponents[props.block.type].options.nameVisible"
                 class="px-2 py-1 rounded flex items-center gap-2 hover:bg-slate-600">
              <span class="truncate flex-shrink-0">Set name</span>
              <div class="flex items-center ml-auto">
                <!-- Added a container for the switch, using ml-auto to push it to the right -->
                <label class="switch">
                  <input type="checkbox" v-model="props.block.setName">
                  <span class="slider"></span>
                </label>
              </div>
              <!-- Add input field for minimum characters -->
              <div v-if="props.block.setName" class="ml-1">
                <input @click.stop @input.stop @mouseup.stop v-model="props.block.name" type="text" class="w-16 px-1 border rounded border-1 text-gray-400 bg-gray-800 border-blue-600 focus:border-blue-500 focus:outline-none outline-none" min="1" placeholder="">
              </div>
            </div>
            <div v-if="BlockComponents[props.block.type].options.hideVisible"
                 class="px-2 py-1 rounded flex items-center gap-2 hover:bg-slate-600">
              <span class="truncate">Hide block</span>
              <div class="flex items-center ml-auto">
                <!-- Added a container for the switch, using ml-auto to push it to the right -->
                <label class="switch">
                  <input type="checkbox" v-model="props.block.isHidden">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            <div v-if="BlockComponents[props.block.type].options.requiredVisible"
                 class="px-2 py-1 rounded flex items-center gap-2 hover:bg-slate-600">
              <span class="truncate">Required</span>
              <div class="flex items-center ml-auto">
                <!-- Added a container for the switch, using ml-auto to push it to the right -->
                <label class="switch">
                  <input type="checkbox" v-model="props.block.isRequired">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            <div v-if="BlockComponents[props.block.type].options.minVisible"
                 class="px-2 py-1 rounded flex items-center gap-2 hover:bg-slate-600">
              <span class="truncate flex-shrink-0">Min characters</span>
              <div class="flex items-center ml-auto">
                <!-- Added a container for the switch, using ml-auto to push it to the right -->
                <label class="switch">
                  <input type="checkbox" v-model="props.block.minRequired">
                  <span class="slider"></span>
                </label>
              </div>
              <!-- Add input field for minimum characters -->
              <div v-if="props.block.minRequired" class="ml-2">
                <input @click.stop @input.stop @mouseup.stop v-model="props.block.minChars" type="number" class="w-16 px-1 border rounded border-1 text-gray-400 bg-gray-800 border-blue-600 focus:border-blue-500 focus:outline-none outline-none" min="1" placeholder="">
              </div>
            </div>
            <div v-if="BlockComponents[props.block.type].options.maxVisible"
                 class="px-2 py-1 rounded flex items-center gap-2 hover:bg-slate-600">
              <span class="truncate flex-shrink-0">Max characters</span>
              <div class="flex items-center ml-auto">
                <!-- Added a container for the switch, using ml-auto to push it to the right -->
                <label class="switch">
                  <input type="checkbox" v-model="props.block.maxRequired">
                  <span class="slider"></span>
                </label>
              </div>
              <!-- Add input field for minimum characters -->
              <div v-if="props.block.maxRequired" class="ml-1">
                <input @click.stop @input.stop @mouseup.stop v-model="props.block.maxChars" type="number" class="w-16 px-1 border rounded border-1 text-gray-400 bg-gray-800 border-blue-600 focus:border-blue-500 focus:outline-none outline-none" min="1" placeholder="">
              </div>
            </div>
            <hr class="border-t border-solid my-3" style="border-color: #684141"/>
            <div @click="open = false; emit('deleteBlock')"
                 class="px-2 py-1 rounded flex items-center gap-2 hover:bg-slate-600" data-test-id="turn-into-menu">
              <v-icon name="hi-trash"
                class="w-6 h-6 p-0.5 rounded opacity-100 opacity-0"/><span class="truncate">Delete</span>
            </div>
            <div @click="open = false; emit('duplicateBlock')"
                 class="px-2 py-1 rounded flex items-center gap-2 hover:bg-slate-600" data-test-id="turn-into-menu">
              <v-icon name="pr-clone"
                class="w-6 h-6 p-0.5 rounded opacity-100 opacity-0"/><span class="truncate">Duplicate</span>
            </div>
            <div v-if="BlockComponents[props.block.type].options.conditionVisible" @click="open = false; emit('duplicateBlock')"
                 class="px-2 py-1 rounded flex items-center gap-2 hover:bg-slate-600" data-test-id="turn-into-menu">
              <v-icon name="gi-logic-gate-nor"
                class="w-6 h-6 p-0.5 rounded opacity-100 opacity-0"/><span class="truncate">Add Conditional Logic</span>
            </div>
          </div>
        </div>
      </div>
      <div ref="menu" v-if="openTurnInto"
           class="w-[10rem] lg:w-[12rem] xl:w-[16rem] absolute z-10 shadow-block rounded py-1 text-white text-sm right-full bg-slate-800 max-h-[24rem] overflow-auto focus-visible:outline-none top-0">
        <div class="text-left divide-y">
          <!-- Search term -->
          <div v-if="searchTerm" class="block-menu-search px-2 py-2 flex gap-2 w-full">
            <v-icon name="hi-solid-search" class="w-4 shrink-0"/>
            <div class="truncate">
              {{ searchTerm }}
            </div>
          </div>
          <!-- Turn into another block like Text, Heading or Divider -->
          <div class="px-2 py-2" v-if="options.length">
            <div class="px-2 pb-2 font-semibold uppercase text-xs text-neutral-400">Turn into</div>
            <div v-for="option, i in options"
                 class="px-2 py-1 rounded flex items-center gap-2"
                 :class="[active === (i + options.filter(option => option.type !== 'Turn into').length) ? 'bg-slate-600' : '']"
                 @click.stop="setBlockType(option.blockType);"
                 @mouseup.stop="() => {}"
                 @mouseover="active = (i + options.filter(option => option.type !== 'Turn into').length)">
              <v-icon v-if="option.icon"
                      :name="option.icon" class="w-5 h-5"/>
              <span class="truncate">{{ option.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch, PropType} from 'vue'
import Fuse from 'fuse.js'
import {Block, BlockComponents, BlockDivider, BlockType} from '@/utils/types'
import Tooltip from './elements/Tooltip.vue'

const props = defineProps({
  blockTypes: {
    type: Object as PropType<null | (string | BlockType)[]>,
    default: null,
  },
  block: {
    type: Object as PropType<Block>,
    required: true,
  }
})

const emit = defineEmits([
  'setBlockType',
  'deleteBlock',
  'duplicateBlock',
  'clearSearch',
])

const open = ref(false)
let openedWithSlash = false
const container = ref<HTMLDivElement | null>(null)
const menu = ref<HTMLDivElement | null>(null)

const openTurnInto = ref(false)
const openMainMenu = ref(false)

watch(open, isOpen => {
  if (!isOpen) {
    openedWithSlash = false
  }
})

document.addEventListener('click', (event: Event) => {
  // Close menu on click outside of menu
  if (!open.value) return
  if (!(container.value && container.value.contains(event.target as Node))) {
    open.value = false
    searchTerm.value = ''
    active.value = 0
  }
})

/*
Support keyboard navigation
*/
const active = ref(0)
const searchTerm = ref('')

document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (!open.value) return
  if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
    // Support up/down navigation with keyboard
    if (event.key === 'ArrowUp') {
      // Move up
      // Scroll to bottom of menu if at top
      active.value = active.value - 1 >= 0 ? active.value - 1 : options.value.length - 1
    } else {
      // Move down
      // Scroll to top of menu if at bottom
      active.value = active.value + 1 <= options.value.length - 1 ? active.value + 1 : 0
    }
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    // Left/right will exit menu
    if (searchTerm.value.length === 0) open.value = false
  } else if (event.key === 'Enter') {
    // Enter selects menu option
    event.preventDefault()
    setBlockType(options.value[active.value].blockType)
  } else if (event.key === 'Escape') {
    // Escape closes menu
    open.value = false
    searchTerm.value = ''
    active.value = 0
  } else if (event.key.match(/^([a-zA-Z]|[0-9]| )$/)) {
    // Alphanumeric searches menu
    searchTerm.value += event.key
    active.value = 0
  } else if (event.key === 'Backspace') {
    // Backspace closes menu if searchTerm is empty
    if (searchTerm.value.length === 0) open.value = false
    else searchTerm.value = searchTerm.value.slice(0, -1)
    active.value = 0
  }
})

document.addEventListener('keyup', (event: KeyboardEvent) => {
  if (!open.value) return
  if (event.key === 'Enter') {
    // Enter selects menu option
    event.preventDefault()
    event.stopPropagation()
  }
})

/*
Menu options
*/

const blockComponentArray = Object.entries(BlockComponents).map(([blockType, entry]) => ({
  blockType,
  ...entry.options,
}));

const fuzzySearch = new Fuse(blockComponentArray, {
  keys: ['label']
})

const options = computed(() => {
  const options = searchTerm.value === ''
      ? blockComponentArray
      : fuzzySearch.search(searchTerm.value).map(result => result.item)
  // if (props.blockTypes) return options.filter(option => props.blockTypes?.includes(option.blockType))
  return options
})

function openTurnIntoMenu() {
  openTurnInto.value = true;
  setTimeout(() => {
    openMainMenu.value = false
  })
}


function setBlockType(blockType: BlockType | string) {
  emit('setBlockType', blockType, searchTerm.value.length, openedWithSlash)

  searchTerm.value = ''
  open.value = false
}

defineExpose({
  open,
  openTurnInto,
  openMainMenu,
  openedWithSlash,
})
</script>

<style lang="scss" scoped>
.main-menu {
  right: 100%;
  @media (max-width: 1000px) { // Adjust the breakpoint (768px) based on your design
    right: 0; // Reset the right property for smaller screens if needed
    left: 100%; // Set left to 100% for screens less than medium size
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
