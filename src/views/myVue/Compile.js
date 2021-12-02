import Watcher from '../reactive/Watcher';

export default class Compile {
  constructor(el, vue) {
    this.$vue = vue;
    this.$el = el;
    if (this.$el) {
      // 调用函数，让节点变为fragment,类似于mustache中的tokens。vue内部实际上用的是虚拟节点，这里使用fragment做简单处理。
      let fragment = this.node2Fragment(this.$el);
      this.compile(fragment);
      this.$el.appendChild(fragment);
    }
    this.getVueVal(this.$vue, 'a.b');
  }
  node2Fragment(el) {
    const fragment = document.createDocumentFragment();
    var child = null;
    /* 将已在当前文档中的节点加入到文档片段后，文档中的节点便会被移除，所以不断循环，el.firstChild最终会变成null */
    // child = el.firstChild 本身是一条语句，语句是没有返回值的。括号括起来后，便成为了一个表达式
    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }
    return fragment;
  }

  compile(el) {
    const childNodes = el.childNodes;
    childNodes.forEach(childNode => {
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        this.compileElement(childNode);
      } else if (childNode.nodeType === Node.TEXT_NODE) {
        let content = childNode.textContent;
        // 如果文本不是全为空
        if (!/^\s*$/.test(content)) {
          content = content.trim();
          this.compileText(childNode, content);
        }
      }
    });
  }
  // 编译元素节点
  compileElement(node) {
    // Dom节点提供方法，可以直接获取一个属性对象。 Vue底层实际是根据字符串组装AST抽象语法树的，也就是自己匹配出属性
    const nodeAttrs = node.attributes;
    [...nodeAttrs].forEach(attr => {
      const { name: dirName, value: dirValue } = attr;
      // 指令都是v-，证明其是指令，
      if (/^v-(.+)$/.test(dirName)) {
        const dirName = RegExp.$1;
        console.log(dirName, 'dirName');
        /* 指令映射对象 */
        const oDirMap = {
          // model指令处理
          model: () => {
            // 收集依赖
            new Watcher(this.$vue, dirValue, (newValue, oldValue) => {
              /* v-model绑定的数据发生改变了，更新视图 */
              node.value = newValue;
            });
            node.addEventListener('input', e => {
              console.log(e.target.value);
              this.setVueVal(this.$vue, dirValue, e.target.value);
            });
            // 设定初始值
            node.value = this.getVueVal(this.$vue, dirValue);

            console.log(1111);
          },
          // show指令处理
          show: () => {
            let value = this.getVueVal(this.$vue, dirValue);
            if (value) {
              node.style.display = 'block';
            } else {
              node.style.display = 'none';
            }
            new Watcher(this.$vue, dirValue, (newValue, oldValue) => {
              if (newValue) {
                node.style.display = 'block';
              } else {
                node.style.display = 'none';
              }
            });
          }
        };
        if (Object.prototype.hasOwnProperty.call(oDirMap, dirName)) {
          oDirMap[dirName]();
        }
      }
    });
    /* 如果该节点有子节点，需要递归处理 */
    if (node.hasChildNodes()) {
      this.compile(node);
    }
  }
  // 编译文本节点
  compileText(node, content) {
    // 将双花括号内的变量取出，赋值
    if (/{{(.+)}}/.test(content)) {
      const key = RegExp.$1;
      node.textContent = this.getVueVal(this.$vue, key);
      /* 视图中用到的变量，要用Watcher进行监听，并且收集到Dep中 */
      new Watcher(this.$vue, key, (value, oldValue) => {
        /* 当外部触发改变时，Dep通知Watcher进行视图更新 */
        node.textContent = value;
      });
    }
  }
  getVueVal(vue, exp) {
    if (exp.includes('.')) {
      exp.split('.').forEach(item => {
        vue = vue[item];
      });
      return vue;
    }
    return vue[exp];
  }
  setVueVal(vue, exp, value) {
    if (exp.includes('.')) {
      let obj = vue;
      exp.split('.').forEach((item, index, arr) => {
        if (index < arr.length - 1) {
          obj = obj[item];
        } else {
          obj = value;
        }
      });
      return vue;
    } else {
      vue[exp] = value;
    }
  }
}
