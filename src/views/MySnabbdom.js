import { init, classModule, propsModule, styleModule, eventListenersModule, h } from 'snabbdom';

class MySnabbdom {
  constructor() {
    //
  }
  init() {}
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
      h('a', { props: { href: '/' } }, "I'll take you places!")
    ]);
    console.log(vnode, 'vnode');
    // Patch into empty DOM element – this modifies the DOM as a side effect
    // 让虚拟dom上真实dom树
    patch(container, vnode);
  }
}
export default new MySnabbdom();
