<template>
  <main>
    <div v-if="userAccount" class="wrap-content">
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
import { computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref as dbRef } from 'firebase/database'
import { db } from '../../firebase-app'

const store = useStore()
const route = useRoute()

const userAccount = computed(() => store.state.userAccount)
const accountPlayers = computed(() => store.state.accountPlayers)

const accountId = computed(() => {
  if (!userAccount.value) {
    return null
  }
  return userAccount.value['.key']
})

const init = () => {
  if (accountId.value) {
    store.dispatch('setRef', {
      key: 'accountPlayers',
      ref: dbRef(db, 'accounts/' + accountId.value + '/players')
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
