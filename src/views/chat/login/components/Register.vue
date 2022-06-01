<template>
  <div class="c-register">
    <div class="c-title">注册</div>
    <div class="c-input-item">
      <m-input
        title="昵称"
        v-model:value="nickname"
        placeholder="昵称"
        :verification="verify.nickname"
      ></m-input>
    </div>
    <div class="c-input-item">
      <m-input
        title="用户名"
        v-model:value="username"
        placeholder="用户名"
        :verification="verify.username"
      ></m-input>
    </div>
    <div class="c-input-item">
      <m-input
        title="邮箱"
        v-model:value="email"
        placeholder="邮箱"
        :verification="verify.email"
      ></m-input>
    </div>
    <div class="c-input-item">
      <m-input
        title="密码"
        type="password"
        v-model:value="password"
        placeholder="密码"
        :verification="verify.password"
      >
      </m-input>
    </div>
    <div class="c-input-item">
      <m-input
        title="确认密码"
        type="password"
        v-model:value="repassword"
        placeholder="密码"
        :verification="verify.repassword"
      ></m-input>
    </div>
    <div class="c-login-box">
      <a href="#" @click="changeType">登录</a>
    </div>
    <div class="c-btn-item">
      <m-button @click="register">注册</m-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cookies from "js-cookie";

import { ref, reactive, toRefs } from "vue";
import { defineProps, defineEmits, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";

import { chatRegisterApi } from "@/api/chat/login";

let router = useRouter();

const { $message } = getCurrentInstance()!.appContext.config.globalProperties;

const emits = defineEmits<{
  (event: "change", type: string): void;
}>();

// 昵称
const nickname = ref("");
// 用户名
const username = ref("");
// 邮箱
const email = ref("");
// 密码
const password = ref("");
// 确认密码
const repassword = ref("");
// 验证
const verify: verifys = {
  nickname: [
    { required: true },
    {
      validate: (value) => {
        if (value.length < 4) {
          return false;
        }
        return true;
      },
      tip: "用户名长度必须大于4",
    },
  ],
  username: [
    { required: true },
    {
      validate: (value) => {
        if (value.length < 6) {
          return false;
        }
        return true;
      },
      tip: "用户名长度必须大于6",
    },
  ],
  email: [
    { required: true },
    {
      validate: (value) => {
        let check = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if (!check.test(value)) {
          return false;
        }
        return true;
      },
      tip: "邮箱格式不正确",
    },
  ],
  password: [
    { required: true },
    {
      validate: (value) => {
        if (value.length < 8) {
          return false;
        }
        return true;
      },
      tip: "密码长度必须大于8",
    },
    {
      validate: (value) => {
        let check_num = /[0-9]/;
        let check_len = /[a-z]/;
        let check_ben = /[A-Z]/;
        let check_symbol = /[\.\'\?\/\*\-\+\=\&\^\%\$\#\@\!\(\)\\]/;
        const check = [
          check_num.test(value),
          check_len.test(value),
          check_ben.test(value),
          check_symbol.test(value),
        ];
        if (check.filter((v) => v).length < 2) {
          return false;
        }
        return true;
      },
      tip: "密码必须满足英文大写、小写、数字、特殊字符中其二",
    },
  ],
  repassword: [
    { required: true },
    {
      validate: (value) => {
        if (value != password.value) {
          return false;
        }
        return true;
      },
      tip: "密码不一致",
    },
  ],
};

// 切换登录注册
const changeType = () => {
  emits("change", "login");
};

// 注册按钮
const register = () => {
  if (
    nickname.value == "" ||
    username.value == "" ||
    email.value == "" ||
    password.value == "" ||
    repassword.value == ""
  ) {
    $message({ content: "请完善账号" });
  }
  if (password.value != repassword.value) {
    $message({ content: "密码不一致" });
  }
  // 注册接口
  chatRegisterApi({
    nickname: nickname.value,
    username: username.value,
    email: email.value,
    password: password.value,
  }).then((res) => {
    if (res.code == 200) {
      $message({ content: res.message }).success();
      Cookies.set("chat_token", res.data.token);
      router.push({
        name: "ChatHome",
      });
    } else {
      $message({ content: res.message }).error();
      email.value = "";
      password.value = "";
      repassword.value = "";
    }
  });
};
</script>

<style scoped lang="less">
.c-register {
  .c-title {
    margin: 30px 0 0 0;
  }
  .c-input-item {
    margin: 0 0 5px 0;
  }
}
</style>
