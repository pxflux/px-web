<template>
  <main>
    <div class="wrap-content wrap-forms" v-if="user">
      <div class="content">
        <h1>{{ user.displayName }}</h1>
        <img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName" width="100px" height="100px">
        <h2>Information</h2>
        <form id="form-profile" @submit.prevent="updateProfile">
          <label for="name">Display Name</label>
          <input id="name" type="text" name="name" v-model="displayName" required="required">
          <label for="email">Email</label>
          <input id="email" type="email" name="email" v-model="email" required="required">
          <button class="right">Save Changes</button>
        </form>
        <template v-if="user.email">
          <h2>Password</h2>
          <form id="form-password" @submit.prevent="updatePassword">
            <template v-if="emailFederated">
              <label for="current-password">Current Password</label>
              <input id="current-password" name="current_password" type="password" autocomplete="on" pattern=".{6,}"
                     title="6 characters minimum" autofocus="autofocus" required="required">
              <label for="new_password">New Password</label>
            </template>
            <label v-if=" ! emailFederated" for="new_password">Set Password</label>
            <input id="new_password" name="new_password" type="password" pattern=".{6,}" title="6 characters minimum"
                   required="required" v-model="password">
            <button class="right">Save Changes</button>
          </form>
        </template>
        <h2>Linked Accounts</h2>
        <ul>
          <li v-if="googleFederated">
            <form id="form-disconnect-google" @submit.prevent="disconnectGoogle">
              <p>You are connected to Google.</p>
              <p>You can now sign in to PxFlux using your Google account.</p>
              <p>{{ googleFederated.email }}</p>
              <img v-if="googleFederated.photoURL" :src="googleFederated.photoURL" :alt="googleFederated.displayName"
                   width="48px" height="48px">
              <button v-if="multipleAuth" class="right">Disconnect</button>
            </form>
          </li>
          <li v-if=" ! googleFederated">
            <form id="form-connect-google" @submit.prevent="connectGoogle">
              <button class="right">Connect to Google</button>
            </form>
          </li>
        </ul>
        <h2>Email Preferences</h2>
        <form @submit.prevent="updateEmailPreferences">
          <label for="receive_emails">Receive Emails</label>
          <input type="checkbox" id="receive_emails" name="receive_emails" v-model="receiveEmails">
          <button class="right">Save Changes</button>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth'
import { auth, db } from '../firebase-app'
import { ref as dbRef, get, update } from 'firebase/database'

const store = useStore()
const user = computed(() => store.state.user)

const displayName = ref(user.value?.displayName || '')
const email = ref(user.value?.email || '')
const password = ref('')
const receiveEmails = ref(false)

const googleFederated = computed(() => {
  return user.value?.providerData.find(o => o.providerId === GoogleAuthProvider.PROVIDER_ID)
})

const emailFederated = computed(() => {
  return user.value?.providerData.find(o => o.providerId === EmailAuthProvider.PROVIDER_ID)
})

const multipleAuth = computed(() => {
  return user.value?.providerData.length > 1
})

const updateProfile = () => {
  user.value.updateProfile({
    displayName: displayName.value,
    email: email.value
  }).catch((error) => {
    console.log('Account linking error', error)
  })
}

const updatePassword = () => {
  if (emailFederated.value) {
    user.value.updatePassword(password.value).catch((error) => {
      console.log('Account linking error', error)
    })
  } else {
    const credential = EmailAuthProvider.credential(user.value.email, password.value)
    user.value.linkWithCredential(credential).then((user) => {
      console.log('Account link', user)
      auth.currentUser.reload()
      store.commit('UPDATE_USER', { user: user })
    }, (error) => {
      console.log('Account linking error', error)
    })
  }
  password.value = ''
}

const disconnectGoogle = () => {
  user.value.unlink(GoogleAuthProvider.PROVIDER_ID)
    .then((user) => {
      console.log('Account unlink', user)
      auth.currentUser.reload()
      store.commit('UPDATE_USER', { user: user })
    })
    .catch((error) => {
      console.log('Account unlink error', error)
    })
}

const connectGoogle = () => {
  const provider = new GoogleAuthProvider()
  provider.addScope('https://www.googleapis.com/auth/plus.login')
  user.value.linkWithPopup(provider)
    .then((result) => {
      console.log('Account link', result)
      auth.currentUser.reload()
      store.commit('UPDATE_USER', { user: result.user })
    })
    .catch((error) => {
      console.log('Account linking error', error)
    })
}

const loadEmailPreferences = async () => {
  if (!user.value?.uid) return

  try {
    const preferencesRef = dbRef(db, `users/${user.value.uid}/preferences`)
    const snapshot = await get(preferencesRef)
    const preferences = snapshot.val()
    if (preferences && preferences.receive_emails !== undefined) {
      receiveEmails.value = preferences.receive_emails
    }
  } catch (error) {
    console.error('Error loading email preferences:', error)
  }
}

const updateEmailPreferences = async () => {
  if (!user.value?.uid) return

  try {
    const preferencesRef = dbRef(db, `users/${user.value.uid}/preferences`)
    await update(preferencesRef, {
      receive_emails: receiveEmails.value,
      updated_at: new Date().toISOString()
    })
    console.log('Email preferences updated successfully')
  } catch (error) {
    console.error('Error updating email preferences:', error)
  }
}

onMounted(() => {
  loadEmailPreferences()
})
</script>
