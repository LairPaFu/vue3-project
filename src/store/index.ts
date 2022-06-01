
import { App } from 'vue';

import { createStore } from "vueX";
import chat from './modules/chat'
const store = createStore<{}>({
  state() {
    return {
      baseUrl: 'http://192.168.80.42:5000',
      baseWS: 'ws://192.168.80.42:8888'
    }
  },
  mutations: {
  },
  // actions,
  modules: {
    chat
  }
})

export const initStore = (app: App<Element>) => {
  app.use(store)
}