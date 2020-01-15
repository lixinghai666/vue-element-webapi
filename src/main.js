// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'

import store from './store.js'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/iconfont.css'
import '@/assets/css/style.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Router from 'vue-router'

Vue.prototype.$axios = axios;

Vue.use(VueAxios,axios)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.component('footer-copyright', {
  template: '<p class="footer-msg">©CopyRight 2019 天津市恒润环境工程有限公司 版权所有 <a href="http://www.miibeian.gov.cn" target="_blank">备案号：津ICP16002209号</a></p>'
});

Vue.filter('formatDateTime', function (value) {
  if (!value) return ''
  let date = new Date(value);
  let y = date.getFullYear() + '/';
  let mon = (date.getMonth() + 1) + '/';
  let d = date.getDate();
  return y + mon + d;
});

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
})
