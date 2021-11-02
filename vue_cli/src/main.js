import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import VueRouter from "vue-router";
import store from "./store";
import "element-ui/lib/theme-chalk/index.css";
import "@/components/global/index.js";

import VueTest from "@/components/VueTest.vue";
import Components from "@/view/Components.vue";
import MarryTest from "@/view/MarryTest.vue";

import nextTick from "./test";

Vue.use(ElementUI);
Vue.use(VueRouter);

const routes = [
    { path: "/", component: Components },
    { path: "/test", component: VueTest },
    // { path: "/marry", name: "marry", component: MarryTest, props: true },
    {
        path: "/marry",
        name: "marry",
        component: MarryTest,
        props: (route) => route.query,
    },
];
const router = new VueRouter({
    mode: "history",
    routes, // (缩写) 相当于 routes: routes
});

Vue.config.productionTip = false;

// const App2 = Vue.extend(App);
const vm = new Vue({
    router,
    store, //必须调用Vue.use(vuex)后，store才会被挂载到Vue原型上
    render: (h) => h(App),
}).$mount("#app");

// console.log(Vue, "Vue");
// console.log(Vue.prototype, "Vue");
// console.log(vm, "vm");

// hahs模式下监听路由
window.addEventListener("hashchange", myFunction);

/* hash模式下设置的hashchange监听事件，url中的hash值改变时触发，无论是通过代码改变还是通过浏览器输入改变 */
function myFunction(e) {
    debugger;
    console.log(e.oldURL, "oldURL");
    console.log(e.newURL, "newURL");
}

window.onpopstate = function(event) {
    console.log("state: ", event.state);
    debugger;
};

setTimeout(() => {
    debugger
    history.pushState({page:"marry"},"","/marry");
}, 3000);
