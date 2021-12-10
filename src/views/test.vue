<script>
export default {
  created() {
    debugger;
    let obj = { a: 1 };
    const s = `
        let obj = {
          a:1
        };
            `;
    console.log(s);
    debugger;

    const fun = new Function(s);
    console.log(fun);
    fun();
  },
  render(h) {
    return h('div', { class: 'test' }, [h('h1', '哈哈')]);
  }
};
</script>

<style lang="less" scoped></style>
