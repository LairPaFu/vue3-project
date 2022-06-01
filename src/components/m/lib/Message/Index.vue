<template>
  <div
    class="m-message"
    :class="'m-message-' + type + ' m-message-' + close_check"
    :style="'--top: ' + top + 'px'"
    @mouseenter="stop"
    @mouseleave="start"
  >
    <i class="m-icon" :class="'m-icon-' + type"></i>
    {{ content }}
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from "vue";
import { defineProps } from "vue";
import { close } from "./index";

const props = defineProps({
  type: {
    type: String,
    default: "info",
  },
  id: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "弹窗",
  },
  top: {
    type: Number,
    default: 20,
  },
});

let close_check = ref("");

let timer: NodeJS.Timeout | null = null;
const start = () => {
  timer = setTimeout(() => {
    close_check.value = "close";
    setTimeout(() => {
      close(props.id);
    }, 500);
  }, 2000);
};
start();
const stop = () => {
  timer && clearTimeout(timer);
};
</script>

<style scoped lang="less">
.m-message {
  position: absolute;
  top: var(--top);
  left: 50%;
  width: 260px;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  margin: 0 0 0 -150px;
  color: #fff;
  font-size: 14px;
  border-radius: 3px;
  transition: all 0.5s;
  animation: messageA 0.5s;

  &-close {
    top: calc(var(--top) - 30px);
    opacity: 0;
  }

  &-success {
    background: #c0ffa1;
    color: #67c23a;
  }

  &-info {
    background: #fffced;
    color: #999890;
  }

  &-error {
    background: #ffb5b5;
    color: #fd2727;
  }

  &-warning {
    background: #ffd79c;
    color: #ff9900;
  }
}

@keyframes messageA {
  from {
    top: calc(var(--top) - 30px);
    opacity: 0;
  }

  to {
    top: var(--top);
    opacity: 1;
  }
}
</style>
