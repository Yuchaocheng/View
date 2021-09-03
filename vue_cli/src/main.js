import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import VueRouter from "vue-router";
import "element-ui/lib/theme-chalk/index.css";
import "@/components/global/index.js";

import VueTest from "@/components/VueTest.vue";
import Components from "@/view/Components.vue";

Vue.use(ElementUI);
Vue.use(VueRouter);

const routes = [
    { path: "/", component: Components },
    { path: "/test", component: VueTest },
];
const router = new VueRouter({
    routes, // (缩写) 相当于 routes: routes
});

Vue.config.productionTip = false;

const App2 = Vue.extend(App);
const vm = new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");

// console.log(Vue, "Vue");
// console.log(Vue.prototype, "Vue");
// console.log(vm, "vm");
