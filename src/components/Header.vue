<template>
  <header class="main">
    <div class="wrap">
      <router-link to="/">
        <div id="px-logo-box" class="px-logo">
          <canvas id="px-logo"></canvas>
          <span class="label beta"></span>
        </div>
      </router-link>
      <template v-if="!['player-client', 'auth'].includes($route.name)">
        <div class="right">
          <router-link to="/download" class="button">Download</router-link>
          <router-link v-if=" ! user" to="/auth" class="button">Login</router-link>
          <!-- -->
          <div v-if="user" class="item-with-submenu">
            <a class="button submenu-trigger" title="Add">
              <div class="icon plus medium"></div>
            </a>
            <div v-if="user" class="submenu">
              <div @click="goto('/account/player/new')" class="button">Add player</div>
              <div @click="goto('/account/artwork/new')" class="button">New artwork</div>
            </div>
          </div>
          <!-- -->
          <router-link v-if="user" to="/artworks" class="button">
            <img src="/static/img/collection-v3@2x.png" width="24" height="24" class="center">
          </router-link>
          <!-- -->
          <div v-if="user" class="item-with-submenu">
            <a class="button submenu-trigger">{{ userAccount.title }}</a>
            <div class="submenu">
              <div v-for="account in inactiveAccounts" :key="account['.key']" class="button"
                   @click="setAccount(account['.key'])">{{ account.title }}
              </div>
            </div>
          </div>
          <!-- -->
          <div v-if="user" class="item-with-submenu">
            <a class="button submenu-trigger">
              <img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName" class="user-photo">
              <span v-else>{{ user.displayName }}</span>
            </a>
            <div class="submenu">
              <router-link to="/artworks" class="button">Artworks</router-link>
              <router-link to="/account/artists" class="button">Artists</router-link>
              <div class="sub-section">
                <router-link to="/account/players" class="button">Players</router-link>
                <div @click="goto('/account/update')" class="button">Team profile</div>
                <div @click="goto('/user/update')" class="button">Your profile</div>
                <div @click="goto('/account/invitations')" class="button">Invitations</div>
                <a @click="logOut" class="button">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated, watch, nextTick, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { firebaseApp, auth } from '../firebase-app'
import { signOut } from 'firebase/auth'
import { getDatabase, ref as dbRef, set } from 'firebase/database'
import ScalableCanvasFromImage from '../assets/js/logo'
import ColorFlicker from '../assets/js/color-flicker'
import { useSubmenu } from '../composables/useSubmenu'
import { log } from '../helper'

const store = useStore()
const router = useRouter()
const instance = getCurrentInstance()
const { closeSubmenus, setupSubmenusWithClass } = useSubmenu()

const accounts = ref([])

const user = computed(() => store.state.user)
const userAccount = computed(() => store.state.userAccount)

const inactiveAccounts = computed(() => {
  return accounts.value.filter(account => account['.key'] !== userAccount.value['.key'])
})

const init = () => {
  if (user.value) {
    const db = getDatabase(firebaseApp)
    instance.proxy.$databaseBind('accounts', dbRef(db, 'users/' + user.value.uid + '/accounts'))
  }
}

const setAccount = (accountId) => {
  closeSubmenus()
  const db = getDatabase(firebaseApp)
  const accountRef = dbRef(db, 'users/' + user.value.uid + '/accountId')
  set(accountRef, accountId).catch(log)
}

const goto = (path) => {
  closeSubmenus()
  router.push(path)
}

const logOut = () => {
  signOut(auth)
  router.push('/')
}

const setFlicker = () => {
  nextTick(() => {
    new ColorFlicker().flickElement()
  })
}

const getLogoURL = () => {
  const el = document.getElementById('px-logo-box')
  const style = window.getComputedStyle(el)
  return style.backgroundImage.slice(4, -1).replace(/"/g, '')
}

onMounted(() => {
  init()

  let logoURL = getLogoURL()
  const canvasID = 'px-logo'
  const logo = new ScalableCanvasFromImage(logoURL, canvasID, { fillParent: false })
  logo.setup()
  setFlicker()
  setupSubmenusWithClass('submenu', 'submenu-trigger')

  window.addEventListener('resize', () => {
    logo.setup(getLogoURL())
  })
})

onUpdated(() => {
  setFlicker()
  nextTick(() => {
    setupSubmenusWithClass('submenu', 'submenu-trigger')
  })
})

watch(user, () => {
  init()
})
</script>
