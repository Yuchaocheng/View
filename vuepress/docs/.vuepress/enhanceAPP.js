/*
 * @Descripttion: 
 * @Author: ycc
 * @Date: 2022-02-25 15:20:10
 * @LastEditTime: 2022-03-02 14:34:41
 */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import '@/src/assets/less/index.less';
import '../../src/assets/less/index.less';

import components from '@/index';

export default ({ Vue, options, router }) => {
  Vue.use(ElementUI);
  Vue.use(components);
};
