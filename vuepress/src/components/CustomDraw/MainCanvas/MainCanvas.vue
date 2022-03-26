<template>
  <div class="mainCanvas">
    <canvas ref="bacnground"></canvas>
    <canvas ref="showCanvas" class="showCanvas"></canvas>
    <canvas ref="drawCanvas"></canvas>
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
    const drawCanvasDom = this.$refs.drawCanvas;
    const bacngroundDom = this.$refs.bacnground;
    const showCanvas = this.$refs.showCanvas;
    bacngroundDom.width = drawCanvasDom.width = showCanvas.width = bacngroundDom.parentNode.clientWidth;
    bacngroundDom.height = drawCanvasDom.height = showCanvas.height = bacngroundDom.parentNode.clientHeight;

    this.mainCanvas = new MainCanvas(drawCanvasDom, bacngroundDom, showCanvas);
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
  // .showCanvas {
  //   position: fixed;
  //   left: 0;
  //   top: 0;
  //   border: 1px solid black;
  //   z-index: 500;
  // }
}
</style>
