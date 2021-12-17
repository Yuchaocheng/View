import vnode from './vnode';

const isObj = obj => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};
// vnode(sel, data, children, text, elm)
export default function(sel, data, c) {
  const length = arguments.length;
  if (length < 2) {
    throw new Error('least 2 params');
  }
  // 只有两个参数的情况，即中间的data被省略了或者没有children
  if (length === 2) {
    // sel + text
    if (typeof data === 'string' || typeof data === 'number') {
      return vnode(sel, undefined, undefined, data);
    }
    // sel + data
    if (isObj(data)) {
      return vnode(sel, data);
    }
    // sel + children
    if (Array.isArray(data)) {
      return vnode(sel, undefined, data);
    }
    throw new Error('参数类型错误！');
  } else {
    // 三个参数的情况
    if (!isObj(data)) {
      throw new Error('参数类型错误！');
    }
    // sel + data + text
    if (typeof c === 'string' || typeof c === 'number') {
      return vnode(sel, data, undefined, c);
    }
    // sel + data+children
    if (Array.isArray(c)) {
      return vnode(sel, data, c);
    }
    throw new Error('参数类型错误！');
  }
}
