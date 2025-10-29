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
    return 'accounts/' + accountId.value + '/shows'
  }
  return null
})

const { data: accountShows } = useFirebaseBinding(path)
</script>
