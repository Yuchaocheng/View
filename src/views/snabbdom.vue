<template>
  <div id="snabbdom">
    <h2>snabbdom</h2>
    <div id="container"></div>
  </div>
</template>

<script>
import MySnabbdom from './MySnabbdom';
export default {
  created() {},
  mounted() {
    MySnabbdom.useSnabbdom();
  }
};
</script>

<style scoped>
#container {
  height: 600px;
  background: darkkhaki;
}
</style>
