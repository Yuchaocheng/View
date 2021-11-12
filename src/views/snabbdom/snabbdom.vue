<template>
  <div id="snabbdom">
    <h2>snabbdom</h2>
    <el-button @click="trigger1" size="small" type="primary">触发1</el-button>
    <el-button @click="trigger2" size="small" type="primary">触发2</el-button>
    <div id="container"></div>
    <!-- <div id="myH">H</div> -->
  </div>
</template>

<script>
import MySnabbdom from './MySnabbdom';
export default {
  created() {},
  mounted() {
    MySnabbdom.useSnabbdom();
    // MySnabbdom.useMyH()
    // MySnabbdom.useMyPatch();
  },
  methods: {
    trigger1() {
      MySnabbdom.trigger1();
    },
    trigger2() {
      MySnabbdom.trigger2();
    }
  }
};
</script>

<style scoped>
#container {
  height: 600px;
  background: darkkhaki;
}
</style>
