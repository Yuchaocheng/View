<template>
  <div>
    <!-- v-model测试 -->
    <v-model-test v-model="modelTitle" v-model:test="modelTest"></v-model-test>
    <!-- 组合式API语法糖 -->
    <composition-sugar v-if="false"></composition-sugar>
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
import { provide, reactive, ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import setupTest from './components/setupTest.vue';
import TeleportTest from './components/TeleportTest.vue';
import SuspenseTest from './components/SuspenseTest.vue';
import compositionSugar from './components/compositionSugar.vue';
import vModelTest from './components/vModelTest.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    setupTest,
    TeleportTest,
    SuspenseTest,
    compositionSugar,
    vModelTest,
  },
  setup(props) {
    let car = reactive({ name: '奔驰', price: '40万' });
    provide('car', car);
    setTimeout(() => {
      car.price = 22222;
      modelTitle.value += ' 父组件改变值 ';
      modelTest.value += ' 父组件改变test prop ';
    }, 5000);
    let modelTitle = ref('modelTitle');
    let modelTest = ref('modelTest');
    return {
      car,
      modelTitle,
      modelTest,
    };
  },
};
</script>

<style></style>
