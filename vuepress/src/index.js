const componentsModule = require.context('@/components', true, /\.vue$/);


const registerGlobalComponents = (aModuleList, Vue) => {
  aModuleList.keys().forEach((key) => {
    const oModule = aModuleList(key).default;
    const regex = /\.\/(.+?)\/\1\.vue$/i;
    /* 组件名称优先调用组件name字段，若没有则使用文件夹名称 */
    const componentName = oModule.name || RegExp.$1;
    /* 利用正则限制，只注册一级文件夹下的同名vue文件，大小写忽略 */
    if (regex.test(key)) {
      Vue.component(componentName, oModule);
    }
  });
};

const install = (Vue) => {
  if (install.installed) {
    return;
  }
  registerGlobalComponents(componentsModule, Vue);
};

export default {
  install,
};
