<template>
  <div>
    <el-button size="small" @click="changeArray">改变数组</el-button>
    {{ x[2] }}
  </div>
</template>

<script>
import Reactive from './index';
export default {
  data() {
    return {
      x: [1, 2, [3]],
      y: {
        2: [1, 2]
      }
    };
  },
  created() {
    Reactive.init();
  },
  methods: {
    changeArray() {
      // Reactive.changeArray();
      this.x[2].push(4);
    }
  },
  watch: {
  }
};
</script>

<style lang="scss" scoped></style>
