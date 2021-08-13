import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/components/global/index.js";
Vue.use(ElementUI);

Vue.config.productionTip = false;

const App2 = Vue.extend(App);
const vm =  new Vue({
    render: (h) => h(App),
}).$mount("#app");
console.log(App2.prototype.__proto__ === vm.__proto__);
console.log(vm,"vm");
console.log(vm.__proto__,"vm");