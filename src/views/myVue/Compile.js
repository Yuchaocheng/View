export default class Compile {
  constructor(el, vue) {
    this.$vue = vue;
    this.$el = document.querySelector(el);
    if (this.$el) {
      // 调用函数，让节点变为fragment,类似于mustache中的tokens。实际上用的是AST，这里就是轻量级的，fragment。
      this.node2Fragment(this.$el);
    }
  }
  node2Fragment() {}
}
