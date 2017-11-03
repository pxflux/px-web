<template>
  <main>
    <div v-if="curator" class="wrap-content text-block">
      <h1>{{ curator.title }}</h1>
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
      ...mapState(['curator'])
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.setRef({key: 'curator', ref: firebase.database().ref('curators/' + this.$route.params.id)})
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
