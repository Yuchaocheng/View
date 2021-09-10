let Vue;
class KVueRouter {
    constructor(options) {
        this.$options = options;
        this.$routerMap = {}; //{"/":{component:...}}
        // url 响应式，当值变化时引用的地方都会刷新
        this.app = new Vue({
            data: {
                current: "/",
            },
        });
    }
    // 初始化
    init() {
        // 监听事件
        this.bindEvent();
        // 解析路由
        this.createRouteMap();
        // 声明组件
        this.initComponent();
    }
    bindEvent() {
        window.addEventListener("hashchange", this.onHashchange.bind(this));
    }
    onHashchange() {
        this.app.current = window.location.hash.slice(1) || "/";
    }
    createRouteMap() {
        this.$options.routes.forEach((route) => {
            this.$routerMap[route.path] = route;
        });
    }
    initComponent() {
        Vue.component("router-link", {
            props: {
                to: String,
            },
            render(h) {
                return h("a", { attrs: { href: "#" + this.to } }, [this.$slots.default]);
            },
        });
        Vue.component("router-view", {
            render: (h) => {
                const Component = this.$routerMap[this.app.current].component;
                return h(Component);
            },
        });
    }
}
// 参数是vue构造函数，Vue.use(router)时,执行router的install方法并把Vue作为参数传入
KVueRouter.install = function(_vue) {
    Vue = _vue;
    //全局混入
    Vue.mixin({
        beforeCreate() {
            //拿到router的示例，挂载到vue的原型上
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router;
                this.$options.router.init();
            }
        },
    });
};
export default KVueRouter;
