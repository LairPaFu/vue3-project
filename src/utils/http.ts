import axios, { AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie';

import { chatResponse } from './chat'

import { router as Vrouter } from "@/router"
const router = Vrouter

const instance = axios.create({
  baseURL: 'http://192.168.80.42:5000/api',
  timeout: 15000,
})

// 请求拦截器
instance.interceptors.request.use(config => {
  let chat_token = Cookies.get('chat_token')

  config.headers = config.headers || {}

  if (chat_token) {
    config.headers['Authorization'] = "Bearer " + chat_token
  }
  return config;
}, err => {
  return Promise.reject(err)
})

// 响应拦截器
instance.interceptors.response.use((result) => {
  // 聊天接口响应拦截
  if (result.config.url?.split('/')[1] == 'chat' && (result.config.url?.split('/')[2] != 'login' || result.config.url?.split('/')[2] != 'register')) {
    chatResponse(result)
  }
  if (result.data.code == 401) {
    Cookies.remove("chat_token");
    router.push({
      name: "ChatLogin",
    });
  }
  return result.data;
}, err => {
  return Promise.reject(err)
})

export default instance