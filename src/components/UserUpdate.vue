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
            <label v-if="!emailFederated" for="new_password">Set Password</label>
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
          <li v-if="!googleFederated">
            <form id="form-connect-google" @submit.prevent="connectGoogle">
              <button class="right">Connect to Google</button>
            </form>
          </li>
        </ul>
        <h2>Email Preferences</h2>
        <form>
          <label for="receive_emails">Receive Emails</label>
          <input type="checkbox" id="receive_emails" name="receive_emails" checked="checked">
          <button class="right">Save Changes</button>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth'
import { auth } from '../firebase-app'
import { log } from '../helper'

const store = useStore()
const user = computed(() => store.state.user)

const displayName = ref(user.value?.displayName || '')
const email = ref(user.value?.email || '')
const password = ref('')

const googleFederated = computed(() => user.value?.providerData.find(o => o.providerId === GoogleAuthProvider.PROVIDER_ID))
const emailFederated = computed(() => user.value?.providerData.find(o => o.providerId === EmailAuthProvider.PROVIDER_ID))
const multipleAuth = computed(() => user.value?.providerData.length > 1)

const updateProfile = () => {
  user.value.updateProfile({ displayName: displayName.value, email: email.value }).catch(log)
}

const updatePassword = () => {
  if (emailFederated.value) {
    user.value.updatePassword(password.value).catch(log)
  } else {
    const credential = EmailAuthProvider.credential(user.value.email, password.value)
    user.value.linkWithCredential(credential).then((user) => {
      console.log('Account link', user)
      auth.currentUser.reload()
      store.commit('UPDATE_USER', { user: user })
    }).catch(log)
  }
  password.value = ''
}

const disconnectGoogle = () => {
  user.value.unlink(GoogleAuthProvider.PROVIDER_ID).then((user) => {
    console.log('Account unlink', user)
    auth.currentUser.reload()
    store.commit('UPDATE_USER', { user: user })
  }).catch(log)
}

const connectGoogle = () => {
  const provider = new GoogleAuthProvider()
  provider.addScope('https://www.googleapis.com/auth/plus.login')
  user.value.linkWithPopup(provider).then((result) => {
    console.log('Account link', result)
    auth.currentUser.reload()
    store.commit('UPDATE_USER', { user: result.user })
  }).catch(log)
}
</script>
