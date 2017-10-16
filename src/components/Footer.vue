<template>
  <footer v-show=" ! loading">
    <div class="wrap">
      <a class="icon-github" href="https://github.com/pxflux/px-dashboard-web" target="_blank"></a>

      <div class="sub-links">
        <a v-if="user" @click="doSomething" class="login-btn">Logout</a>
        <a v-if=" ! user" :href="auth" class="login-btn">Login</a>
      </div>
    </div>
  </footer>
</template>

<script>
  import firebaseApp from 'firebase';

  export default {
    created() {
      this.user = firebaseApp.auth().currentUser;
    },
    data() {
      return {
        user: {},
      };
    },
    methods: {
      logOut() {
        firebaseApp.auth().signOut();
      },
    },
  };
</script>
