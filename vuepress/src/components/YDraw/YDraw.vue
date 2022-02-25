<template>
  <div>
    <div class="main">
      <canvas id="toolCanvas" class="left" width="80" height="680">浏览器不支持canvas</canvas>
      <div class="draw-container">
        <canvas id="bacngroundCanvas" width="915" height="680"></canvas>
        <canvas id="drawCanvas" width="915" height="680">浏览器不支持canvas</canvas>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'YDraw',
};
</script>

<style  scoped>
.main{
    display: flex;
}

</style>
