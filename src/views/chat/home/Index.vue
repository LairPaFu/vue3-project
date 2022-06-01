<template>
  <div class="full-container">
    <div class="chat-list">
      <div class="chat-list-left">
        <div class="chat-avatar">
          <img
            v-if="avatar"
            :src="url + '/img/avatar/' + avatar"
            alt=""
            srcset=""
          />
        </div>
        <div class=""></div>
      </div>
      <div class="chat-list-right">
        <div class="chat-list-title">
          <div class="chat-list-search">
            <i class="iconfont icon-sousuo"></i>
            <input type="text" />
          </div>
          <div class="chat-list-add iconfont icon-tianjia"></div>
        </div>
        <div class="chat-list-box">
          <div
            v-for="item in chat_list"
            :key="item.id"
            class="chat-list-item"
            :class="{ 'chat-list-item-hover': select_chat == item.targetId }"
            @click="changeChatList(item.targetId, item.nickname)"
          >
            <span v-show="item.unread != 0" class="chat-list-item-unread">
              {{ item.unread }}
            </span>
            <div class="chat-list-item-avatar">
              <img
                v-if="item.avatar"
                :src="url + '/img/avatar/' + item.avatar"
                alt=""
                srcset=""
              />
            </div>
            <div class="chat-list-item-content">
              <div class="of-ellipsis chat-list-item-name">
                {{ item.nickname }}
              </div>
              <div
                class="of-ellipsis chat-list-item-msg"
                v-html="item.content"
              ></div>
            </div>
            <div class="chat-list-item-time">
              {{ $filters.formatTime(item.time) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="chat-window"
      :class="{ 'chat-window-show': select_chat != '0' && select_chat != '' }"
    >
      <div v-show="select_chat" class="chat-window-title">
        <span class="chat-window-title-close" @click="windowClose">X</span>
        {{ select_chat_name }}
      </div>
      <div
        v-show="select_chat"
        class="chat-window-content"
        ref="window_content"
      >
        <div>
          <div
            class="chat-window-content-item"
            v-for="item in content_list"
            :key="item.id"
            :class="{
              'chat-window-content-item-left': item.userId != id,
              'chat-window-content-item-right': item.userId == id,
            }"
          >
            <div class="chat-window-content-item-user">
              <img :src="url + '/img/avatar/' + item.avatar" alt="" srcset="" />
            </div>
            <div
              class="chat-window-content-item-info"
              v-html="item.content"
            ></div>
          </div>
        </div>
      </div>
      <div v-show="select_chat" class="chat-window-input">
        <div class="chat-window-input-tool" style="user-select: none">
          <span
            class="iconfont icon-biaoqing"
            @click="emoji_box_show = !emoji_box_show"
          >
            <div v-show="emoji_box_show">
              <div>
                <span
                  v-for="item in emoji_arr"
                  :key="item"
                  @click="addEmoji(item)"
                  :class="'iconfont icon-' + item"
                ></span>
              </div>
            </div>
          </span>
        </div>
        <div class="chat-window-input-content">
          <div
            ref="chat_input"
            class="textarea"
            contenteditable="true"
            @keydown.enter="chatSend"
            @input="chatChange"
          ></div>
        </div>
        <div class="chat-window-input-send">
          <span @click="chatSend"> 发送(Ctrl+Enter) </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cookies from "js-cookie";
import {
  ref,
  reactive,
  toRefs,
  onMounted,
  getCurrentInstance,
  nextTick,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vueX";
import {
  chatUserInfoApi,
  chatListApi,
  chatRecordApi,
  chatReadedApi,
} from "@/api/chat/user";
import { ChatListRes, ChatRecordRes } from "@/api/chat/user";
// 表情
import { emoji } from "@/utils/chat";
let emoji_arr = emoji;
let emoji_box_show = ref(false);
// 路由获取
let router = useRouter();
// vuex获取
let store = useStore();
// 获取公共方法
const { $filters } = getCurrentInstance()!.appContext.config.globalProperties;
// 获取VueX->id
let id = ref(store.state.chat.userInfo.id);
// 资源地址
let url = store.state.baseUrl + "/src";
let wsUrl = store.state.baseWS;
// 内容dom
let window_content = ref<HTMLElement | null>(null);
// 用户头像
let avatar = ref("");
// 判断id获取用户信息
if (!id.value) {
  chatUserInfoApi().then((res) => {
    if (res.code == 200) {
      store.commit("chat/updateUserInfo", res.data);
      avatar.value = store.state.chat.userInfo.avatar;
      id.value = store.state.chat.userInfo.id;
    } else {
      Cookies.remove("chat_token");
      store.commit("chat/updateUserInfo", {});
      router.push({
        name: "ChatLogin",
      });
    }
  });
} else {
  avatar.value = store.state.chat.userInfo.avatar;
}
// 选中得聊天对象
let select_chat = ref("");
let select_chat_name = ref("");
// 聊天列表
let chat_list = ref<ChatListRes[]>([]);
// 聊天对象内容
let content_list = ref<ChatRecordRes[]>([]);
// websocket
let ws = ref();
// 载入后
onMounted(() => {
  chatListApi().then((res) => {
    if (res.code == 200) {
      chat_list.value = res.data;
      startWs();
    }
  });
});
// 开始ws服务
const startWs = () => {
  // 开启websocket
  ws.value = new WebSocket(wsUrl);
  ws.value.onopen = function () {
    console.log("Socket opened.");
  };
  ws.value.onmessage = function (e: any) {
    console.log("收到的信息", e.data);
    let obj = JSON.parse(e.data);
    let index = chat_list.value.findIndex((v) => v.targetId == obj.userId);
    if (index != -1) {
      chat_list.value[index].content = obj.content;
      obj.avatar = chat_list.value[index].avatar;
      if (obj.userId == select_chat.value) {
        chatReadedApi({ userId: select_chat.value });
        content_list.value.push(obj);
        setScrollTop();
      } else {
        chat_list.value = chat_list.value.map((v) => {
          if (v.targetId == obj.userId) {
            v.unread += 1;
            v.content = obj.content;
            v.time = obj.createTime;
          }
          return v;
        });
      }
    }
  };
  ws.value.onclose = function () {
    console.log("连接已关闭...");
  };
};
// 切换聊天对象
const changeChatList = (id: string, name: string) => {
  chatReadedApi({
    userId: id,
  }).then((res) => {
    if (res.code == 200) {
      emoji_box_show.value = false;
      chat_list.value = chat_list.value.map((v) => {
        if (v.targetId == id) {
          v.unread = 0;
        }
        return v;
      });
      chatRecordApi({
        userId: id,
      }).then((res) => {
        select_chat.value = id;
        select_chat_name.value = name;
        content_list.value = res.data;
        setScrollTop();
      });
    }
  });
};
// 关闭聊天框
const windowClose = () => {
  select_chat.value = "";
  select_chat_name.value = "";
  emoji_box_show.value = false;
};
// 聊天输入框
let chat_input = ref<HTMLElement | null>(null);
// 发送信息
const chatSend = (e: KeyboardEvent | MouseEvent) => {
  let tc = chat_input.value;
  if (tc && tc.innerText != "") {
    // 判断Ctrl+Enter键入 或 点击发送
    if (
      (e instanceof KeyboardEvent && e.ctrlKey && e.code == "Enter") ||
      e instanceof MouseEvent
    ) {
      ws.value.send(
        JSON.stringify({
          userId: store.state.chat.userInfo.id,
          targetId: select_chat.value,
          content: tc.innerHTML,
        })
      );
      content_list.value.push({
        id: content_list.value.length.toString(),
        userId: store.state.chat.userInfo.id,
        targetId: select_chat.value,
        content: tc.innerHTML,
        avatar: avatar.value,
        nickname: store.state.chat.userInfo.nickname,
        createTime: new Date().getTime(),
      });
      chat_list.value[
        chat_list.value.findIndex((v) => v.targetId == select_chat.value)
      ].content = tc.innerHTML;
      chat_list.value[
        chat_list.value.findIndex((v) => v.targetId == select_chat.value)
      ].time = new Date().getTime();
      setScrollTop();
      tc.innerHTML = "";
    }
  }
};
// 聊天输入框改变
const chatChange = () => {
  // let selection = window.getSelection();
  // console.log(chat_input.value?.innerHTML);
  // console.log(selection?.getRangeAt(0));
  // console.log(selection?.getRangeAt(0).startOffset);
};
// 添加表情
const addEmoji = (code: string) => {
  let selection: any = window.getSelection();
  if (
    chat_input.value &&
    selection &&
    selection.focusNode &&
    ((selection.focusNode.parentElement &&
      (chat_input.value.getElementsByClassName(
        selection.focusNode.parentElement.className
      ).length > 0 ||
        selection.focusNode.parentElement.className == "textarea")) ||
      selection.focusNode.className == "textarea")
  ) {
    console.log(1);
    let s = selection.getRangeAt(0);
    let box = document.createElement("span");
    box.className = "emoji-" + code;
    let emoji = document.createElement("span");
    emoji.className = "iconfont icon-" + code;
    box.innerHTML = "&nbsp;";
    box.appendChild(emoji);
    box.innerHTML += "&nbsp;";
    s.insertNode(box);
    chat_input.value.focus();
    // 创建新的光标对象
    var range = document.createRange();
    // 将光标对象的范围界定为新建的表情节点
    range.selectNodeContents(box);
    console.log(range.endOffset);
    // 定位光标位置在表情节点的最大长度位置
    range.setStart(box, range.endOffset);
    // 将选区折叠为一个光标
    range.collapse(true);
    // 清除所有光标对象
    selection.removeAllRanges();
    // 添加新的光标对象
    selection.addRange(range);
  }
};
// 滚动条置底
const setScrollTop = () => {
  nextTick(() => {
    if (window_content.value) {
      window_content.value.scrollTop = window_content.value.scrollHeight;
    }
  });
};
</script>

<style scoped lang="less">
@import "@/assets/css/chat/home.less";
</style>
