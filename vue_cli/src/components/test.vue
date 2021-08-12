<template>
  <div class="test">
    <el-input :value="test" @input="input"></el-input>
    <b v-show="testProp">{{testProp}}</b>
    <header>
      <!-- 只有在slot上绑定了数据的，才能被子组件使用，如果没有这个限制，子组件直接可以访问父组件的全部数据，容易造成混乱 -->
      <slot name="header" :far="farData" :test="test"></slot>
    </header>
    <main>
      <slot :content="content"></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    testProp: String,
  },
  data() {
    return {
      farData: {
        header: "title",
      },
      // test: "111",
      content: "主体内容",
    };
  },
  watch: {
    test(value) {
      // console.log(value, "value");
    },
  },
  created() {
    /* 如果没有在data中定义，而在后续用常规方法给本实例添加属性时，是不具备响应式的如下所示
       需要使用this.$set方法添加
    */
    this.test = "111";
  },
  methods: {
    input(value) {
      this.test = value;
      setTimeout(() => {
        console.log(this.test, 333);
      }, 1000);
      console.log(this.test, 222);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>