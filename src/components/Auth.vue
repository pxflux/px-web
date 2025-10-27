<template>
  <div id="firebaseui-auth"></div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth'
import * as firebaseui from 'firebaseui'
import { auth } from '../firebase-app'

let ui

const store = useStore()
const route = useRoute()
const router = useRouter()

const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult (authResult, redirectUrl) {
      return false
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
      requireDisplayName: true
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
@import 'firebaseui/dist/firebaseui.css'

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
