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
    return 'accounts/' + accountId.value + '/artists'
  }
  return null
})

const { data: accountArtists } = useFirebaseBinding(path)
</script>
