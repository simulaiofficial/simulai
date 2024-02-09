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
    BiUpload,
    MdCheckboxOutlined,
    IoRadioButtonOnOutline,
    BiEmojiSmile,
    PrClone,
    CoTextSquare,
    GiLogicGateNor,
    OiNumber,
    BiPlusSlashMinus,
    MdAlternateemail,
    BiArrowUp,
    RiAttachment2,
    BiCalendarDate,
    BiTelephone,
    GiWorld,
    MdArrowdropdown,
    BiLink,
    CoAvTimer,
    BiStar
} from "oh-vue-icons/icons"
import App from './App.vue'
import './index.css'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css'

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
    BiUpload,
    MdCheckboxOutlined,
    IoRadioButtonOnOutline,
    BiEmojiSmile,
    PrClone,
    CoTextSquare,
    GiLogicGateNor,
    OiNumber,
    BiPlusSlashMinus,
    MdAlternateemail,
    BiArrowUp,
    RiAttachment2,
    BiCalendarDate,
    BiTelephone,
    GiWorld,
    MdArrowdropdown,
    BiLink,
    CoAvTimer,
    BiStar
)

const app = createApp(App)

app.use(PrimeVue);
app.component("v-icon", OhVueIcon)
app.mount('#app')
