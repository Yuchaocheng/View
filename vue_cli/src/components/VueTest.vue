<template>
  <div class="VueTest">
    <h1>vueTeset</h1>
  </div>
</template>

<script>
export default {
  created() {
    let obj = { a: 1 };
    const s = `
    let obj = ${obj}
            `;

    const fun = new Function(s);
    fun();
  }
};
</script>

<style scoped></style>
