import { createVNode, render, VNode } from "vue";
import Index from './Index.vue'

let message_arr: (string | null)[] = []

export class Message {
  div: HTMLDivElement = document.createElement('div')
  id: string | undefined = '';
  content: string | undefined = '';
  type: string | undefined = '';
  top: number | undefined = 20;
  constructor(id?: string, content?: string, type?: string) {
    if (id) {
      this.id = id
      this.content = content
      this.type = type
      this.div.id = id
      if (message_arr.indexOf(null) == -1) {
        message_arr.push(this.id)
      } else {
        message_arr[message_arr.indexOf(null)] = this.id
      }
      let i = message_arr.indexOf(id)
      this.top = i * 50 + ((i + 2) * 20)
    }
  }
  private show() {
    document.body.appendChild(this.div)
    // 第二个参数为props的参数
    const vnode = createVNode(Index, {
      content: this.content,
      id: this.id,
      type: this.type,
      top: this.top,
      this: this,
    });
    render(vnode, this.div);
  }
  info() {
    this.type = 'info'
    !this.content && (this.content = '提示消息')
    this.show()
  }
  success() {
    this.type = 'success'
    !this.content && (this.content = '成功消息')
    this.show()
  }
  warning() {
    this.type = 'warning'
    !this.content && (this.content = '警告消息')
    this.show()
  }
  error() {
    this.type = 'error'
    !this.content && (this.content = '失败消息')
    this.show()
  }
}

export function close(id: string) {
  let i = message_arr.findIndex(v => v == id)
  if (i != -1) {
    message_arr[i] = null
  }
  if (message_arr.filter(v => v != null).length <= 0) {
    message_arr = []
  }
  let div = document.getElementById(id)!;
  render(null, div);
  div && document.body.removeChild(div);
}

export function closeAll() {
  message_arr = []
  render(null, document.body);
}

export const message = (options?: { id?: string, content?: string, type?: string }) => {
  let m;
  if (options) {
    let m_id = options.id ? options.id : new Date().getTime() + '_' + Math.random().toString(36).substr(2)
    let m_content = options.content ? options.content : ''
    let m_type = ''
    if (!options.type) {
      m_type = 'info'
    }
    m = new Message(m_id, m_content, m_type)
    if (!options.type) {
      m.info()
    }
  } else {
    m = new Message(new Date().getTime() + '_' + Math.random().toString(36).substr(2))
  }

  console.log(message_arr);

  return m
};