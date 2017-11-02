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
            <a v-if="user" class="button flick" @click="toggleSubmenu">
              <img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName" class="user-photo">
              <span v-else>{{ user.displayName }}</span>
            </a>
            <div class="submenu">
              <router-link v-if="user" to="/user/update" class="button flick">Account</router-link>
              <a v-if="user" @click="logOut" class="button flick">Logout</a>
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
      },

      /**
       * @param {Event} event
       */
      toggleSubmenu: function (event) {
        const el = event.currentTarget
        const submenu = el.parentNode.getElementsByClassName('submenu')[ 0 ]
        if (!submenu) {
          return
        }

        if (submenu.classList.contains('open')) {
          submenu.classList.remove('open')
        } else {
          submenu.classList.add('open')
          this.submenuTimeout = setTimeout(this.closeSubmenus, 2000)
        }
      },

      closeSubmenus: function () {
        const openSubmenus = this.$el.querySelectorAll('.submenu.open')
        for (let i = 0; i < openSubmenus.length; i++) {
          openSubmenus[ i ].classList.remove('open')
        }
      },

      setListenersOnSubmenus: function () {
        const _this = this
        const submenus = this.$el.querySelectorAll('.submenu')
        for (let i = 0; i < submenus.length; i++) {
          const submenu = submenus[ i ]
          submenu.addEventListener('mouseleave', function () {
            setTimeout(_this.closeSubmenus, 1500)
          })
          submenu.addEventListener('mouseenter', function () {
            clearTimeout(_this.submenuTimeout)
          })
        }
        // const buttons = this.$el.querySelectorAll('.button')
        // for (let i = 0; i < buttons.length; i++) {
        //   buttons[ i ].addEventListener('mouseleave', this.closeSubmenus)
        // }
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
