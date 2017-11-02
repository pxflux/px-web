// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import { sync } from 'vuex-router-sync'
import { createStore } from './store'
import { createRouter } from './router'
import firebaseApp from './firebase-app'

Vue.config.productionTip = false

export function createApp () {
  const store = createStore()
  const router = createRouter()

  /**
   * Sync the router with the vuex store. This registers `store.state.route`
   * (https://github.com/vuejs/vuex-router-sync/tree/next)
   */
  sync(store, router)

  /**
   * Sync store.state.user with firebase.auth().currentUser
   *
   * This callback is called when firebase.auth() detects user changes,
   * so just update the vuex store with the new user object.
   */
  firebaseApp.auth().onAuthStateChanged((user) => {
    store.commit('UPDATE_USER', user)
  })

  /* eslint-disable no-new */
  const app = new Vue({
    router,
    store,
    template: '<App/>',
    components: {App}
  })

  return {app, router, store}
}
