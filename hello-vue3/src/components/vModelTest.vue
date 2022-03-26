<template>
  <div>
    <h3>{{ modelValue }}</h3>
    <h3>{{ test }}</h3>
    <button @click="change">change</button>
  </div>
</template>

<script>
export default {
  props: ['modelValue', 'test'],
  setup(props, { emit }) {
    const change = () => {
      emit('update:modelValue', props.modelValue + '!');
      emit('update:test', props.test + '#');
    };
    return {
      change,
    };
  },
};
</script>

<style lang="scss" scoped></style>
