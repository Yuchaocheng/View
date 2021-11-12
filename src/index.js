import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import App from './App.vue';
import snabbdom from './views/snabbdom/snabbdom.vue';
import test from './views/test.vue';

const routes = [
  { path: '/snabbdom', component: snabbdom },
  { path: '/test', component: test }
];
const router = new VueRouter({
  routes
});
Vue.use(ElementUI);
Vue.use(VueRouter);

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
