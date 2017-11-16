<template>
  <main v-if="artwork">
    <div class="wrap-content text-block">
      <h1 :title="artwork.title">{{ artwork.title }}</h1>
      <img v-show="image.displayUrl" :src="image.displayUrl" width="200" height="200">
      <h2>Artists</h2>
      <ul v-for="artist in artists" :key="artist['__key']">
        <li>
          <router-link :to="'/artist/' + artist['.key']">{{ artist.fullName }}</router-link>
        </li>
      </ul>
      <h2>Shows</h2>
      <ul v-for="show in shows" :key="show['__key']">
        <li>
          <router-link :to="'/show/' + show['.key']">{{ show.title }}</router-link>
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
      ...mapState(['artwork']),
      image () {
        return this.artwork && this.artwork.image ? this.artwork.image : {
          displayUrl: null,
          storageUri: null
        }
      },
      artists () {
        return Object.keys(this.artwork.artists || {}).map(id => {
          return {...this.artwork.artists[id], ...{'.key': id}}
        })
      },
      shows () {
        return Object.keys(this.artwork.shows || {}).map(id => {
          return {...this.artwork.shows[id], ...{'.key': id}}
        })
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.setRef({key: 'artwork', ref: firebase.database().ref('artworks/' + this.$route.params.id)})
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
