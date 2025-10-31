<template>
  <main>
    <div v-if="place" class="wrap-content text-block">
      <h1>{{ place.title }}</h1>
      <template v-if="shows.length">
        <h2>Shows</h2>
        <ul>
          <li v-for="show in shows" :key="show['.key']">
            <router-link :to="'/show/' + show['.key']">{{ show.title }}</router-link>
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

const placeId = useRouteParams('id')
const path = computed(() => placeId.value ? 'places/' + placeId.value : null)
const { data: place } = useFirebaseBinding(path, { isList: false, defaultValue: {} })
const shows = computed(() => Object.entries(place.value?.shows || {}).map(([ id, show ]) => ({ ['.key']: id, ...show })))
</script>
