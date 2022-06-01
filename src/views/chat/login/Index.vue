<template>
  <div class="full-container">
    <div class="glass">
      <login v-if="check_type == 'login'" @change="changeType"></login>
      <register v-else @change="changeType"></register>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cookies from "js-cookie";

import { ref, reactive, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vueX";

import { chatUserInfoApi } from "@/api/chat/user";

import Login from "./components/Login.vue";
import Register from "./components/Register.vue";

let router = useRouter();
let store = useStore();

// 检测登录状态
if (Cookies.get("chat_token")) {
  chatUserInfoApi().then((res) => {
    if (res.code == 200) {
      store.commit("chat/updateUserInfo", res.data);
      router.push({
        name: "ChatHome",
      });
    } else {
      Cookies.remove("chat_token");
      store.commit("chat/updateUserInfo", {});
    }
  });
}

// 登录注册页状态
let check_type = ref("login");
const changeType = (type: string) => {
  check_type.value = type;
};
</script>

<style scoped lang="less">
.full-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 320px;
  min-height: 568px;
  background: url("../../../assets/img/chat/bg.jpeg") no-repeat center;
  background-size: cover;
}

.glass {
  /*设置card的大小*/
  width: 65%;
  max-width: 800px;
  min-width: 319px;
  // height: 50%;
  max-height: 650px;
  min-height: 567px;
}

@media all and (max-width: 768px) {
  .glass {
    min-height: calc(100% - 1px);
    min-width: calc(100% - 1px);
    border-radius: 0px;
  }
}
</style>

<style lang="less">
.c-login,
.c-register {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;

  .c-title {
    line-height: 80px;
    margin: 70px 0 0 0;
    color: @font-color;
    font-size: 50px;
    font-family: "MENGSHEN";
    text-align: center;
  }

  .c-input-item {
    display: flex;
    justify-content: center;
    width: 50%;
    margin: 0 0 10px 0;
  }

  .c-login-box {
    width: 50%;
    line-height: 35px;
    font-size: 12px;
    letter-spacing: 5px;
    text-align: right;

    a {
      padding: 0 5px;
      color: #fff;
    }

    a:hover {
      color: @font-color;
    }
  }

  .c-btn-item {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 50%;
    margin: 20px;
  }

  @media all and (max-width: 768px) {
    .c-input-item,
    .c-btn-item,
    .c-login-box {
      width: 75%;
    }
  }
}
</style>
