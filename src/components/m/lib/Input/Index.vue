<template>
  <div class="m-input">
    <div
      class="m-input-title"
      :class="{ 'input-focus': check_focus || props.value != '' }"
    >
      {{ title }}
    </div>
    <input
      v-model="value"
      :type="type"
      @focus="check_focus = true"
      @blur="blur"
      @input="input"
      @keydown.enter="enterClick"
      :placeholder="check_focus ? (placeholder ? placeholder : title) : ''"
    />
    <div class="m-input-verification" v-if="verification">
      {{ verification_tip }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, computed } from "vue";
import { defineProps, defineEmits, PropType, watch } from "vue";

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  title: {
    type: String,
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
  },
  block: {
    type: Boolean,
    default: true,
  },
  verification: {
    type: Array as PropType<verify[]>,
  },
});

const emits = defineEmits<{
  (event: "enter"): void;
  (event: "update:value", value: string): void;
}>();

watch(
  () => props.value,
  (count, prevCount) => {
    if (!check_once.value) {
      check_once.value = true;
    }
    value.value = count;
  }
);

// 值
let value = ref(props.value);
// 检查焦点
let check_focus = ref(false);
// 检查第一次
let check_once = ref(false);

const input = () => {
  emits("update:value", value.value);
};

const blur = () => {
  if (!check_once.value) {
    check_once.value = true;
  }
  check_focus.value = false;
};

const enterClick = () => {
  emits("enter");
};

let verification_tip = computed(() => {
  if (props.verification && check_once.value) {
    for (let i = 0; i < props.verification.length; i++) {
      const verify = props.verification[i];
      const val = props.value;
      if (verify.required && val == "") {
        return verify.tip || props.title + "不能为空";
      }
      if (verify.validate && !verify.validate(val)) {
        return verify.tip || props.title + "验证失败";
      }
    }
    return "";
  }
  return "";
});
</script>

<style scoped lang="less">
.m-input {
  position: relative;
  width: 100%;
  height: 60px;
  margin: 0 0 20px 0;

  &-title {
    position: absolute;
    top: 15px;
    left: 0;
    line-height: 50px;
    color: #fff;
    font-family: "XIAOTUTI";
    font-size: 20px;
    transition: all 0.3s;
  }

  .input-focus {
    top: 0;
    line-height: 20px;
    font-size: 14px;
    font-family: "YaHei";
  }

  input {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background: transparent;
    border: none;
    border-bottom: 1px solid #ffffff;
    color: #00a2ff;
    font-size: 21px;
    transition: all 0.2s;
    outline: none;
  }

  input::-webkit-input-placeholder {
    color: #ffed47;
    font-family: "XIAOTUTI";
  }

  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #ffed47;
    font-family: "XIAOTUTI";
  }

  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #ffed47;
    font-family: "XIAOTUTI";
  }

  input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #ffed47;
    font-family: "XIAOTUTI";
  }

  &-verification {
    position: absolute;
    bottom: -20px;
    left: 0;
    color: red;
    font-size: 12px;
  }
}
</style>
