<template>
  <div>
    <el-button size="small" @click="changeArray">改变数组</el-button>
  </div>
</template>

<script>
import Reactive from './index';
export default {
  created() {
    Reactive.init();
  },
  methods: {
    changeArray() {
      Reactive.changeArray();
    }
  }
};
</script>

<style lang="scss" scoped></style>
