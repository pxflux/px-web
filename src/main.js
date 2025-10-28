// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { createApp } from 'vue'
import { createAppRouter } from './router'
import { createStore } from './store'
import ProgressBar from './components/elements/ProgressBar.vue'
import { firebaseApp, auth } from './firebase-app'
import { getDatabase, ref, onValue, off, get } from 'firebase/database'
import { onAuthStateChanged } from 'firebase/auth'
import { plugin as inputAutoWidth } from 'vue-input-autowidth'
import VueScrollTo from 'vue-scrollto'
import { VueFire, VueFireDatabaseOptionsAPI } from 'vuefire'
import App from './components/App.vue'

function b64DecodeUnicode (str) {
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
}

// global progress bar
let bar = null

// a global mixin that calls `asyncData` when a route component's params change
const globalMixin = {
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
}

// Create app instance
const app = createApp(App)

// Setup router and store
const router = createAppRouter()
const store = createStore()

// Install plugins
app.use(store)
app.use(router)
app.use(inputAutoWidth)
app.use(VueScrollTo)
app.use(VueFire, {
  firebaseApp,
  modules: [
    VueFireDatabaseOptionsAPI()
  ]
})

// Add global mixin
app.mixin(globalMixin)

// Global progress bar
if (!document.getElementById('progress-bar-placeholder')) {
  const placeholder = document.createElement('div')
  placeholder.id = 'progress-bar-placeholder'
  document.body.appendChild(placeholder)
}
bar = createApp(ProgressBar).mount('#progress-bar-placeholder')
app.config.globalProperties.$bar = bar

/**
 * Sync store.state.user with firebase.auth().currentUser
 *
 * This callback is called when firebase.auth() detects user changes,
 * so just update the vuex store with the new user object.
 */
let callback = null
let userRef = null
onAuthStateChanged(auth, (user) => {
  console.log('onAuthStateChanged:', user)
  if (callback && userRef) {
    off(userRef, 'value', callback)
  }
  if (user) {
    const db = getDatabase(firebaseApp)
    userRef = ref(db, 'metadata/' + user.uid + '/refreshTime')
    callback = onValue(userRef, (snapshot) => {
      console.log('onMetadataChanged:', snapshot)
      if (!snapshot.exists()) {
        return
      }
      return user.getIdToken(true).then((token) => {
        store.commit('UPDATE_USER', {user: auth.currentUser, account: auth.currentUser})
        // console.log('getIdToken:', token)
        return JSON.parse(b64DecodeUnicode(token.split('.')[1]))
      }).then(function (payload) {
        if (!payload.hasOwnProperty('accountId')) {
          throw new Error()
        }
        const accountRef = ref(db, 'accounts/' + payload.accountId)
        return get(accountRef).then(function (snapshot) {
          if (!snapshot.exists()) {
            throw new Error()
          }
          const account = snapshot.val()
          account['.key'] = snapshot.key
          store.commit('UPDATE_USER', {user: user, account: account})
        })
      }).catch(function (error) {
        console.log(error)
        store.commit('UPDATE_USER', null)
      })
    })
  } else {
    store.commit('UPDATE_USER', null)
  }
})

// wait until router has resolved all async before hooks and async components...
router.isReady().then(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const matched = to.matched.flatMap(record =>
      Object.values(record.components).filter(c => c.asyncData)
    )
    const prevMatched = from.matched.flatMap(record =>
      Object.values(record.components).filter(c => c.asyncData)
    )
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
  app.mount('#app')
})
