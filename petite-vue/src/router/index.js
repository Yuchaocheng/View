const INIT_PATH = "/login"; //最开始的路径
const app = "#app";

// 上一次匹配时间
let lastMathTime = 0;
let lastRednerPage = "";

function createRoutes() {
    const aModuleList = require.context("@/views", true, /^\..*\.(js|html)$/);
    const result = {};
    aModuleList.keys().forEach((key) => {
        const pathArr = key.split("/"); //模块完整路径
        const length = pathArr.length;
        const routeArr = pathArr.slice(1, length - 1); //路由路径，不需要.和最后的文件名
        const lastPath = pathArr.slice(-1)[0];
        const fileName = lastPath.replace(/\..+?$/, "");
        const path = "/" + routeArr.join("/");
        /* 只会把同名文件夹下的同名js文件作为路由 */
        if (fileName !== pathArr[length - 2]) {
            return;
        }
        if (!result[path]) {
            result[path] = {
                path,
            };
        }
        getRouteInfo({ key, aModuleList, routeArr }, result[path]);
    });
    return result;
}

// 创造一个路由
function getRouteInfo({ key, aModuleList, routeArr }, routeInfo) {
    const ext = key.replace(/^.+\./, "");
    if (routeArr.length > 1) {
        routeInfo.parent = routeArr[routeArr.length - 2];
    }
    if (ext === "html") {
        routeInfo.template = aModuleList(key).default;
    } else if (ext === "js") {
        if (typeof aModuleList(key).default !== "function") {
            throw new Error("page js expectd export default a function ");
        }
        routeInfo.module = aModuleList(key).default;
    }
}

// 将路由数组转换成对象，方便匹配
// function transToMap(routes) {
//     return routes.reduce((pre, cur) => {
//         if (cur.path && !(cur.path in pre)) {
//             pre[cur.path] = cur;
//             if (cur.children) {
//                 Object.assign(pre, transToMap(cur.children));
//             }
//         }
//         return pre;
//     }, {});
// }

class Router {
    constructor({ routes = [] } = {}) {
        this.routes = routes || [];
        this.routesMap = {}; //routes数组的转换对象
        this._init();
    }
    /* 初始化路由 */
    _init() {
        window.addEventListener("hashchange", (e) => {
            const match = e.newURL.match(/#(\/.*)$/);
            if (match && match[1]) {
                this._renderPage(match[1]);
            } else {
                this._renderPage("/");
            }
        });
        this.routesMap = createRoutes();
        this._originJump();
    }
    /* 页面首次加载 */
    _originJump() {
        let path = this._getCurrentPath();
        if (!path) {
            // 默认路由，后续完善成可配的
            path = INIT_PATH;
        }
        this.push(path);
        /* 首次加载手动渲染，因为如果是在当前页刷新，是不进监听事件的 */
        this._renderPage(path);
    }
    _getCurrentPath() {
        const hash = window.location.hash;
        if (hash) {
            return hash.slice(1);
        } else {
            return "";
        }
    }
    push(path) {
        const currentPath = this._getCurrentPath();
        // 如果要跳转的路由和当前路由一致，则直接返回
        if (path === currentPath) {
            return;
        }
        window.location.hash = `#${path}`;
    }
    // 渲染页面
    _renderPage(path) {
        const now = Date.now();
        // 同一页面短时间内的重复渲染，只渲染一次
        if (lastRednerPage === path && now - lastMathTime < 500) {
            return;
        }
        const { routesMap } = this;
        if (path in routesMap) {
            const oCurrenRoute = routesMap[path];
            let parentNode = this.getParentNode(oCurrenRoute);
            // 父节点还没有渲染
            if (!parentNode) {
                const newPathArr = path.split("/");
                if (newPathArr.length > 2) {
                    this._renderPage(newPathArr.slice(0, newPathArr.length - 1).join("/"));
                    parentNode = this.getParentNode(oCurrenRoute);
                } else {
                    // 路由缺失父节点
                    throw new Error("router need a container");
                }
            }
            parentNode.innerHTML = "";
            const currentDom = document.createElement("div");
            parentNode.appendChild(currentDom);
            currentDom.outerHTML = oCurrenRoute.template;
            if (oCurrenRoute.module && typeof oCurrenRoute.module === "function") {
                oCurrenRoute.module();
            }
            lastRednerPage = path;
            lastMathTime = now;
        }else{
            /* 未匹配到就默认去初始路径吧 */
            this._renderPage(INIT_PATH)
        }
    }
    // 获取父节点。最外层父节点由Router传入，其他层根据  文件夹名称+ "--router" id获取
    getParentNode(route) {
        return route.parent ? document.querySelector("#" + route.parent + "--router") : document.querySelector(app);
    }
}
export default new Router();
