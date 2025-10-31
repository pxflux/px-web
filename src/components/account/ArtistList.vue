<template>
  <main>
    <div v-if="accountId" class="wrap-content">
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
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'
import { useAuth } from '../../composables/useAuth'

const { accountId } = useAuth()
const path = computed(() => accountId.value ? 'accounts/' + accountId.value + '/artists' : null)
const { data: accountArtists } = useFirebaseBinding(path)
</script>
