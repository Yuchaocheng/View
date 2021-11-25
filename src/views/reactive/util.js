// 封装一个定义对象属性的方法，方便后续调用
const def = (obj, key, value, options) => {
  Object.defineProperty(obj, key, {
    value,
    ...options
  });
};

export { def };
