<template>
  <div id="app">
    <h1>vue源码探究</h1>
    <router-link to="/snabbdom">跳转至 《snabbdom》</router-link><br /><br />
    <router-link to="/reactive">跳转至 《响应式原理》</router-link><br /><br />
    <router-link to="/AST">跳转至 《AST抽象语法树》</router-link><br /><br />
    <router-link to="/myVue">跳转至 《myVue》</router-link><br /><br />
    <router-link to="/Interview">跳转至 面试问题研究</router-link>
    <router-view style="margin-top:20px"></router-view>
  </div>
</template>

<script>
export default {
  components: {
    test: ''
  },
  methods: {
    open() {}
  },

  created() {
    // console.log(this, 'this');
  }
};
</script>

<style lang="scss" scoped></style>
