import { message, close, closeAll } from './lib/Message/index'

import './style/icons.less'

import Input from './lib/Input/Index.vue'
import Button from './lib/Button/Index.vue'
import Message from './lib/Message/Index.vue'

const components = {
  Input,
  Button,
  Message
}

export default (Vue: any) => {
  for (const [key, val] of Object.entries(components)) {
    Vue.component('M' + key, val)
  }
  Vue.config.globalProperties.$message = message
  Vue.config.globalProperties.$messages = { close, closeAll }
}