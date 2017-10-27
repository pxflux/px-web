<template>
  <footer v-if="$route.name != 'auth'">
    <div class="wrap">
      <a class="icon-github" href="https://github.com/pxflux/px-dashboard-web" target="_blank"></a>

      <div class="sub-links">
        <a v-if="user" @click="logOut" class="login-btn">Logout</a>
        <router-link v-if=" ! user" to="/auth" class="login-btn">Login</router-link>
      </div>
    </div>
  </footer>
</template>

<script>
  import firebaseApp from '../firebase';

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
