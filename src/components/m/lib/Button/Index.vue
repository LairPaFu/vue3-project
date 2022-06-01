<template>
  <div class="m-btn" :class="{ 'm-btn-block': block }">
    <slot></slot>
  </div>
</template>

<script  setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  block: {
    type: Boolean,
    default: false,
  }
})

</script>

<style scoped lang="less">
.m-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 142px;
  height: 42px;
  background-color: #f5e552;
  border: 4px;
  border-color: #f5e552;
  border-style: solid;
  border-radius: 25px;
  color: #fff;
  font-family: 'WENDAOCHAOHEI';
  cursor: pointer;

  &-block {
    width: 100%;
  }

  &:hover {
    background-color: #f5e23b;
  }
}
</style>