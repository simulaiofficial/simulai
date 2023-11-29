import {createApp} from 'vue'
import {OhVueIcon, addIcons} from "oh-vue-icons"
import {
    MdDragindicator,
    HiTrash,
    HiPlus,
    HiSolidSearch,
    BiTextLeft,
    BiTypeH1,
    BiTypeH2,
    BiTypeH3,
    BiHr,
    BiQuote,
    MdCheckboxOutlined,
    IoRadioButtonOnOutline,
    BiEmojiSmile,
    PrClone
} from "oh-vue-icons/icons"
import App from './App.vue'
import './index.css'

addIcons(
    MdDragindicator,
    HiTrash,
    HiPlus,
    HiSolidSearch,
    BiTextLeft,
    BiTypeH1,
    BiTypeH2,
    BiTypeH3,
    BiHr,
    BiQuote,
    MdCheckboxOutlined,
    IoRadioButtonOnOutline,
    BiEmojiSmile,
    PrClone
)

const app = createApp(App)
app.component("v-icon", OhVueIcon)
app.mount('#app')
