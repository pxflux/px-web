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
import { computed } from 'vue'
import { useRouteParams } from '@vueuse/router'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'

const showId = useRouteParams('id')
const path = computed(() => showId.value ? 'shows/' + showId.value : null)
const { data: show } = useFirebaseBinding(path, { isList: false, defaultValue: {} })
const places = computed(() => Object.entries(show.value.places || {}).map(([ id, place ]) => ({ ['.key']: id, ...place })))
</script>
