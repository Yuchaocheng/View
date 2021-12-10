import Watcher from '../reactive/Watcher';
import parse from '../AST/parse';
import createRender from './createRender';
import snabbdom from '../snabbdom/MySnabbdom';
import { h } from 'snabbdom';

export default class Compile {
  constructor(el, vue) {
    this.$vue = vue;
    this.$el = el;

    this.$vue.h = h; //将h函数绑定在Vue实例上
    // setTimeout(() => {
    const templateStr = this.$el.outerHTML;
    this.ast = parse(templateStr);
    this.renderFun = createRender(this.ast);
    console.log(this.renderFun);
    debugger;
    this.oldVnode = this.$el;
    this.update();
  }
  update() {
    const _h = (sel, data, children) => {
      if (data.directives) {
        /* 处理指令，指令处理是相对复杂的，因为不同指令就要做不同的处理，该例子展示双向绑定，只对v-mode指令做处理 */
        data.directives.forEach(({ name, value }) => {
          if (name === 'model') {
            // 处理v-model指令，利用Watcher类监听指令绑定的数据的变化，改变时通知关联依赖进行视图更新
            new Watcher(this.$vue, value, () => {
              updateMain();
            });
            const inputFun = $event => {
              this.$vue[value] = $event.target.value;
            };
            data.props.value = this.$vue[value];
            data.on = {
              input: inputFun
            };
          }
          // 如果要处理其他指令，可以在这里扩展
        });
      }
      return h(sel, data, children);
    };
    const updateMain = () => {
      this.newVnode = this.renderFun.call(this.$vue, _h);
      this.oldVnode = snabbdom.patch(this.oldVnode, this.newVnode);
    };
    updateMain();
  }
}
