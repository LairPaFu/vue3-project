<template>
  <div class="full-container">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import Cookies from "js-cookie";

import { ref, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";

import { chatUserInfoApi } from "@/api/chat/user";

let router = useRouter();

// 检测登录状态
if (Cookies.get("chat_token")) {
  router.push({
    name: "ChatHome",
  });
} else {
  router.push({
    name: "ChatLogin",
  });
}
</script>

<style lang="less"></style>
