/* eslint-disable */
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import AMap from 'vue-amap'
import i18n from './language'
// import 'common/js/browser'

import 'common/css/index.css'

fastclick.attach(document.body)

Vue.use(AMap)
// 初始化vue-amap
AMap.initAMapApiLoader({
  // 申请的高德key
  key: 'c7b2704242b3cf81e8f773e7e1046ea2',
  // 插件集合
  plugin: ['AMap.Geolocation']
})

document.oncontextmenu = function(e) {
  e.preventDefault()
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  i18n,
  render: h => h(App)
})
