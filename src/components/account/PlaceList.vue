<template>
  <main>
    <div v-if="userAccount" class="wrap-content">
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
import { useStore } from 'vuex'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'

const store = useStore()

const userAccount = computed(() => store.state.userAccount)

const accountId = computed(() => {
  if (!userAccount.value) {
    return null
  }
  return userAccount.value['.key']
})

const path = computed(() => {
  if (accountId.value) {
    return 'accounts/' + accountId.value + '/places'
  }
  return null
})

const { data: accountPlaces } = useFirebaseBinding(path)
</script>
