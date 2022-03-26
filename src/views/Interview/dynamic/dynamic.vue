// 动态组件测试

<template>
  <div>
    <h2>动态组件</h2>
    <button @click="toggle">切换组件</button>
    <component :is="x"></component>
  </div>
</template>

<script>
import aa from '../../autuRouter/oneLevel/aa/aa.vue';
import twoLevel from '../../autuRouter/oneLevel/twoLevel/twoLevel.vue';
export default {
  components: {
    aa,
    twoLevel,
  },
  data() {
    return {
      x: 'aa',
    };
  },
  methods: {
    toggle() {
      this.x = this.x === 'aa' ? 'twoLevel' : 'aa';
    },
  },
};
</script>

<style lang="scss" scoped>
</style>