import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import * as path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/assets/*"),
    }
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        charset: false,
        additionalData: '@import "src/assets/css/config.less";',
      },
    },
  },
})
