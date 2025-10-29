<template>
  <main>
    <div class="wrap-content">
      <div class="content">
        <div v-if="userAccount" class="wrap-content">
          <ul>
            <li v-for="show in accountShows" :key="show['.key']">
              <router-link :to="'/account/show/' + show['.key']">{{ show.title }}</router-link>
            </li>
          </ul>
          <span class="nothing-found" v-if="accountShows.length == 0">Shows not found.</span>
          <router-link to="/account/show/new">Add Show</router-link>
        </div>
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
const accountShows = computed(() => store.state.accountShows)

const accountId = computed(() => {
  if (!userAccount.value) {
    return null
  }
  return userAccount.value['.key']
})

const init = () => {
  if (accountId.value) {
    store.dispatch('setRef', { key: 'accountShows', ref: dbRef(db, 'accounts/' + accountId.value + '/shows') })
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
