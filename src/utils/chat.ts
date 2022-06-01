import Cookies from 'js-cookie';

import { AxiosResponse } from 'axios'

import { router as Vrouter } from "@/router"
const route = Vrouter.currentRoute.value
const router = Vrouter

export const chatResponse = (result: AxiosResponse) => {
  if (result.data.code == 401) {
    router.push({
      name: 'ChatLogin'
    })
  }
  if (result.data.code == 403) {
    Cookies.remove('chat_token')
    router.push({
      name: 'ChatLogin'
    })
  }
}

export const emoji = [
  "chijing", "dai", "mogui", "ganga", "qin", "nu", "zhayan", "shengqi", "ma", "bishi", "maimeng", "jingdai", "kulian", "xiaolian", "weixiao"
]