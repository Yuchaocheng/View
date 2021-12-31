<template>
  <div>
    <teleport-test></teleport-test>
    <h1 style="margin-bottom: 40px" v-show="false">car: {{ car }}</h1>
    <setup-test></setup-test>
    <HelloWorld v-if="false" />
  </div>
</template>

<script>
import { provide, reactive } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import setupTest from './components/setupTest.vue';
import TeleportTest from './components/TeleportTest.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    setupTest,
    TeleportTest,
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
