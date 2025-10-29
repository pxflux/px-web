<template>
  <main>
    <div v-if="userAccount" class="wrap-content grid">
      <form id="form-player" @submit.prevent="accept">
        <label for="pin">Pin</label>
        <input id="pin" type="text" v-model.trim="pin" required="required">
        <button>Add</button>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref as dbRef, set } from 'firebase/database'
import { db } from '../../firebase-app'
import { log } from '../../helper'

const store = useStore()
const router = useRouter()

const pin = ref('')
const userAccount = computed(() => store.state.userAccount)

const accountId = computed(() => {
  if (!userAccount.value) {
    return null
  }
  return userAccount.value['.key']
})

const accept = () => {
  if (accountId.value) {
    const account = {
      accountId: accountId.value
    }
    set(dbRef(db, 'player-pins/' + pin.value), account).then(() => {
      router.push('/account/players')
    }).catch(log)
  }
}
</script>
