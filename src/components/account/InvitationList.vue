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
import { computed } from 'vue'
import { ref as dbRef, set, remove } from 'firebase/database'
import { db } from '../../firebase-app'
import { log } from '../../helper'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'
import { useAuth } from '../../composables/useAuth'

const { user } = useAuth()

const path = computed(() => {
  if (user.value) {
    return 'invitations'
  }
  return null
})

const { data: invitations } = useFirebaseBinding(path)

const userInvitations = computed(() => {
  return invitations.value.filter(invitation => invitation.account)
})

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
</script>
