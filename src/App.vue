<template>
  <div id="app">
    <h1>vue源码探究</h1>
    <router-link to="/snabbdom">跳转至snabbdom</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    open() {}
  },

  created() {
  }
};
</script>

<style lang="scss" scoped></style>
