<template>
  <header>
    <div class="wrap">
      <router-link to="/">
        <div id="px-logo-box" class="px-logo button flick">
          <canvas id="px-logo"></canvas>
          <span class="label beta">beta</span>
        </div>
      </router-link>
      <template v-if="$route.name != 'auth'">
        <div class="right">
          <router-link v-if=" ! user" to="/auth" class="button flick">Login</router-link>
          <!-- -->
          <div v-if="user" class="item-with-submenu">
            <a class="button plus medium flick submenu-trigger" title="Add">
            </a>
            <div v-if="user" class="submenu">
              <div v-on:click="goto('/account/new')" class="button flick">New team</div>
              <div v-on:click="goto('/account/artwork/new')" class="button flick">New artwork</div>
              <div v-on:click="goto('/account/artist/new')" class="button flick">New artist</div>
              <div v-on:click="goto('/account/show/new')" class="button flick">New show</div>
              <div v-on:click="goto('/account/place/new')" class="button flick">New place</div>
            </div>
          </div>
          <!-- -->
          <router-link v-if="user" to="/account/artworks" class="button flick">Collection</router-link>
          <!-- -->
          <div v-if="user" class="item-with-submenu">
            <a class="button flick submenu-trigger">{{ userAccount.title }}</a>
            <div class="submenu">
              <div v-for="account in inactiveAccounts" :key="account['.key']" class="button flick" v-on:click="setAccount(account['.key'])">{{ account.title }}</div>
            </div>
          </div>
          <!-- -->
          <div v-if="user" class="item-with-submenu">
            <a class="button flick submenu-trigger">
              <img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName" class="user-photo">
              <span v-else>{{ user.displayName }}</span>
            </a>
            <div class="submenu">
              <router-link to="/account/artworks" class="button flick">Artworks</router-link>
              <router-link to="/account/artists" class="button flick">Artists</router-link>
              <router-link to="/account/shows" class="button flick">Shows</router-link>
              <router-link to="/account/places" class="button flick">Places</router-link>
              <div class="sub-section">
                <div v-on:click="goto('/account/update')" class="button flick">Team profile</div>
                <div v-on:click="goto('/user/update')" class="button flick">Your profile</div>
                <div v-on:click="goto('/account/invitations')" class="button flick">Invitations</div>
                <a @click="logOut" class="button flick">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </header>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import firebaseApp from '../firebase-app'
  import ScalableCanvasFromImage from '../assets/js/logo'
  import ColorFlicker from '../assets/js/color-flicker'
  import SubmenuHelper from '../helpers/submenu'
  import { log } from '../helper'

  export default {
    mixins: [SubmenuHelper],

    created () {
      this.init()
    },
    computed: {
      ...mapState(['user', 'userAccount', 'accounts']),
      inactiveAccounts () {
        return this.accounts.filter(account => account['.key'] !== this.userAccount['.key'])
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (this.user) {
          this.setRef({
            key: 'accounts',
            ref: firebaseApp.database().ref('users/' + this.user.uid + '/accounts')
          })
        }
      },

      setAccount (accountId) {
        this.closeSubmenus()
        firebaseApp.database().ref('users/' + this.user.uid + '/accountId').set(accountId).catch(log)
      },

      goto (path) {
        this.closeSubmenus()
        this.$router.push(path)
      },

      logOut () {
        firebaseApp.auth().signOut()
        this.$router.push('/')
      },

      setFlicker () {
        this.$nextTick(function () {
          new ColorFlicker().flickElement()
        })
      }
    },

    mounted: function () {
      const logoURL = './static/img/pxflux-logo-8.png'
      const canvasID = 'px-logo'
      new ScalableCanvasFromImage(logoURL, canvasID).setup()
      this.setFlicker()
      this.setupSubmenusWithClass('submenu', 'submenu-trigger')
    },
    updated: function () {
      this.setFlicker()
      this.$nextTick(function () {
        this.setupSubmenusWithClass('submenu', 'submenu-trigger')
      })
    },
    watch: {
      'user' () {
        this.init()
      }
    }
  }
</script>
