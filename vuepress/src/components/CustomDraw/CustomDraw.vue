<template>
  <div>
    <div class="main">
      <gallery @change="changeType" />
      <main-canvas ref="mainCanvas" />
    </div>
  </div>
</template>

<script>
import Gallery from './Gallery/Gallery.vue';
import MainCanvas from './MainCanvas/MainCanvas.vue';
export default {
  name: 'CustomDraw',
  components: {
    Gallery,
    MainCanvas,
  },
  data() {
    return {
      drawerType: 'line',
    };
  },
  methods: {
    changeType(type) {
      this.$refs.mainCanvas.setDrawType(type);
    },
  },
};
</script>

<style scoped>
.main {
  display: flex;
  justify-content: space-between;
}
</style>
