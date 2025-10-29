// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { createApp } from 'vue'
import { createAppRouter } from './router'
import { createStore } from './store'
import ProgressBar from './components/elements/ProgressBar.vue'
import { db, auth } from './firebase-app'
import { ref, onValue, off, get } from 'firebase/database'
import { onAuthStateChanged } from 'firebase/auth'
import { plugin as inputAutoWidth } from 'vue-input-autowidth'
import VueScrollTo from 'vue-scrollto'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './components/App.vue'

function b64DecodeUnicode (str) {
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
}

// global progress bar
let bar = null

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
app.use(ElementPlus)

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
  // actually mount to DOM
  app.mount('#app')
})
