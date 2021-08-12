import Vue from "vue";

// require.context返回一个函数，可以通过key返回对应模块
const getFileModule = require.context("@/components/global", false, /\.vue$/);
// 返回的函数中绑定了keys方法
getFileModule.keys().forEach((key) => {
    const oModule = getFileModule(key).default;
    Vue.component(oModule.name,oModule)
});
