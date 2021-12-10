import { h } from 'snabbdom';

export default function createRender(ast) {
  return new Function('_h', `with (this) return ${createCode(ast)}`);
}
function createCode(ast) {
  const children = ast.children.map(child => {
    if (child.type === 3) {
      // 文本节点，这里做简化处理，默认文本要么是纯文本，要么是双花括号绑定的值。
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
// export default function createRender() {
//   const s = `
//   with (obj) {
//     console.log(a)
//     return 1
//   }`;
//   const s2 = `
//   with (this) {
//     return h('div', {
//       props:{
//         id:'myVue'
//       }
//     } , [
//       h('div', {}, [x]),
//       h('button', { props: { id: 'addBtn' } }, ['x++']),
//       h('input', { props: { type: 'text' } }, []),
//     ])
//    }`;
//   return new Function(s2);
// }
