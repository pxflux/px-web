<template>
  <div>
    <div v-if="authError" class="auth-error">
      <p>Authentication failed: {{ authError }}</p>
      <button @click="clearError" class="error-dismiss">×</button>
    </div>
    <div id="firebaseui-auth"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth'
import * as firebaseui from 'firebaseui'
import { auth } from '../firebase-app'

let ui

const store = useStore()
const route = useRoute()
const router = useRouter()
const authError = ref(null)

const clearError = () => {
  authError.value = null
}

const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult (authResult, redirectUrl) {
      console.log('Sign-in successful:', authResult.user.email)
      clearError()
      return false
    },
    signInFailure (error) {
      console.error('Sign-in failed:', error)
      let errorMessage = 'Authentication failed'

      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email address'
            break
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password'
            break
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address'
            break
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled'
            break
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later'
            break
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection'
            break
          case 'auth/email-already-in-use':
            errorMessage = 'An account with this email already exists'
            break
          case 'auth/weak-password':
            errorMessage = 'Password is too weak'
            break
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password accounts are not enabled'
            break
          default:
            errorMessage = `Authentication error: ${error.message || error.code}`
        }
      } else {
        errorMessage = error.message || 'Unknown authentication error'
      }

      authError.value = errorMessage
      return Promise.reject(error)
    },
    uiShown () {
      console.log('Firebase UI shown')
      clearError()
    }
  },
  signInFlow: 'popup',
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [
    {
      provider: GoogleAuthProvider.PROVIDER_ID,
      scopes: [ 'https://www.googleapis.com/auth/plus.login' ]
    },
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: true,
      signInMethod: 'password'
    }
  ]
}

const user = computed(() => store.state.user)

onMounted(() => {
  ui = ui || new firebaseui.auth.AuthUI(auth)
  ui.start('#firebaseui-auth', uiConfig)
})

onUnmounted(() => {
  ui.reset()
})

watch(user, (val) => {
  if (val) {
    if (route.query.redirect) {
      router.replace(route.query.redirect)
    } else {
      router.replace('/auth')
    }
  }
})
</script>

<style lang="sass">
@use 'firebaseui/dist/firebaseui.css' as *

.auth-error
  background-color: #fee
  border: 1px solid #fcc
  border-radius: 4px
  padding: 12px 16px
  margin-bottom: 16px
  position: relative
  color: #c33
  font-size: 14px

  p
    margin: 0
    padding-right: 20px

  .error-dismiss
    position: absolute
    top: 8px
    right: 8px
    background: none
    border: none
    font-size: 18px
    cursor: pointer
    color: #c33
    padding: 0
    width: 20px
    height: 20px
    display: flex
    align-items: center
    justify-content: center

    &:hover
      background-color: #fdd
      border-radius: 2px

ul.firebaseui-idp-list
  margin: 0
  list-style-type: none

.firebaseui-card-content
  padding: 0 5px

.firebaseui-container
  max-width: 768px

.firebaseui-idp-button
  font-weight: 100
  max-width: 768px
  line-height: 36px
  span
    text-align: center

.firebaseui-idp-google > .firebaseui-idp-text
  color: #363636
</style>
