<template>
  <main>
    <div v-if="collector" class="wrap-content text-block">
      <h1>{{ collector.title }}</h1>
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
      ...mapState(['collector'])
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.setRef({key: 'collector', ref: firebase.database().ref('collectors/' + this.$route.params.id)})
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
