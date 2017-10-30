<template>
  <header>
    <div class="wrap">
      <router-link to="/" class="button">PxFlux</router-link>
      <router-link v-if=" ! user" to="/auth" class="login-btn">Login</router-link>
      <a v-if="user" @click="logOut" class="login-btn">Logout</a>
      <router-link v-if="user" to="/artworks" class="button">Artworks</router-link>
      <router-link v-if="user" to="/artwork-create" class="button">Add</router-link>
    </div>
  </header>
</template>

<script>
  import { mapState } from 'vuex'
  import firebaseApp from '../firebase'

  export default {
    data () {
      return {}
    },
    computed: {
      ...mapState({
        user: state => state.user
      })
    },
    methods: {
      logOut () {
        firebaseApp.auth().signOut()
      }
    }
  }
</script>
