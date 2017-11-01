// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './App'

import router from './router'
import store from './store'

import './firebase'

Vue.config.productionTip = false

/**
 * Sync the router with the vuex store. This registers `store.state.route`
 * (https://github.com/vuejs/vuex-router-sync/tree/next)
 */
sync(store, router)

/* eslint-disable no-new */
const vm = new Vue({
  router,
  store,
  template: '<App/>',
  components: {App}
})

vm.$mount('#app')
