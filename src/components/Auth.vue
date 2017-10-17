<template>
  <div id="firebaseui-auth"></div>
</template>

<script>
  import firebase from 'firebase';
  import firebaseui from 'firebaseui';

  let ui;

  export default {
    mounted() {
      ui = ui || new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth', {
        signInSuccessUrl: '/',
        signInOptions: [
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
      });
    },
    destroyed() {
      ui.reset();
    },
  };
</script>

<style>
  @import url('../../node_modules/firebaseui/dist/firebaseui.css');
</style>
