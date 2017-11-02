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
        <div class="right">
          <router-link v-if=" ! user" to="/auth" class="button flick">Login</router-link>
          <div v-if="user" class="item-with-submenu">
            <a v-if="user" class="button flick" @click="toggleSubmenu">
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

  export default {
    data () {
      return {
        submenuTimeout: null
      }
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
      },

      /**
       * @param {Event} event
       */
      toggleSubmenu: function (event) {
        const el = event.currentTarget
        const submenu = el.parentNode.getElementsByClassName('submenu')[0]
        if (!submenu) {
          return
        }

        if (submenu.classList.contains('open')) {
          submenu.classList.remove('open')
          clearTimeout(this.submenuTimeout)
        } else {
          submenu.classList.add('open')
          this.submenuTimeout = setTimeout(this.closeSubmenus, 2000)
        }
      },

      closeSubmenus: function () {
        const openSubmenus = this.$el.querySelectorAll('.submenu.open')
        for (let i = 0; i < openSubmenus.length; i++) {
          openSubmenus[i].classList.remove('open')
        }
      },

      setListenersOnSubmenus: function () {
        const _this = this
        const submenus = this.$el.querySelectorAll('.submenu')
        for (let i = 0; i < submenus.length; i++) {
          const submenu = submenus[i]
          submenu.addEventListener('mouseleave', function () {
            clearTimeout(_this.submenuTimeout)
            this.submenuTimeout = setTimeout(_this.closeSubmenus, 1500)
          })
          submenu.addEventListener('mouseover', function () {
            clearTimeout(_this.submenuTimeout)
          })
        }
      }
    },

    mounted: function () {
      const logoURL = './static/img/pxflux-logo-8.png'
      const canvasID = 'px-logo'
      new ScalableCanvasFromImage(logoURL, canvasID).setup()
      this.setFlicker()
      this.setListenersOnSubmenus()
    },
    updated: function () {
      this.setFlicker()
    }
  }
</script>
