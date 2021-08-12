<template>
  <div id="app">
    <h1>111111111111</h1>
    <el-button @click="open">提示</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    open() {
      this.$message({
        message: (
          <div>
            确定要删除<span style="color:red">学习子君Vue系列文章</span>的笔记?
          </div>
        ),
        type: "warning",
      });
    },
  },

  created() {}
};
</script> 

<style lang="scss" scoped>
</style>