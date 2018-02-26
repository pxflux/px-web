// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './components/App'
import { sync } from 'vuex-router-sync'
import { createStore } from './store'
import { createRouter } from './router'

Vue.config.productionTip = false

export function createApp () {
  const store = createStore()
  const router = createRouter()

  /**
   * Sync the router with the vuex store. This registers `store.state.route`
   * (https://github.com/vuejs/vuex-router-sync/tree/next)
   */
  sync(store, router)

  /* eslint-disable no-new */
  const app = new Vue({
    router,
    store,
    template: '<App/>',
    components: {App}
  })

  return {app, router, store}
}
