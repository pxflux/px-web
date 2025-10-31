<template>
  <main>
    <div class="wrap-content">
      <div class="content">
        <div v-if="accountId" class="wrap-content">
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
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'
import { useAuth } from '../../composables/useAuth'

const { accountId } = useAuth()

const path = computed(() => accountId.value ? 'accounts/' + accountId.value + '/shows' : null)
const { data: accountShows } = useFirebaseBinding(path)
</script>
