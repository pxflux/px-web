<template>
  <main>
    <div v-if="account" class="wrap-content">
      <div class="content">
        <section class="title">
          <editable-string v-model="account.title" :string-class="'h1'"/>
        </section>
        <section class="staff">
          <h2>People</h2>
          <ul class="card-stack">
            <li v-for="person in people" :key="user['.key']" class="card thin">
              <img v-if="person.photoUrl"
                   :src="person.photoUrl"
                   :alt="person.displayName"
                   class="user-photo photo">
              <div class="info">
                <span>{{ person.displayName }}</span>
              </div>
            </li>
          </ul>
          <h2>Invitations</h2>
          <ul>
            <li v-for="invitation in accountInvitations" :key="invitation['.key']">
              {{ invitation.email }}
              <button @click="removeInvitation(invitation['.key'])">Remove</button>
            </li>
          </ul>
          <button @click="showInviteForm = true">Invite people</button>
          <form v-if="showInviteForm" id="form-invite" @submit.prevent="invite">
            <input id="email" type="text" v-model="email" title="Email address" required="required">
            <input type="submit" value="Invite"/>
            <button @click="showInviteForm = false">Cancel</button>
          </form>
        </section>
        <section class="danger-actions">
          <button @click="leaveAccount">Leave team</button>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { ref as dbRef, set, push, remove } from 'firebase/database'
import { db } from '../../firebase-app'
import { log } from '../../helper'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'
import EditableString from '../elements/UI/EditableStringWithSubmit.vue'

const store = useStore()

const title = ref('')
const email = ref('')
const showEditForm = ref(false)
const showInviteForm = ref(false)

const user = computed(() => store.state.user)
const userAccount = computed(() => store.state.userAccount)

const accountPath = computed(() => {
  if (userAccount.value) {
    return 'accounts/' + userAccount.value['.key']
  }
  return null
})

const { data: account } = useFirebaseBinding(accountPath, { isList: false, defaultValue: {} })

const invitationsPath = computed(() => {
  if (userAccount.value) {
    return 'invitations'
  }
  return null
})

const { data: invitations } = useFirebaseBinding(invitationsPath)

const accountInvitations = computed(() => {
  return invitations.value.filter(invitation => invitation.account?.id === userAccount.value?.['.key'])
})

const people = computed(() => {
  const acc = account.value || {}
  return Object.entries(acc.users || {}).map(([ userId, u ]) => ({ ['.key']: userId, ...u }))
})

const updateAccount = () => {
  showEditForm.value = false
  set(dbRef(db, 'accounts/' + userAccount.value['.key'] + '/title'), title.value).catch(log)
}

const invite = () => {
  showInviteForm.value = false
  const invitation = {
    'account': {
      'id': userAccount.value['.key'],
      'title': userAccount.value.title
    },
    'email': email.value
  }
  push(dbRef(db, 'invitations'), invitation).catch(log)
}

const removeInvitation = (invitationId) => {
  remove(dbRef(db, 'invitations/' + invitationId)).catch(log)
}

const leaveAccount = () => {
  showEditForm.value = false
  remove(dbRef(db, 'accounts/' + userAccount.value['.key'] + '/users/' + user.value.uid)).catch(log)
}

watch(account, () => {
  title.value = account.value?.title
})
</script>
<style lang="scss">

  .staff {
    img {
      filter: grayscale(100%);
    }
  }
</style>
