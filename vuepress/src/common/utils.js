/*
 * @Descripttion:
 * @Author: ycc
 * @Date: 2022-03-02 14:48:43
 * @LastEditTime: 2022-03-03 15:45:01
 */
export function isFun(x) {
  return typeof x === 'function';
}
export function isObj(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
}
