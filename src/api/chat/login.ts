import http from '@/utils/http'
import { setFlagsFromString } from 'v8'

interface LoginData {
  username: string,
  password: string
}

interface LoginRes {
  token: string
}

interface ResterData {
  nickname: string,
  username: string,
  email: string,
  password: string
}

// 登录返回token
export const chatLoginApi = (data: LoginData): PromiseRes<LoginRes> => http.post('/chat/login', data)

// 注册返回token
export const chatRegisterApi = (data: ResterData): PromiseRes<LoginRes> => http.post('/chat/register', data)