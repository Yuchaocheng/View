<template>
  <div>
    <h1>SuspenseTest</h1>
    <Suspense>
      <template v-slot:default>
        <Child @emitTest="testChildEmit" @click="testChildClick" />
      </template>
      <template v-slot:fallback>
        <h3>加载中.....</h3>
      </template>
    </Suspense>
  </div>
</template>

<script>
// import Child from "./SuspenseChild.vue"
import { defineAsyncComponent } from 'vue';
const Child = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      import('./SuspenseChild.vue').then((result) => {
        resolve(result);
      });
    }, 1000);
  });
});
export default {
  components: {
    Child,
  },
  setup() {
    const testChildEmit = (evetName) => {
      console.log(`子组件的 ${evetName} 事件触发了`);
    };
    const testChildClick = (evet) => {
      console.log(`子组件click事件触发了`);
    };
    return {
      testChildEmit,
      testChildClick,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>