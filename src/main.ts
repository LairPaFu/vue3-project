import { createApp } from 'vue'
import App from './App.vue'
import { initRouter } from './router/index'
import { initStore } from './store/index'

import filters from './utils/filters'
import "./assets/css/global.less";
import "./assets/fonts/fonts.less";
import "./assets/icons/iconfont.css";
// 表情
import "./assets/icons/emoji/iconfont.css";
import "./assets/css/emoji.less";

// 我的组件
import Mcom from '@/components/m/index'

const app = createApp(App);
// 初始化路由
initRouter(app)
// VueX
initStore(app)
app.config.globalProperties.$filters = filters
app.use(Mcom)
app.mount('#app');
