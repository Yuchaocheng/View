export default function createEle(vnode) {
  const dom = document.createElement(vnode.sel);
  if (vnode.children && vnode.children.length) {
    vnode.children.forEach(childVnode => {
      dom.appendChild(createEle(childVnode));
    });
  } else if (vnode.text) {
    // 阉割版不允许又有children又有text的情况，二者互斥
    dom.innerHTML = vnode.text;
  }
  vnode.elm = dom;
  return dom;
}
