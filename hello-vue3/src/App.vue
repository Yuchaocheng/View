<template>
  <div>
    <!-- 组合式API语法糖 -->
    <composition-sugar></composition-sugar>
    <!-- suspense组件测试 -->
    <suspense-test v-if="false"></suspense-test>
    <!-- teleport组件测试  -->
    <teleport-test v-if="false"></teleport-test>
    <h1 style="margin-bottom: 40px" v-show="false">car: {{ car }}</h1>
    <setup-test v-if="false"></setup-test>
    <HelloWorld v-if="false" />
  </div>
</template>

<script>
import { provide, reactive } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import setupTest from './components/setupTest.vue';
import TeleportTest from './components/TeleportTest.vue';
import SuspenseTest from './components/SuspenseTest.vue';
import compositionSugar from './components/compositionSugar.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    setupTest,
    TeleportTest,
    SuspenseTest,
    compositionSugar,
  },
  setup(props) {
    let car = reactive({ name: '奔驰', price: '40万' });
    provide('car', car);
    setTimeout(() => {
      car.price = 22222;
    }, 10000);
    return {
      car,
    };
  },
};
</script>

<style></style>
