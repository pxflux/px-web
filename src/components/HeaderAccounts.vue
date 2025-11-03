<template>
  <div v-if="userAccount" class="item-with-submenu">
    <a class="button submenu-trigger">{{ userAccount.title }}</a>
    <div class="submenu">
      <div v-for="account in inactiveAccounts" :key="account['.key']" class="button"
        @click="setAccount(account['.key'])">
        {{ account.title }}
      </div>
    </div>
  </div>
  <router-link v-else to="/account/new" class="button">Create Account</router-link>
</template>

<script setup>
import { computed } from 'vue'
import { db } from '../firebase-app'
import { ref as dbRef, set } from 'firebase/database'
import { useSubmenu } from '../composables/useSubmenu'
import { log } from '../helper'
import { useFirebaseBinding } from '../composables/useFirebaseBinding'
import { useAuth } from '../composables/useAuth'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const { userAccount } = useAuth()
const { closeSubmenus } = useSubmenu()

const path = computed(() => props.user?.uid ? 'users/' + props.user.uid + '/accounts' : null)
const { data: accounts } = useFirebaseBinding(path)

const inactiveAccounts = computed(() => {
  const accountsArray = Array.isArray(accounts.value) ? accounts.value : Object.values(accounts.value)
  return accountsArray.filter(account => account && account?.['.key'] !== userAccount.value?.['.key'])
})

const setAccount = (accountId) => {
  closeSubmenus()
  set(dbRef(db, 'users/' + props.user.uid + '/accountId'), accountId).catch(log)
}
</script>
