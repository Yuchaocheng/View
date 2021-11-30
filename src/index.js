import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import App from './App.vue';
import snabbdom from './views/snabbdom/snabbdom.vue';
import test from './views/test.vue';
import reactive from './views/reactive/reactive.vue';
import AST from './views/AST/AST.vue';
import myVue from './views/myVue/myVue.vue';

const routes = [
  { path: '/snabbdom', component: snabbdom },
  { path: '/test', component: test },
  { path: '/reactive', component: reactive },
  { path: '/AST', component: AST },
  { path: '/myVue', component: myVue }
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
