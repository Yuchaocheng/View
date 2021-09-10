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
    // mode: "history",
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

window.onhashchange = function() {
    debugger
    console.log("URL发生变化了");
};
