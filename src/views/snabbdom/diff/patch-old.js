import vnode from '../vnode';
import createEle from './createEle';

// 当新老虚拟节点是同一个时，进行精细化比较，因为需要递归，所以把函数单独提起出来
const patchVnode = (oldVnode, newVnode) => {
  // 是同一个节点，进行精细化比较，具体情况查看patch函数流程图
  if (oldVnode === newVnode) {
    // 新旧节点是内存中的同一个对象时，就什么都不做
    return;
  }
  if (newVnode.text || newVnode.text === '') {
    if (newVnode.text === oldVnode.text) {
      // 新旧节点子节点都是文本节点，且text相同时，不需要做处理
      return;
    } else {
      oldVnode.elm.innerText = newVnode.text;
      newVnode.elm = oldVnode.elm;
    }
  } else if (newVnode.children) {
    if (oldVnode.text) {
      // 1. 清空旧dom
      oldVnode.elm.innerHTML = '';
      // 2. 添加新虚拟节点的children属性
      newVnode.children.forEach(child => {
        oldVnode.elm.appendChild(createEle(child));
      });
      newVnode.elm = oldVnode.elm;
    } else if (oldVnode.children) {
      // 最复杂的情况，新老虚拟节点都有children，就需要对比每一个子虚拟节点
      newVnode.children.forEach(newChild => {
        const matchOld = oldVnode.children.find(oldChild => oldChild.key === newChild.key && !oldChild.isMatched);
        if (matchOld) {
          // 新虚拟节点子节点，在旧虚拟节点中存在时，直接进行精细化比较
          patchVnode(matchOld, newChild);
          matchOld.isMatched = true;
        } else {
          // 不存在在时需要新增，新增位置如何确定?
          oldVnode.elm.appendChild(createEle(newChild));
        }
      });
      // 还剩下最后一种情况，就是说旧节点子节点中有，但是新节点中已经被删除，也就是上面循环中未匹配到的旧节点
      oldVnode.children.forEach(oldChild => {
        if (!oldChild.isMatched) {
          oldChild.elm.parentNode.removeChild(oldChild.elm);
        }
      });
    }
  }
};
export default (oldVnode, newVnode) => {
  /* 源码中就是这么判断的，实际上随意了一点，有可能在dom对象是新增了一个sel属性 */
  if (oldVnode.sel === undefined) {
    oldVnode = vnode(oldVnode.tagName, {}, [], '', oldVnode);
  }

  // 是否为同一个虚拟节点
  const keyIsSame = oldVnode.key === newVnode.key;
  const selIsSame = oldVnode.sel === newVnode.sel;
  if (keyIsSame && selIsSame) {
    patchVnode(oldVnode, newVnode);
  } else {
    // 不是同一个节点，插入新dom，删除旧dom
    const newDom = createEle(newVnode);
    if (!oldVnode.elm) {
      // 老节点要么是真实dom，要么是虚拟dom但是具有elm属性
      return;
    }
    oldVnode.elm.parentNode.insertBefore(newDom, oldVnode.elm);
    oldVnode.elm.parentNode.removeChild(oldVnode.elm);
  }
};
