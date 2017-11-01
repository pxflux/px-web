<template>
  <header>
    <div class="wrap">
      <router-link to="/">
        <div id="px-logo-box" class="px-logo button flick">
          <canvas id="px-logo"></canvas>
          <span class="label beta">beta</span>
        </div>
      </router-link>
      <router-link to="/artists" class="button flick">Artists</router-link>
      <router-link to="/artworks" class="button flick">Artworks</router-link>
      <router-link to="/shows" class="button flick">Shows</router-link>
      <router-link to="/galleries" class="button flick">Galleries</router-link>
      <router-link to="/museums" class="button flick">Museums</router-link>
      <router-link to="/fairs" class="button flick">Fairs</router-link>
      <router-link to="/auctions" class="button flick">Auctions</router-link>
      <router-link v-if=" ! user" to="/auth" class="button flick">Login</router-link>
      <a v-if="user" @click="logOut" class="button flick">Logout</a>
      <router-link v-if="user" to="/artworks" class="button flick">My Collection</router-link>
      <router-link v-if="user" to="/artwork-create" class="button flick">Add</router-link>
      <router-link v-if="user" to="/user/update" class="button flick">{{ user.displayName }}</router-link>
    </div>
  </header>
</template>

<script>
  import { mapState } from 'vuex'
  import firebaseApp from '../firebase'
  import ScalableCanvasFromImage from '../assets/js/logo'
  import ColorFlicker from '../assets/js/color-flicker'

  export default {
    data () {
      return {}
    },
    computed: {
      ...mapState(['user'])
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
    },
    updated: function () {
      this.setFlicker()
    }
  }
</script>
