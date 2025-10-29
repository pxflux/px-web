<template>
  <main>
    <div v-if="artist" class="wrap-content text-block">
      <h1>{{ artist.fullName }}</h1>
      <template v-if="artworks">
        <h2>Works</h2>
        <ul>
          <li v-for="artwork in artworks" :key="artwork['.key']">
            <router-link :to="'/artwork/' + artwork['.key']">{{ artwork.title }}</router-link>
          </li>
        </ul>
      </template>
      <template v-if="shows.length">
        <h2>Shows</h2>
        <ul>
          <li v-for="show in shows" :key="show['.key']">
            <router-link :to="'/show/' + place['.key']">{{ show.title }}</router-link>
          </li>
        </ul>
      </template>
    </div>
  </main>
</template>

<script>
  import { useFirebaseBinding } from '../../composables/useFirebaseBinding'

  export default {
    setup() {
      const { data: artist, bind } = useFirebaseBinding()

      return {
        artist,
        bind
      }
    },
    created () {
      this.init()
    },
    computed: {
      artistId () {
        return this.$route.params.id
      },
      artworks () {
        return Object.keys(this.artist?.artworks || {}).map(id => {
          return {...this.artist.artworks[id], ...{'.key': id}}
        })
      },
      shows () {
        return Object.keys(this.artist?.shows || {}).map(id => {
          return {...this.artist.shows[id], ...{'.key': id}}
        })
      }
    },
    methods: {
      init () {
        this.bind('artists/' + this.artistId)
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
