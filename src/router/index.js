import Vue from 'vue';
import VueRouter from 'vue-router';

// 利用正则限制，views文件夹下的同名vue文件将被匹配当做路由
const moduleList = require.context('@/views', true, /\/(.+?)\/\1\.vue$/, 'lazy');

//
function createRoute(moduleList, prefix = '', isLazy = false) {
  const routes = [];
  let parentStack = []; // 当前栈

  // require.context引入的顺序是无法完全保证的，只保证同一个根目录文件夹下是连续的
  // 所以自己先排个序
  const orderList = moduleList.keys().sort((next, cur) => {
    const nextArr = next.split('/');
    const curArr = cur.split('/');
    // 从views下的一个根路由到另外一个根路由，顺序不用动
    if (nextArr[1] !== curArr[1]) {
      return 1;
    }
    //
    if (curArr.length > nextArr.length) {
      return -1;
    }
  });

  orderList.forEach(key => {
    // 删除路径开头的./和结尾的.vue
    let keyStr = key.slice(2, key.length - 4);
    const pathArr = keyStr.split('/');

    // 支持为路由添加前缀
    if (prefix) {
      pathArr.unshift(prefix);
    }

    pathArr[0] = '/' + pathArr[0]; // 最外层非嵌套路由必须包含前导斜杠字符（/）

    // 支持路由懒加载
    let component = null;
    if (isLazy) {
      component = () => moduleList(key);
    } else {
      component = moduleList(key).default;
    }

    const routeObj = {
      // path去掉结尾文件路径，保留文件夹路径
      path: pathArr.slice(0, pathArr.length - 1).join('/'),
      component
    };
    // length等于2说明是最最外层
    const oneLength = prefix ? 3 : 2;
    if (pathArr.length === oneLength) {
      // parentStack遍历结束都没有找到，说明当前key是在第一层，添加进pathList中
      routes.push(routeObj);
      parentStack.length = 0;
      parentStack.push(routeObj);
      return;
    }

    // 非最外层，一定是某个路由的子路由
    let parent = null;
    while (parentStack.length) {
      parent = parentStack[parentStack.length - 1];
      // 这里要注意，不能只用parent.path，因为parent.path是一个相对值，如果父子文件夹名称相同，无法区分是兄弟还是父子关系
      // 找到了父级路由
      if (parent.path === pathArr.slice(0, pathArr.length - 2).join('/')) {
        if (parent.children) {
          parent.children.push(routeObj);
        } else {
          parent.children = [routeObj];
        }
        parentStack.push(routeObj);
        return;
      } else {
        parentStack.pop();
      }
    }
  });
  // console.log(routes, 'routes');
  return routes;
}

const router = new VueRouter({
  routes: createRoute(moduleList, '', true)
});
Vue.use(VueRouter);

export default router;
