<template>
  <div @click="onClick">
    <h3>这是一个异步组件测试，我是{{ msg }}</h3>
    <button @click="emitTest">触发emitTest</button>
  </div>
</template>

<script>
export default {
  emits: {
    emitTest(value) {
      if (value) {
        return true;
      } else {
        return false;
      }
    },
    click: null,
  },
  setup(props, { emit }) {
    const emitTest = () => {
      emit('emitTest', 'emitTest');
    };
    const onClick = () => {
      console.log('组件内部的click事件触发了');
      emit('click');
    };
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          msg: '子组件',
          emitTest,
          onClick,
        });
      }, 500);
    });
    // return {
    //   msg: '子组件',
    // };
  },
};
</script>

<style lang="scss" scoped>
</style>