<template>
  <main>
    <div class="wrap-content">
      <div class="content">
        <h1>Download</h1>
        <div class="card-stack">
          <a :href="distribute.macos.directUrl" class="card">
            <div class="photo">
              <img class="small player-ico" src="/static/img/pxflux-player-icon-v5-128px.png" alt="pxflux-player-icon">
            </div>
            <div class="info">
              <span class="h3">pxPlayer</span> v.0.01 alpha<br>
              for Mac OS (10.12)
            </div>
          </a>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import firebase from '@/firebase-app'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['config']),

      distribute () {
        if (this.config) {
          return this.config.distribute
        }
        return {macos: {}}
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.setRef({key: 'config', ref: firebase.database().ref('config')})
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
