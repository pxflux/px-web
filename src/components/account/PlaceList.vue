<template>
  <main>
    <div v-if="accountId" class="wrap-content">
      <div class="content">
        <ul>
          <li v-for="place in accountPlaces" :key="place['.key']">
            <router-link :to="'/account/place/' + place['.key']">{{ place.title }}</router-link>
          </li>
        </ul>
        <span class="nothing-found" v-if="accountPlaces.length == 0">Places not found.</span>
        <router-link to="/account/place/new">Add Place</router-link>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'
import { useAuth } from '../../composables/useAuth'

const { accountId } = useAuth()

const path = computed(() => {
  if (accountId.value) {
    return 'accounts/' + accountId.value + '/places'
  }
  return null
})

const { data: accountPlaces } = useFirebaseBinding(path)
</script>
