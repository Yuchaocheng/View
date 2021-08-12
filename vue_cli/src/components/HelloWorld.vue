
<script>
import Test from "./test.vue";
export default {
  name: "HelloWorld",
  render(h) {
    return h(
      `h${this.level}`,
      {
        on: {
          click: this.clickHandler,
        },
        /* 如果create的是一个组件，下面的props就是向组件传递的props参数  */
        props: {},
      },
      [
        this.$slots.default,
        this.test,
        h("div", [
          this.msg,
          /* Test组件在render函数中的运用 */
          [
            h(
              Test,
              {
                class: {
                  helloTest: true,
                },
                props: {
                  testProp: "hahahahha",
                },
                // 作用域插槽
                scopedSlots: {
                  default: ({ content }) => h("span", content),
                },
              },
              [h("div", { slot: "footer" }, "this is footer")]
            ),
          ],
        ]),
      ]
    );
  },
  props: {
    msg: String,
    level: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      test: "test",
    };
  },
  created() {
    let obj = {
      fun: this.clickHandler,
    };
    // 就像这个例子，按照正常的逻辑，函数被谁调用，函数内部this就指向谁，
    // 但是这里的fun（clickHandler的地址），被强制绑定了内部this为vue实例
    obj.fun();
  },
  // methods里的方法，最终被执行的时候内部this一定指向vue实例，这个是vue内部处理了
  methods: {
    clickHandler() {
      // console.log(this, "this");
      this.test = "";
    },
  },
};
</script>

<style scoped>
</style>
