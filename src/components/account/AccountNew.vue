<template>
  <main>
    <div v-if="user" class="wrap-content grid">
      <form id="form-account" @submit.prevent="createAccount">
        <fieldset>
          <label>Title</label>
          <input id="title" type="text" v-model.trim="title" title="Title" required="required">
        </fieldset>
        <button>Create</button>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ref as dbRef, push, set } from 'firebase/database'
import { db } from '../../firebase-app'
import { log } from '../../helper'
import { useAuth } from '../../composables/useAuth'

const { user } = useAuth()
const router = useRouter()

const title = ref('')

const createAccount = () => {
  const account = {
    title: title.value
  }
  push(dbRef(db, 'accounts'), account).then((data) => {
    const accountId = data.key
    return Promise.all([
      set(dbRef(db, 'accounts/' + accountId + '/users/' + user.value.uid), {
        'displayName': user.value.displayName,
        'photoUrl': user.value.photoURL
      }),
      set(dbRef(db, 'users/' + user.value.uid + '/accounts/' + accountId), true),
      set(dbRef(db, 'users/' + user.value.uid + '/accountId'), accountId)
    ]).then(() => {
      router.push('/account/update')
    })
  }).catch(log)
}
</script>
