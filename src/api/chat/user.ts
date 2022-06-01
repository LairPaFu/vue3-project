import http from '@/utils/http'


export interface UserRes {

}
// 返回用户信息
export const chatUserInfoApi = (): PromiseRes<UserRes> => http.get('/chat/user/info')

export interface ChatListRes {
  id: string
  avatar: string
  nickname: string
  targetId: string
  userId: string
  content: string
  time: number
  unread: number
}
// 返回聊天列表
export const chatListApi = (): PromiseRes<ChatListRes[]> => http.get('/chat/list')

interface RecordData {
  userId: string
}

export interface ChatRecordRes {
  id: string
  userId: string
  targetId: string
  content: string
  createTime: number
  avatar: string
  nickname: string
}
// 返回聊天列表
export const chatRecordApi = (params: RecordData): PromiseRes<ChatRecordRes[]> => http.get('/chat/record', { params })

interface ReadedData {
  userId: string
}

export interface ChatReadedRes {
}
// 聊天已读
export const chatReadedApi = (data: ReadedData): PromiseRes<ChatReadedRes> => http.post('/chat/readed', data)