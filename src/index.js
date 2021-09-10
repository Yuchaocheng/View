import Vue from "vue";
console.log(11111111);
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";

Vue.use(ElementUI);

new Vue({
    el: "#app",
    render: (h) => h(App),
});


