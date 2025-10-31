<template>
  <main>
    <div v-if="accountId" class="wrap-content grid">
      <form id="form-player" @submit.prevent="accept">
        <label for="pin">Pin</label>
        <input id="pin" type="text" v-model.trim="pin" required="required">
        <button>Add</button>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ref as dbRef, set } from 'firebase/database'
import { db } from '../../firebase-app'
import { log } from '../../helper'
import { useAuth } from '../../composables/useAuth'

const { accountId } = useAuth()
const router = useRouter()

const pin = ref('')

const accept = () => {
  if (accountId.value) {
    set(dbRef(db, 'player-pins/' + pin.value), { accountId: accountId.value }).then(() => {
      router.push('/account/players')
    }).catch(log)
  }
}
</script>
