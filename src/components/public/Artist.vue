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
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { firebaseApp } from '../../firebase-app'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'

const route = useRoute()
const artist = ref({})
let artistUnsubscribe = null

const artistId = computed(() => {
  return route.params.id
})

const artworks = computed(() => {
  return Object.keys(artist.value.artworks || {}).map(id => {
    return { ...artist.value.artworks[id], ...{ '.key': id } }
  })
})

const shows = computed(() => {
  return Object.keys(artist.value.shows || {}).map(id => {
    return { ...artist.value.shows[id], ...{ '.key': id } }
  })
})

const init = () => {
  if (artistUnsubscribe) {
    artistUnsubscribe()
  }
  const db = getDatabase(firebaseApp)
  const artistRef = dbRef(db, 'artists/' + artistId.value)
  artistUnsubscribe = onValue(artistRef, (snapshot) => {
    if (snapshot.exists()) {
      artist.value = snapshot.val()
    } else {
      artist.value = {}
    }
  }, (error) => {
    console.error('Error loading artist:', error)
  })
}

const cleanup = () => {
  if (artistUnsubscribe) {
    artistUnsubscribe()
    artistUnsubscribe = null
  }
}

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  cleanup()
})

watch(() => route.path, () => {
  init()
})
</script>
