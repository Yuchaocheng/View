<template>
  <div id="snabbdom">
    <h2>snabbdom</h2>
    <el-button @click="trigger1" size="small" type="primary">触发1</el-button>
    <el-button @click="trigger2" size="small" type="primary">触发2</el-button>
    <div id="container"></div>
    <!-- <div id="myH">
      <h4 class="x">x</h4>
      <ul>
        <li>A</li>
        <li>B</li>
        <li>C</li>
      </ul>
    </div> -->
    <router-view></router-view>
  </div>
</template>

<script>
import MySnabbdom from './MySnabbdom';
export default {
  created() {
  },
  mounted() {
    // MySnabbdom.useSnabbdom();
    MySnabbdom.useMyH()
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
  height: 60px;
  background: darkkhaki;
}
</style>
