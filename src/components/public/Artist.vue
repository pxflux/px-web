<template>
  <main>
    <div v-if="artist" class="wrap-content text-block">
      <h1>{{ artist.fullName }}</h1>
      <h2>Works</h2>
      <ul>
        <li v-for="artwork in artworks" :key="artwork['.key']">
          <router-link :to="'/artwork/' + artwork['.key']">{{ artwork.title }}</router-link>
        </li>
      </ul>
      <h2>Shows</h2>
      <ul>
        <li v-for="show in shows" :key="show['.key']">
          <router-link :to="'/show/' + place['.key']">{{ show.title }}</router-link>
        </li>
      </ul>
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
      ...mapState(['artist']),
      artworks () {
        return Object.keys(this.artist.artworks || {}).map(id => {
          return {...this.artist.artworks[id], ...{'.key': id}}
        })
      },
      shows () {
        return Object.keys(this.artist.shows || {}).map(id => {
          return {...this.artist.shows[id], ...{'.key': id}}
        })
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.setRef({
          key: 'artist',
          ref: firebase.database().ref('artists/' + this.$route.params.id)
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
