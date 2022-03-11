<template>
  <div class="gallery">
    <canvas ref="gallery" class="left" width="60" height="580">浏览器不支持canvas</canvas>
  </div>
</template>

<script>
import Gallery from './Gallery';

export default {
  data() {
    return {
      // gallery实例对象
      gallery: null,
      type: 'line',
    };
  },
  watch: {
    'gallery.selectedType'(val) {
      this.$emit('change', val);
    },
  },
  mounted() {
    const galleryDom = this.$refs.gallery;
    this.gallery = new Gallery(galleryDom, {
      width: 42,
      height: 42,
    });
    this.gallery.init();
  },
};
</script>

<style lang="less" scoped>
.gallery {
  background-color: #eeeeef;
  border: thin solid #aaaaaa;
  border-radius: 8px;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 40%);
  overflow: auto;
  flex: 0 0 auto;
  margin-right: 16px;
}
</style>
