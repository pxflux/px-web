<template>
  <main>
    <div v-if="userAccount" class="wrap-content">
      <div class="content">
        <ul>
          <li v-for="artist in accountArtists" :key="artist['.key']">
            <router-link :to="'/account/artist/' + artist['.key']">{{ artist.fullName }}</router-link>
          </li>
        </ul>
        <span class="nothing-found" v-if="accountArtists.length == 0">Artists not found.</span>
        <router-link to="/account/artist/new">Add Artist</router-link>
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
const accountArtists = computed(() => store.state.accountArtists)

const accountId = computed(() => {
  if (!userAccount.value) {
    return null
  }
  return userAccount.value['.key']
})

const init = () => {
  if (accountId.value) {
    store.dispatch('setRef', {
      key: 'accountArtists',
      ref: dbRef(db, 'accounts/' + accountId.value + '/artists')
    })
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
