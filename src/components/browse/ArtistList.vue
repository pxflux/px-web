<template>
  <main>
    <div class="wrap-content grid">
      <ul>
        <li v-for="artist in artists" :key="artist['.key']">
          <router-link :to="'/artist/' + artist['.key']">{{ artist.name }}</router-link>
        </li>
      </ul>
      <span class="nothing-found" v-if="artists.length == 0">Artists not found.</span>
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
      ...mapState(['artists'])
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.setRef({
          key: 'artists',
          ref: firebase.database().ref('artists')
        })
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
