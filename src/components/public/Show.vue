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

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { firebaseApp } from '../../firebase-app'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'

const route = useRoute()
const show = ref({})
let showUnsubscribe = null

const showId = computed(() => {
  return route.params.id
})

const places = computed(() => {
  return Object.keys(show.value.places || {}).map(id => {
    return { ...show.value.places[id], ...{ '.key': id } }
  })
})

const init = () => {
  if (showUnsubscribe) {
    showUnsubscribe()
  }
  const db = getDatabase(firebaseApp)
  const showRef = dbRef(db, 'shows/' + showId.value)
  showUnsubscribe = onValue(showRef, (snapshot) => {
    if (snapshot.exists()) {
      show.value = snapshot.val()
    } else {
      show.value = {}
    }
  }, (error) => {
    console.error('Error loading show:', error)
  })
}

const cleanup = () => {
  if (showUnsubscribe) {
    showUnsubscribe()
    showUnsubscribe = null
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
