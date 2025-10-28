<template>
  <main>
    <div v-if="show" class="wrap-content text-block">
      <h1>{{ show.title }}</h1>
      <template v-if="places.length">
        <h2>Places</h2>
        <ul v-for="place in places" :key="place['__key']">
          <li>
            <router-link :to="'/place/' + place['.key']">{{ place.title }}</router-link>
          </li>
        </ul>
      </template>
    </div>
  </main>
</template>

<script>
  import { firebaseApp } from '../../firebase-app'
  import { getDatabase, ref } from 'firebase/database'

  export default {
    data() {
      return {
        show: {}
      }
    },

    created () {
      this.init()
    },
    computed: {
      showId () {
        return this.$route.params.id
      },
      places () {
        return Object.keys(this.show.places || {}).map(id => {
          return {...this.show.places[id], ...{'.key': id}}
        })
      }
    },
    methods: {
      init () {
        const db = getDatabase(firebaseApp)
        this.$databaseBind('show', ref(db, 'shows/' + this.showId))
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
