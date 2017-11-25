<template>
  <main v-if="artwork">
    <video-player v-if="preview"
                  :videoUrl="preview.displayUrl"
                  :ratio="preview.ratio">
    </video-player>
    <div class="wrap-content text-block">
      <h1 :title="artwork.title">{{ artwork.title }}</h1>
      <img v-show="image.displayUrl" :src="image.displayUrl" width="200" height="200">
      <span v-show="artwork.year">{{ artwork.year }}</span>
      <a v-show="artwork.url" :href="artwork.url" target="_blank">Launch</a>
      <template v-if="artists.length">
        <h2>Artists</h2>
        <ul v-for="artist in artists" :key="artist['__key']">
          <li>
            <router-link :to="'/artist/' + artist['.key']">{{ artist.fullName }}</router-link>
          </li>
        </ul>
      </template>
      <template v-if="shows.length">
        <h2>Shows</h2>
        <ul v-for="show in shows" :key="show['__key']">
          <li>
            <router-link :to="'/show/' + show['.key']">{{ show.title }}</router-link>
          </li>
        </ul>
      </template>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import firebase from '../../firebase-app'
  import VideoPlayer from '../VideoPlayer'

  export default {
    components: {
      'video-player': VideoPlayer
    },
    created () {
      this.init()
    },
    computed: {
      ...mapState(['artwork']),
      preview () {
        console.log('this.artwork: >>>>>>')
        console.log(this.artwork)
        return this.artwork && this.artwork.preview ? this.artwork.preview : null
      },
      artworkId () {
        return this.$route.params.id
      },
      image () {
        return this.artwork && this.artwork.image ? this.artwork.image : {
          displayUrl: null,
          storageUri: null
        }
      },
      artists () {
        return Object.keys(this.artwork.artists || {}).map(id => {
          return { ...this.artwork.artists[id], ...{ '.key': id } }
        })
      },
      shows () {
        return Object.keys(this.artwork.shows || {}).map(id => {
          return { ...this.artwork.shows[id], ...{ '.key': id } }
        })
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.setRef({ key: 'artwork', ref: firebase.database().ref('artworks/' + this.artworkId) })
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
