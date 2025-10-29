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

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { firebaseApp } from '../../firebase-app'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'

const route = useRoute()
const place = ref({})
let placeUnsubscribe = null

const placeId = computed(() => {
  return route.params.id
})

const shows = computed(() => {
  return Object.keys(place.value.shows || {}).map(id => {
    return { ...place.value.shows[id], ...{ '.key': id } }
  })
})

const init = () => {
  if (placeUnsubscribe) {
    placeUnsubscribe()
  }
  const db = getDatabase(firebaseApp)
  const placeRef = dbRef(db, 'places/' + placeId.value)
  placeUnsubscribe = onValue(placeRef, (snapshot) => {
    if (snapshot.exists()) {
      place.value = snapshot.val()
    } else {
      place.value = {}
    }
  }, (error) => {
    console.error('Error loading place:', error)
  })
}

const cleanup = () => {
  if (placeUnsubscribe) {
    placeUnsubscribe()
    placeUnsubscribe = null
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
