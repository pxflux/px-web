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
          <router-link to="/artworks" class="button">
            <img src="/static/img/collection-v3@2x.png" width="24" height="24" class="center">
          </router-link>
          <!-- -->
          <div v-if="user && userAccount" class="item-with-submenu">
            <a class="button submenu-trigger">{{ userAccount.title }}</a>
            <div class="submenu">
              <div v-for="account in inactiveAccounts" :key="account['.key']" class="button"
                @click="setAccount(account['.key'])">
                {{ account.title }}
              </div>
            </div>
          </div>
          <!-- -->
          <router-link v-if="user && !userAccount" to="/account/new" class="button">Create Account</router-link>
          <!-- -->
          <div v-if="user" class="item-with-submenu">
            <a class="button submenu-trigger">
              <img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName" class="user-photo">
              <span v-else>{{ user.displayName || user.email }}</span>
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
          <template v-if="!user">
            <router-link to="/download" class="button">Download</router-link>
            <router-link v-if="!user" to="/auth" class="button">Login</router-link>
          </template>
        </div>
      </template>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, onUpdated, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { db, auth } from '../firebase-app'
import { signOut } from 'firebase/auth'
import { ref as dbRef, set } from 'firebase/database'
import ScalableCanvasFromImage from '../assets/js/logo'
import ColorFlicker from '../assets/js/color-flicker'
import { useSubmenu } from '../composables/useSubmenu'
import { log } from '../helper'
import { useFirebaseBinding } from '../composables/useFirebaseBinding'

const store = useStore()
const router = useRouter()
const { closeSubmenus, setupSubmenusWithClass } = useSubmenu()

const user = computed(() => store.state.user)
const userAccount = computed(() => store.state.userAccount)

const accountsPath = computed(() => {
  if (user.value?.uid) {
    return 'users/' + user.value.uid + '/accounts'
  }
  return null
})

const { data: accounts } = useFirebaseBinding(accountsPath, { isList: false, defaultValue: {} })

const inactiveAccounts = computed(() => {
  const accountsArray = Array.isArray(accounts.value) ? accounts.value : Object.values(accounts.value)
  return accountsArray.filter(account => account && account['.key'] !== userAccount.value?.['.key'])
})

const setAccount = (accountId) => {
  closeSubmenus()
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
  if (!el) return ''
  const style = window.getComputedStyle(el)
  return style.backgroundImage.slice(4, -1).replace(/"/g, '')
}

onMounted(() => {
  nextTick(() => {
    try {
      let logoURL = getLogoURL()
      const canvasID = 'px-logo'
      const canvas = document.getElementById(canvasID)
      if (canvas && logoURL) {
        const logo = new ScalableCanvasFromImage(logoURL, canvasID, { fillParent: false })
        logo.setup()
        window.addEventListener('resize', () => {
          logo.setup(getLogoURL())
        })
      }
    } catch (error) {
      log('Error setting up logo:', error)
    }
    setFlicker()
    setupSubmenusWithClass('submenu', 'submenu-trigger')
  })
})

onUpdated(() => {
  setFlicker()
  nextTick(() => {
    setupSubmenusWithClass('submenu', 'submenu-trigger')
  })
})
</script>
