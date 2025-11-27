<template>
  <div
    class="nutri-btn"
    :class="stateClass"
    @click="toggle"
  >
    <span class="label">{{ name }}</span>
    <span class="mark">
      {{ state === 1 ? "↑" : (state === -1 ? "↓" : "○") }}
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: { type: String, default: "" },
  state: { type: Number, default: 0 }, // 0 normal | 1 inc | -1 dec
});

const emit = defineEmits(["update:state", "change"]);

// 切换顺序 normal → inc → dec → normal
function toggle() {
  const next =
    props.state === 0 ? 1 :
    props.state === 1 ? -1 :
    0;

  emit("update:state", next);
  emit("change", { name: props.name, state: next });
}

const stateClass = computed(() => {
  return props.state === 1
    ? "inc"
    : props.state === -1
    ? "dec"
    : "normal";
});
</script>

<style lang="scss" scoped>
$bg: #f9fbfb; 
$card-gradient-start: #ffffff;
$card-gradient-end: #f7fbff;
$accent-pink: #ffe9f0;
$accent-mint: #e7fff6;
$accent-lavender: #f7f4fc;
$text-color: #2b2b2b;
$muted: #7b7b7b;
$shadow-color: rgba(43, 43, 43, 0.06);

.nutri-btn {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;

  padding: 12rpx 20rpx;  
  margin: 12rpx;      
  min-width: 160rpx;    

  border-radius: 20rpx;
  font-size: 26rpx;
  color: $text-color;

  background: linear-gradient(145deg, $card-gradient-start, $card-gradient-end);
  box-shadow: 0 4rpx 12rpx $shadow-color;

  transition: all 0.25s ease;
  cursor: pointer;
}

// ===== 状态样式 =====

// 常规
.normal {
  background: linear-gradient(145deg, $card-gradient-start, $card-gradient-end);
}

// 增加（粉色）
.inc {
  background: linear-gradient(145deg, lighten($accent-pink, 3%), darken($accent-pink, 2%));
  color: darken($accent-pink, 45%);
}

// 减少（薄荷）
.dec {
  background: linear-gradient(145deg, lighten($accent-mint, 5%), darken($accent-mint, 2%));
  color: darken($accent-mint, 60%);
}

// 文本区域
.label {
  flex: 1;
}

.mark {
  width: 48rpx;
  text-align: center;
  font-weight: bold;
}

</style>
