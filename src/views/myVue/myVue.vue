<template>
  <div>
    <!-- <render-test></render-test> -->
  </div>
</template>

<script>
import myVue from './MyVue';
import renderTest from './renderTest.vue';
export default {
  components: {
    renderTest
  },
  data() {
    return {};
  },
  methods: {
    // 测试自己编写的Vue
    testMyVue() {
      const el = document.querySelector('#myVue');
      const vm = new myVue({
        el,
        data: {
          x: 1,
          a: {
            b: 2
          },
        },
        watch: {
          x() {
            console.log(`x改变啦`);
          }
        }
      });
      const addBtn = document.querySelector('#addBtn');
      addBtn.onclick = () => {
        vm.x++;
      };
    }
  },
  created() {
    this.testMyVue();
  }
};
</script>

<style lang="less" scoped></style>
