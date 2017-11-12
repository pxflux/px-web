<template>
  <main>
    <div v-if="user && account" class="wrap-content text-block">
      <h1>{{ account.title }}</h1>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import firebase from '../../firebase-app'
  
  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['user', 'account'])
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (this.user.uid) {
          this.source = firebase.database().ref('users/' + this.user.uid + '/accounts/' + this.$route.params.id)
          this.setRef({key: 'account', ref: this.source})
        } else {
          this.source = null
        }
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'user' () {
        this.init()
      }
    }
  }
</script>
