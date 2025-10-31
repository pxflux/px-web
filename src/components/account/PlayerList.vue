<template>
  <main>
    <div v-if="accountId" class="wrap-content">
      <div class="content">
        <ul>
          <li v-for="player in accountPlayers" :key="player['.key']">
            {{ player.pin }}
          </li>
        </ul>
        <span class="nothing-found" v-if="accountPlayers.length === 0">Players not found.</span>
        <router-link to="/account/player/new">Add Player</router-link>
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
    return 'accounts/' + accountId.value + '/players'
  }
  return null
})

const { data: accountPlayers } = useFirebaseBinding(path)
</script>
