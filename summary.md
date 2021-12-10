Vue 中视图如何与模板绑定？我们在 template 中写下 类似 html 的结构，最终呈现的页面如何绑定上 data 中的数据？  
本文全文就这个问题进行分析，首先看下 Vue 初始化的关键步骤。
![vue初始化流程](./doc/vue整体流程图2.png);
用一个非常简单的模板和其对应的数据，依照上面的流程图，逐个分析下关键步骤的原理。模板如下所示：

```
<!-- template -->
<div id="myVue">
    <div>
        {{x}}
    </div>
    <button onclick="add()">x++</button>
    <input type="text" v-model="x">
</div>
```

```
// data

data: {
  x: 1,
},
```

最终要达到的效果：

1. 模板中的数据被正确编译了，即双大括号和指令生效。
2. 模板中的数据是响应式的，当改变数据时，视图能够自动更新。

# 一、初始化流程

首先创建 MyVue 类，按顺序进行调用数据监测和模板编译，以及做了一个数据代理，将 data 上的数据直接绑定在 MyVue 实例上，方便访问。

```
// MyVue.js

class MyVue {
  constructor(options = {}) {
    this.$options = options;
    this._data = options.data;
    observe(this._data);  // 将数据变为响应式
    this._initData();
    new Compile(options.el, this);
  }
  /* 将data直接绑定在Vue实例上，方便访问，不需要多一层_data */
  _initData() {
    Object.keys(this._data).forEach(key => {
      Object.defineProperty(this, key, {
        get: () => {
          return this._data[key];
        },
        set: value => {
          this._data[key] = value;
        }
      });
    });
  }
}
export default MyVue;
```

如果大家看一下目录，可能会有疑问，流程图的顺序和本文分析的顺序是不一样的。对于 Vue 初始化流程来说，是先进行数据监测，再进行模板编译和视图更新。执行过程也必须是这样。而之所以分析时先分析模板编译，是本人学习时得出的经验。

1. 我认为模板编译是解开 Vue 神秘面纱的第一步，对在 template 中写下的类似 html 结构，如何展示到页面上有了基本的认识。
2. 模板编译前面一大段逻辑和数据监测并没有关系，只有最后执行 render 函数，渲染视图时，才会用到数据监测，没有数据监测也只是绑定失效而已。
3. 学完模板编译后，数据监测就变得呼之欲出了。相反如果先学习数据监测，其实整个思路上是不那么顺畅，学完后不知道用来干嘛。

# 二、模板编译

模板编译即把 template 当做一个模板字符串，对其进行词法分析。生成 AST 抽象语法树。

## 1. 生成 ast 抽象语法树

### ast 编译结果

首先先来看下目标，上面的 template 被编译后需要生成类似以下结构：

```
{
  attrs:[
      {
          name:'id',
          value:'myVue'
      }
  ],
  tag:'div',
  type:1,
  children:[...],
  // 如果标签上带有指令会有directives属性
  directives:{
    name:'xx',
    value:'xx'
  },
  // 如果节点类型是文本节点，会带有text属性
  text:undefined
}
```

核心属性即以上几个，最外层 id 为 MyVue 的 div 是不带有 directives 和 text 属性的，但是它的 children 中有可能会出现，所以这里只是做一下示意。children 就是 MyVue 的子节点数组，子节点同样用一个类似以上的结构来表示。

### ast 生成过程

现在目标已经很明确了，把模板字符串编译成 ast 抽象语法树。难点在于要把各层级标签一一地统计出来。这里用到了栈结构，遇见开始标签入栈，遇到结束标签就出栈，那么在这个过程中收集到的内容，即是栈中最后一个元素标签的属性。具体代码如下：

```
// parse.js

import parseAttrs from './attrsString'; //提取模板中的标签属性

const SingleTagList = ['input', 'img', 'br']; // 单标签特殊处理，只列举了一些常见的
export default function parse(templateStr) {
  let index = 0;
  let restStr = templateStr;
  const stack = [];
  const aResult = [];
  const startRexExp = /^<(([a-z][a-z\d]*)(\s.+?)?)>/; //匹配开始标签
  const endRegExp = /^<\/([a-z][a-z\d]*)>/; //匹配结尾标签
  const contentRegExp = /(.+?)<\/?[a-z][a-z\d]*(\s.+?)?>/s; //匹配标签内容
  while (index < templateStr.length) {
    restStr = templateStr.slice(index);
    /* 匹配标签开头 */
    /* 匹配开头不能是数字，后面允许有数字 */
    if (startRexExp.test(restStr)) {
      // 压栈
      const startTag = RegExp.$1;
      const tagName = RegExp.$2;
      const attrsString = RegExp.$3;
      const oNodeInfo = {
        tag: tagName,
        type: Node.ELEMENT_NODE,
        children: []
      };
      const { attrs, directives } = parseAttrs(attrsString);
      if (attrs.length) {
        oNodeInfo.attrs = attrs;
      }
      if (directives.length) {
        oNodeInfo.directives = directives;
      }
      if (SingleTagList.includes(tagName)) {
        // 单标签，单标签开始即结束了，相当于进行了双标签的入栈和出栈操作
        if (stack.length) {
          const oLastNodeInfo = stack[stack.length - 1];
          oLastNodeInfo.children.push(oNodeInfo);
        } else {
          /* 暂时只匹配纯文本节点，不考虑其他节点和文本节点都有的情况 */
          aResult.push(oNodeInfo);
        }
      } else {
        // 双标签
        stack.push(oNodeInfo);
      }
      console.log(`检测到开始${tagName}`);

      // +2是把<>符号也算上了
      index += startTag.length + 2;
    } else if (endRegExp.test(restStr)) {
      /* 匹配标签结尾 */
      // 出栈
      const endTag = RegExp.$1;
      const oContent = stack.pop();
      if (!oContent || endTag !== oContent.tag) {
        throw new Error('模板字符串格式错误');
      }
      if (stack.length) {
        const oLastNodeInfo = stack[stack.length - 1];
        oLastNodeInfo.children.push(oContent);
      } else {
        /* 暂时只匹配纯文本节点，不考虑其他节点和文本节点都有的情况 */
        aResult.push(oContent);
      }
      console.log(`检测到结束${endTag}`);
      index += endTag.length + 3;
    } else if (contentRegExp.test(restStr)) {
      // 匹配文本节点，全为空的跳过，全为空说明是空格或换行，不需要统计
      let content = RegExp.$1;
      /* \s 就是[ \t\v\n\r\f]。表示空白符，包括空格、水平制表符、垂直制表符、换行符、回车符、换页符。*/
      if (!/^\s+$/.test(content)) {
        const oLastNodeInfo = stack[stack.length - 1];
        oLastNodeInfo.children.push({
          type: Node.TEXT_NODE,
          content: content.trim() //存入栈中的文本节点，去掉前后空格。但是index的叠加是需要算上空格的
        });
      }
      index += content.length;
    } else {
      index++;
      throw new Error('怎么进else了？排查下是何特殊情况');
    }
  }
  return aResult[0];
}

```

## 2.生成 render 函数

得到 ast 抽象语法树后，就要利用它生成 render 函数。同样地先来看下结果，即把上面的 template 改用 render 函数实现，熟悉 Vue 的小伙伴应该都很了解，代码大概如下：

```
  render(h) {
    return h('div', { attrs: { id: 'myVue' } }, [
      h('div', this.x),
      h(
        'button',
        'x++'
      ),
      h('input', {
        attrs: { type: 'text' },
        domProps: { value: this.x },
        on: {
          input: $event => {
            this.x = $event.target.value;
          }
        }
      })
    ]);
  }
```

所以现在的任务，就是需要利用 ast 动态生成一个类似上述的函数。动态生成函数使用 new Function() 传入字符串的做法。但是用这种方法生成的函数，其词法作用域是在全局，而不在生成该函数的位置。Vue 在这里做了一个巧妙的处理是利用 with 关键字改变作用域。如果不想使用这种方法，也可通过传参的形式，去使用外部的一些变量。具体代码：

```
// createRender.js

export default function createRender(ast) {
  return new Function('_h', `with (this) return ${createCode(ast)}`);
}
function createCode(ast) {
  const children = ast.children.map(child => {
    if (child.type === 3) {
      // 文本节点
      if (/{{(.+?)}}/.test(child.text)) {
        return `${RegExp.$1}`;
      } else {
        return `"${child.text}"`;
      }
    } else if (child.type === 1) {
      // 元素节点
      return createCode(child);
    }
  });
  const data = {};
  if (ast.attrs) {
    data.props = {};
    // 转成snabbdom库h函数需要的格式
    ast.attrs.forEach(item => {
      data.props[item.name] = item.value;
    });
  }
  if (ast.directives) {
    data.directives = ast.directives;
  }
  return `_h("${ast.tag}",${JSON.stringify(data)}, [${children.join(',')}])`;
}
```

生成的函数结果如下。

```
function anonymous(_h) {
  with (this)
    return _h('div', { props: { id: 'myVue' } }, [
      _h('div', {}, [x]),
      _h('button', { props: { id: 'addBtn' } }, ['x++']),
      _h('input', { props: { type: 'text' }, directives: [{ name: 'model', value: 'x' }] }, [])
    ]);
}
```

这里的\_h 并不是 Vue 使用的 h 函数。利用 h 函数生成虚拟 DOM 并不是 Vue 开创的，Vue 借鉴了 snbbdom 库。所以这里我们直接通过 snbbdom 的 h 函数生成虚拟 DOM，\_h 是对 Vue 中的指令做一些特殊处理，使之符合 snbbdom 库 h 函数的传参，\_h 代码

```
// Compile.js

import { h } from 'snabbdom';
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
```

3. 执行 render 函数和 patch 函数
   render 函数已经被创建出来了，执行 render 函数后便可以得到虚拟 DOM，为了先尽早看到结果，可以先用 snabbdom 库的 patch 函数进行虚拟 DOM 上树。后面再详细分析 patch 函数。render 函数和 patch 函数的执行，就是对视图的更新，所以将他们封装到一个函数内。

```
const updateMain = () => {
  this.newVnode = this.renderFun.call(this.$vue, _h);
  // 第一次执行时，oldVnode即为$el
  this.oldVnode = snabbdom.patch(this.oldVnode, this.newVnode);
};
```

把这些代码都整合一下，即使没有数据监测，现在视图上展示的应该已经正确了，只不过没有跟数据进行绑定。进行到这里，就需要分析数据监测了。因为如果没有数据监测，无法监听到数据的改变，那么就不知道什么时候执行 updateMain 函数。

# 三、数据监测

## 1. 达成的效果

数据监测想要实现的效果，在前文中已经给出了。这里把他们提炼出来：

```
observe(this._data);  // 将数据变为响应式
// 利用Watcher类监听数据变化，改变时通知关联依赖进行视图更新
new Watcher(this.$vue, value, () => {
  updateMain();
});

```

这两段代码是之前写过的，但是还没有进行分析。这里 new Watcher 传入的 this.$vue，可以改为this._data。因为_initData函数对this.$vue 做了数据代理，访问 this.\$vue 上的数据实际就是访问了 this.\_data。也就是访问了传入的 data。
那么这个目的又明确了，对传入的对象`data={x:1}`，调用 observe 方法进行数据监测后，使用 new Watcher 可以监听到其属性的变化，并且执行回调函数，任务就完成了。  
到这里可能有些小伙伴觉得这个事情好像很简单，这里又是 observe，又是 Watcher 类是不是搞复杂了。是因为本文的例子非常简单，它的复杂性来自于这几点：

1. 对 data 对象的检测是深度检测，即可以检测多层。如果 data 是`data={obj1:{obj2:{x:1}}}`,依然可以对最后一层的 x 或者中间任意一层的属性进行监听。
2. 需要实现数组监听，中间任意一层如果有属性值为数组，也需要能够监听其变化。
3. 如果 data 的 x 属性被多个 Vue 组件使用，当 x 改变时要通知到每个组件进行视图更新。

展示一下最后的测试代码：

```
this.testObj = {
  a: {
    a1: 1,
  },
  b: 2,
  /* c作为testObj对象的一个属性，修改它时是响应式的；但是c的值是一个数组，修改数组的值并不是响应式的
     即直接对c进行赋值时，响应式操作；而对c的值进行修改，不是响应式的。
  */
  c: [2, 3,]
};
observe(this.testObj);
this.testObj.b = 20;
new Watcher(this.testObj, 'b', () => {
  console.log('b被改变了');
});
this.testObj.a.a1 = 10;
new Watcher(this.testObj, 'a.a1', () => {
  console.log('a1被改变了');
});
this.testObj.c.push(3);
new Watcher(this.testObj, 'c', () => {
  console.log('c被改变了');
});
```

只要最后回调函数执行了，说明数据监测成功。

# 四、patch 函数 详解
