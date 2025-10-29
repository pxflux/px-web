<template>
  <main>
    <div class="wrap-content">
      <div class="content">
        <ul>
          <li v-for="invitation in userInvitations" :key="invitation['.key']">
            {{ invitation.account.title }}
            <button @click="acceptInvitation(invitation['.key'])" class="button">Accept</button>
            <button @click="rejectInvitation(invitation['.key'])" class="button">Reject</button>
          </li>
        </ul>
        <span class="nothing-found" v-if="userInvitations.length == 0">No invitations.</span>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref as dbRef, set, remove } from 'firebase/database'
import { db } from '../../firebase-app'
import { log } from '../../helper'

const store = useStore()
const route = useRoute()

const user = computed(() => store.state.user)
const userInvitations = computed(() => store.getters.userInvitations)

const init = () => {
  if (user.value) {
    store.dispatch('setRef', {
      key: 'invitations',
      ref: dbRef(db, 'invitations')
    })
  }
}

const acceptInvitation = (invitationId) => {
  const data = {
    'uid': user.value.uid,
    'displayName': user.value.displayName,
    'photoUrl': user.value.photoURL
  }
  set(dbRef(db, 'invitations/' + invitationId + '/user'), data).catch(log)
}

const rejectInvitation = (invitationId) => {
  remove(dbRef(db, 'invitations/' + invitationId)).catch(log)
}

onMounted(() => {
  init()
})

watch(() => route.path, () => {
  init()
})

watch(user, () => {
  init()
})
</script>
