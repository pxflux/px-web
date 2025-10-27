<template>
  <main>
    <div v-if="place" class="wrap-content text-block">
      <h1>{{ place.title }}</h1>
      <template v-if="shows.length">
        <h2>Shows</h2>
        <ul v-for="show in shows" :key="show['__key']">
          <li>
            <router-link :to="'/show/' + place['.key']">{{ show.title }}</router-link>
          </li>
        </ul>
      </template>
    </div>
  </main>
</template>

<script>
  import firebaseApp from '../../firebase-app'
  import { getDatabase, ref } from 'firebase/database'

  export default {
    data() {
      return {
        place: {}
      }
    },

    created () {
      this.init()
    },
    computed: {
      placeId () {
        return this.$route.params.id
      },
      shows () {
        return Object.keys(this.place.shows || {}).map(id => {
          return {...this.place.shows[id], ...{'.key': id}}
        })
      }
    },
    methods: {
      init () {
        const db = getDatabase(firebaseApp)
        this.$databaseBind('place', ref(db, 'places/' + this.placeId))
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
