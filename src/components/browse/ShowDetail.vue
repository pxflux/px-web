<template>
  <main>
    <div v-if="show" class="wrap-content text-block">
      <h1>{{ show.title }}</h1>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import firebase from '../../firebase'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['show'])
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.setRef({key: 'show', ref: firebase.database().ref('shows/' + this.$route.params.id)})
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
