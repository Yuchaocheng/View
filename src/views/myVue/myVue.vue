<template>
  <div>
    <el-button size="small" @click="add">自增</el-button>
  </div>
</template>

<script>
import myVue from './myVue';
export default {
  data() {
    return {};
  },
  methods: {
    add() {
      if (myVue.x >9) {
        myVue.x = 0;
      } else {
        myVue.x++;
      }
    }
  },
  created() {}
};
</script>

<style lang="less" scoped></style>
