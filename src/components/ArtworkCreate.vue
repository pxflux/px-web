<template>
  <main>
    <div class="wrap-content">
      <form v-if="user" @submit.prevent="createArtwork()">
        <input type="text" placeholder="Title" v-model="title">
        <input type="text" placeholder="Authors" v-model="authors">
        <input type="text" placeholder="Url" v-model="url">
        <input type="submit" value="Надо сделать одну форму Update, которая будет уметь, если надо, создавать работу!" class="button flick">
      </form>
    </div>
  </main>
</template>

<script>
  import { mapState } from 'vuex'
  import firebase from '../firebase'

  export default {
    data () {
      return {
        title: '',
        authors: '',
        url: ''
      }
    },
    computed: {
      ...mapState(['user'])
    },
    methods: {
      createArtwork () {
        firebase.database().ref('users/' + this.user.uid + '/artworks').push({
          'title': this.title,
          'author': this.authors,
          'url': this.url
        })
      }
    }
  }
</script>
