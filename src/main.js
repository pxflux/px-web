// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { createApp } from './init'
import ProgressBar from './components/ProgressBar'
import firebaseApp from './firebase-app'

// global progress bar
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

// a global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const {asyncData} = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
})

const {app, router, store} = createApp()

/**
 * Sync store.state.user with firebase.auth().currentUser
 *
 * This callback is called when firebase.auth() detects user changes,
 * so just update the vuex store with the new user object.
 */
let callback = null
let userRef = null
firebaseApp.auth().onAuthStateChanged(user => {
  console.log('onAuthStateChanged:', user)
  if (callback) {
    userRef.off('value', callback)
  }
  if (user) {
    userRef = firebaseApp.database().ref('metadata/' + user.uid + '/refreshTime')
    callback = (snapshot) => {
      if (store.user && store.user.token.accountId !== user.token.accountId) {
        user.getIdToken(true)
      }
    }
    userRef.on('value', callback)
  }
  store.commit('UPDATE_USER', user)
})

// wait until router has resolved all async before hooks and async components...
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
    if (!asyncDataHooks.length) {
      return next()
    }

    bar.start()
    Promise.all(asyncDataHooks.map(hook => hook({store, route: to})))
      .then(() => {
        bar.finish()
        next()
      })
      .catch(next)
  })

  // actually mount to DOM
  app.$mount('#app')
})
