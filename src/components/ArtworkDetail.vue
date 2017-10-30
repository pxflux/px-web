<template>
  <main>
    <div class="wrap-content">
      <template v-if="user">
        <p :title="item.title">{{ item.title }}</p>
        <p :title="item.author">{{ item.author }}</p>
        <p :title="item.url">{{ item.url }}</p>
        <ul>
          <li><router-link :to="'/artworks/' + item['.key']+ '/update'" class="button">Update</router-link></li>
          <li><a v-if="user" @click="removeArtwork" class="button">Remove</a></li>
        </ul>
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
    computed: {
      ...mapState(['user', 'item'])
    },
    methods: {
      init () {
        this.source = firebase.database().ref('users/' + this.user.uid + '/artworks/' + this.$route.params.id)
        this.$store.dispatch('setItemRef', this.source)
      },
      removeArtwork () {
        this.source.remove()
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
