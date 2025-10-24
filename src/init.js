// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './components/App'
import { createStore } from './store'
import { createRouter } from './router'

Vue.config.productionTip = false

export function createApp () {
  const store = createStore()
  const router = createRouter()

  /* eslint-disable no-new */
  const app = new Vue({
    router,
    store,
    template: '<App/>',
    components: {App}
  })

  return {app, router, store}
}
