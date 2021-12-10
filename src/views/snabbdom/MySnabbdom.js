import { init, classModule, propsModule, styleModule, eventListenersModule, h } from 'snabbdom';

import H from './h';
import myPatch from './diff/patch';
// import myPatch from './diff/patch-old';

class MySnabbdom {
  constructor() {
    this.patch = null;
    this.oldVnode = null;
    this.init();
    //
  }
  init() {
    // 创建patch函数
    const patch = init([classModule, propsModule, styleModule, eventListenersModule]);
    this.patch = patch;
    this.h = h;
  }
  // 使用useSnabbdom库
  useSnabbdom() {
    const clickDom = e => {
      console.log(e);
    };
    // 创建patch函数
    const patch = init([
      // Init patch function with chosen modules
      classModule, // makes it easy to toggle classes
      propsModule, // for setting properties on DOM elements
      styleModule, // handles styling on elements with support for animations
      eventListenersModule // attaches event listeners
    ]);
    const container = document.getElementById('container');
    // 创建虚拟节点
    const vnode = h('div#container.two.classes', { on: { click: clickDom } }, [
      h('span#test', { style: { fontWeight: 'bold' } }, 'This is bold'),
      ' and this is just normal text',
      h('a', { props: { href: '/' } }, ["I'll take you places!"])
    ]);
    // console.log(vnode, 'vnode');
    // Patch into empty DOM element – this modifies the DOM as a side effect
    /* 
    让虚拟dom内容上真实dom,patch是用第二个参数（虚拟dom），去替换第一个参数。第一个参数要么本身是真实dom，
    要么是虚拟dom但是已有elm属性，即有其对应的真实dom，无论是哪种情况下的真实dom，都不一定是上树状态。
    */
    //
    const test = patch(container, vnode);
    // const dom = document.createElement('li');
    // const test2 = patch(dom, h('div', 11));
    // console.log(test2, 111);
  }
  // 使用自己编写的h
  useMyH() {
    const patch = this.patch;
    const result = H('ul', { class: { myH: true } }, [
      H('li', 'A'),
      H('li', 'B'),
      H('li', [H('span', 11), H('span', { class: { text: true } }, 22)])
    ]);
    if (patch) {
      const dom = document.getElementById('myH');
      /* 自己编写的h函数可以直接运用在patch函数上，说明是成功的 */
      patch(dom, result);
    }
  }
  useMyPatch(isFirst) {
    const container = document.getElementById('container');
    const vnode2 = h('ul', [
      h('li', { key: 'A0' }, 'A0'),
      h('li', { key: 'A1' }, 'A111'),
      h('li', { key: 'B2' }, 'B2222'),
      h('li', { key: 'C3' }, 'C33'),
      h('li', { key: 'D4' }, 'D44')
    ]);
    if (isFirst) {
      this.oldVnode = h('ul', [
        h('li', { key: 'B2' }, 'B2'),
        h('li', { key: 'A1' }, 'A1'),
        h('li', { key: 'D4' }, 'D4'),
        h('li', { key: 'C3' }, 'C3')
        // h('li', { key: 'E5' }, 'E5'),
      ]);
      //  第一次上树
      myPatch(container, this.oldVnode);
    } else {
      // 新旧节点是同一个虚拟节点时
      myPatch(this.oldVnode, vnode2);
    }
  }
  // 按钮触发
  trigger1() {
    this.useMyPatch(true);
  }
  trigger2() {
    this.useMyPatch();
  }
}
export default new MySnabbdom();
