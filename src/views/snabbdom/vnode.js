export default function(sel, data, children, text, elm) {
  /* patch函数内部data不能为undefined */
  let key;
  if (data) {
    key = data.key;
  } else {
    data = {};
  }
  return {
    sel,
    data,
    children,
    text,
    elm,
    key
  };
}
