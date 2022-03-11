<template>
  <div class="mainCanvas">
    <canvas ref="bacnground" width="415" height="580"></canvas>
    <canvas ref="mainCanvas" width="415" height="580">浏览器不支持canvas</canvas>
  </div>
</template>

<script>
import MainCanvas from './MainCanvas';

export default {
  data() {
    return {
      mainCanvas: null,
    };
  },
  computed: {},
  mounted() {
    const mainCanvasDom = this.$refs.mainCanvas;
    const bacngroundDom = this.$refs.bacnground;
    const parentStyle = getComputedStyle(bacngroundDom.parentNode);
    bacngroundDom.width = mainCanvasDom.width = parseInt(parentStyle.width);
    bacngroundDom.height = mainCanvasDom.height = parseInt(parentStyle.height);

    this.mainCanvas = new MainCanvas(mainCanvasDom, bacngroundDom);
    this.mainCanvas.init();
  },
  methods: {
    setDrawType(type) {
      this.mainCanvas.setDrawType(type);
    },
  },
};
</script>

<style lang="less" scoped>
.mainCanvas {
  background-color: #eeeeef;
  border: thin solid #aaaaaa;
  border-radius: 8px;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 40%);
  position: relative;
  width: 100%;
  > canvas {
    position: absolute;
  }
}
</style>
