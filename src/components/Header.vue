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
        <router-link to="/artists" class="button flick">Artists</router-link>
        <router-link to="/artworks" class="button flick">Artworks</router-link>
        <router-link to="/shows" class="button flick">Shows</router-link>
        <!-- -->
        <router-link v-if="user" to="/artworks" class="button flick">My Collection</router-link>
        <router-link v-if="user" to="/artwork-create" class="button flick">Add</router-link>
        <!-- -->
        <div class="right">
          <router-link v-if=" ! user" to="/auth" class="button flick">Login</router-link>
          <div v-if="user" class="item-with-submenu">
            <a v-if="user" class="button flick submenu-trigger">
              <img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName" class="user-photo">
              <span v-else>{{ user.displayName }}</span>
            </a>
            <div v-if="user" class="submenu">
              <router-link to="/account/artworks" class="button">Artworks</router-link>
              <router-link to="/account/artists" class="button">Artists</router-link>
              <router-link to="/account/shows" class="button">Shows</router-link>
              <router-link to="/account/places" class="button">Places</router-link>
              <router-link to="/user/update" class="button">Profile</router-link>
              <div class="button">You're logged in as <b>{{ user.displayName }}</b>&nbsp;<a @click="logOut">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </header>
</template>

<script>
  import { mapState } from 'vuex'
  import firebaseApp from '../firebase'
  import ScalableCanvasFromImage from '../assets/js/logo'
  import ColorFlicker from '../assets/js/color-flicker'
  import SubmenuHelper from '../helpers/submenu'

  export default {
    mixins: [ SubmenuHelper ],

    data () {
      return {}
    },

    computed: {
      ...mapState([ 'user' ])
    },

    methods: {
      logOut: () => {
        firebaseApp.auth().signOut()
      },

      setFlicker: function () {
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
    }
  }
</script>
