/* hook文件一般都用use开头命名，里面存放可复用的逻辑或者是完全独立的逻辑 */

import { reactive, onMounted, onUnmounted, ref } from 'vue';
let pointType = ref('point');
export default () => {
  const point = reactive({ x: 0, y: 0 });
  const getPoint = (event) => {
    pointType.value += '!';
    point.x = event.clientX;
    point.y = event.clientY;
  };
  onMounted(() => {
    window.addEventListener('click', getPoint);
  });
  onUnmounted(() => {
    window.removeEventListener('click', getPoint);
  });
  return point;
};
export { pointType };
