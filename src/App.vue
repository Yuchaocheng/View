<template>
  <div id="app">
    <h1>vue源码探究</h1>
    <router-link to="/snabbdom">跳转至 《snabbdom》</router-link><br /><br />
    <router-link to="/reactive">跳转至 《响应式原理》</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  components:{
    test:''
  },
  methods: {
    open() {}
  },

  created() {
    console.log(this, 'this');
  }
};
</script>

<style lang="scss" scoped></style>
