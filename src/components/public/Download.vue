<template>
  <main>
    <ul>
      <li><a :href="distribute.macos.directUrl">Download for Mac</a></li>
    </ul>
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
