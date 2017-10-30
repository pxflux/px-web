<template>
  <main>
    <div class="wrap-content">
      <template v-if="user">
        <form @submit.prevent="updateArtwork()">
          <input type="text" placeholder="Title" v-model="title">
          <input type="text" placeholder="Authors" v-model="authors">
          <input type="text" placeholder="Url" v-model="url">
          <input type="submit" value="Save">
        </form>
      </template>
      <template v-else-if="user === false">
        <h1>Artwork not found.</h1>
      </template>
    </div>
  </main>
</template>

<script>
  import { mapState } from 'vuex'
  import firebase from '../firebase'

  export default {
    created () {
      this.init()
    },
    data () {
      return {
        title: '',
        authors: '',
        url: ''
      }
    },
    computed: {
      ...mapState(['user', 'item'])
    },
    methods: {
      init () {
        this.source = firebase.database().ref('users/' + this.user.uid + '/artworks/' + this.$route.params.id)
        this.$store.dispatch('setItemRef', this.source)
      },
      updateArtwork () {
        this.source.update({
          'title': this.title,
          'author': this.authors,
          'url': this.url
        })
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'item' () {
        this.title = this.item.title
        this.authors = this.item.author
        this.url = this.item.url
      }
    }
  }
</script>
