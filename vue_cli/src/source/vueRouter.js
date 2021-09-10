/* 与mode参数有关的部分的源代码如下 */
export default class VueRouter {
    mode: string; // 传入的字符串参数，指示history类别
    history: HashHistory | HTML5History | AbstractHistory; // 实际起作用的对象属性，必须是以上三个类的枚举
    fallback: boolean; // 如浏览器不支持，'history'模式需回滚为'hash'模式

    constructor(options: RouterOptions = {}) {
        let mode = options.mode || "hash"; // 默认为'hash'模式
        this.fallback = mode === "history" && !supportsPushState; // 通过supportsPushState判断浏览器是否支持'history'模式
        if (this.fallback) {
            mode = "hash";
        }
        if (!inBrowser) {
            mode = "abstract"; // 不在浏览器环境下运行需强制为'abstract'模式
        }
        this.mode = mode;

        // 根据mode确定history实际的类并实例化
        switch (mode) {
            case "history":
                this.history = new HTML5History(this, options.base);
                break;
            case "hash":
                this.history = new HashHistory(this, options.base, this.fallback);
                break;
            case "abstract":
                this.history = new AbstractHistory(this, options.base);
                break;
            default:
                if (process.env.NODE_ENV !== "production") {
                    assert(false, `invalid mode: ${mode}`);
                }
        }
    }

    init(app: any /* Vue component instance */) {
        const history = this.history;

        // 根据history的类别执行相应的初始化操作和监听
        if (history instanceof HTML5History) {
            history.transitionTo(history.getCurrentLocation());
        } else if (history instanceof HashHistory) {
            const setupHashListener = () => {
                history.setupListeners();
            };
            history.transitionTo(history.getCurrentLocation(), setupHashListener, setupHashListener);
        }

        history.listen((route) => {
            this.apps.forEach((app) => {
                app._route = route;
            });
        });
    }

    // VueRouter类暴露的以下方法实际是调用具体history对象的方法
    push(location: RawLocation, onComplete?: Function, onAbort?: Function) {
        this.history.push(location, onComplete, onAbort);
    }

    replace(location: RawLocation, onComplete?: Function, onAbort?: Function) {
        this.history.replace(location, onComplete, onAbort);
    }
}
