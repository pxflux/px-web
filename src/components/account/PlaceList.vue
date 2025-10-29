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
import { computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref as dbRef } from 'firebase/database'
import { db } from '../../firebase-app'

const store = useStore()
const route = useRoute()

const userAccount = computed(() => store.state.userAccount)
const accountPlaces = computed(() => store.state.accountPlaces)

const accountId = computed(() => {
  if (!userAccount.value) {
    return null
  }
  return userAccount.value['.key']
})

const init = () => {
  if (accountId.value) {
    store.dispatch('setRef', { key: 'accountPlaces', ref: dbRef(db, 'accounts/' + accountId.value + '/places') })
  }
}

onMounted(() => {
  init()
})

watch(() => route.path, () => {
  init()
})

watch(userAccount, () => {
  init()
})
</script>
