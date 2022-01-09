<template>
  <div>
    <span class="text"> color:{{ color }} </span>
    <button @click="changeColor">修改颜色</button><br />
    <button @click="increate">{{ count }}</button>
  </div>
</template>

<script setup="props, { emit }">
import { ref } from 'vue';
// console.log(props, 'props');
// console.log(emit, 'emit');
const count = ref(0);
const increate = () => count.value++;
let color = ref('red');
const changeColor = () => {
  color.value = 'blue';
};
</script>

<style scoped>
.text {
  color: v-bind(color);
}
</style>