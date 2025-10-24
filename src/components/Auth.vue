<template>
  <div id="firebaseui-auth"></div>
</template>

<script>
  import { mapState } from 'vuex'
  import { getAuth, GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth'
  import firebaseui from 'firebaseui'
  import firebaseApp from '../firebase-app'

  let ui

  /* eslint-disable no-unused-vars */
  const uiConfig = {
    signInSuccessUrl: '/',
    callbacks: {
      // Called when the user has been successfully signed in
      signInSuccess (user, credential, redirectUrl) {
        return false
      }
    },
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

  export default {
    mounted () {
      const auth = getAuth(firebaseApp)
      ui = ui || new firebaseui.auth.AuthUI(auth)
      ui.start('#firebaseui-auth', uiConfig)
    },
    computed: {
      ...mapState([ 'user' ])
    },
    unmounted () {
      ui.reset()
    },
    watch: {
      user (val) {
        if (val) {
          if (this.$router.currentRoute.query.redirect) {
            this.$router.replace(this.$router.currentRoute.query.redirect)
          } else {
            this.$router.replace('/auth')
          }
        }
      }
    }
  }
</script>

<style lang="sass">
@import '~firebaseui/dist/firebaseui.css'

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
