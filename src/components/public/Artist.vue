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

<script setup>
import { computed } from 'vue'
import { useRouteParams } from '@vueuse/router'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'

const artistId = useRouteParams('id')
const path = computed(() => artistId.value ? 'artists/' + artistId.value : null)
const { data: artist } = useFirebaseBinding(path, { isList: false, defaultValue: {} })
const artworks = computed(() => Object.entries(artist.value.artworks || {}).map(([ id, artwork ]) => ({ ['.key']: id, ...artwork })))
const shows = computed(() => Object.entries(artist.value.shows || {}).map(([ id, show ]) => ({ ['.key']: id, ...show })))
</script>
