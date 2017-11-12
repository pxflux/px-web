<template>
  <main>
    <div class="wrap-content grid">
      <ul>
        <li v-for="show in shows" :key="show['.key']">
          <router-link :to="'/show/' + show['.key']">{{ show.title }}</router-link>
        </li>
      </ul>
      <span class="nothing-found" v-if="shows.length == 0">Shows not found.</span>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import firebase from '../../firebase-app'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['user', 'shows'])
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (this.user.uid) {
          this.setRef({
            key: 'shows',
            ref: firebase.database().ref('shows')
          })
        }
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
