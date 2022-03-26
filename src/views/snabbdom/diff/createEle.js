export default function createEle(vnode) {
  const dom = document.createElement(vnode.sel);
  /* 处理DOM属性和监听事件 */
  if (vnode.data) {
    const { props, attributes, on } = vnode.data;
    if (props) {
      Object.keys(props).forEach(propName => (dom[propName] = props[propName]));
    }
    if (attributes) {
      Object.keys(attributes).forEach(attrName => dom.setAttribute(attrName, attributes[attrName]));
    }
    if (on) {
      Object.keys(on).forEach(evetName => {
        dom.addEventListener(evetName, on[evetName]);
      });
    }
  }
  if (vnode.children && vnode.children.length) {
    vnode.children.forEach(childVnode => {
      dom.appendChild(createEle(childVnode));
    });
  } else if (vnode.text) {
    // 简化版不允许又有children又有text的情况，二者互斥
    dom.innerHTML = vnode.text;
  }
  vnode.elm = dom;
  return dom;
}
