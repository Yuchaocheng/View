<template>
  <div>
    <h2>
      v-if和v-for顺序问题研究
    </h2>
    <li v-for="item in items" :key="item" v-if="item < 300">
      <template>{{ item }} </template>
    </li>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [100, 200, 300]
    };
  }
};
</script>
