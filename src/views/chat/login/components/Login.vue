<template>
  <div class="c-login">
    <div class="c-title">登录</div>
    <div class="c-input-item">
      <m-input
        title="用户名"
        v-model:value="username"
        placeholder="用户名/邮箱"
        :verification="verify.username"
        @enter="login"
      ></m-input>
    </div>
    <div class="c-input-item">
      <m-input
        title="密码"
        type="password"
        v-model:value="password"
        placeholder="密码"
        :verification="verify.password"
        @enter="login"
      >
      </m-input>
    </div>
    <div class="c-login-box">
      <a href="#" @click="changeType">注册</a>
    </div>
    <div class="c-btn-item">
      <m-button @click="login">登录</m-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cookies from "js-cookie";

import { ref, reactive, toRefs,onMounted } from "vue";
import { defineProps, defineEmits, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";

import { chatLoginApi } from "@/api/chat/login";

// 路由获取
let router = useRouter();

const { $message } = getCurrentInstance()!.appContext.config.globalProperties;

const emits = defineEmits<{
  (event: "change", type: string): void;
}>();

// 用户名
const username = ref("");
// 密码
const password = ref("");
// 验证
const verify: verifys = {
  username: [{ required: true }],
  password: [{ required: true }],
};

// 切换登录注册
const changeType = () => {
  emits("change", "register");
};
// 登录按钮
const login = () => {
  if (username.value == "") {
    $message({ content: "用户名不能为空" });
    return;
  }
  if (password.value == "") {
    $message({ content: "密码不能为空" });
    return;
  }
  // 登录接口
  chatLoginApi({
    username: username.value,
    password: password.value,
  }).then((res) => {
    if (res.code == 200) {
      Cookies.set("chat_token", res.data.token);
      $message({ content: res.message }).success();
      router.push({
        name: "ChatHome",
      });
    } else {
      password.value = "";
      $message({ content: res.message }).error();
    }
  });
};
</script>

<style scoped lang="less"></style>
