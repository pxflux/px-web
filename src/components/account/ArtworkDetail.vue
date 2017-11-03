<template>
  <main>
    <div v-if="user && accountArtwork" class="wrap-content text-block">
      <template v-if="showForm === false">
        <h1 :title="accountArtwork.title">{{ accountArtwork.title }}</h1>
        <p :title="accountArtwork.author">{{ accountArtwork.author }}</p>
        <p :title="accountArtwork.url">{{ accountArtwork.url }}</p>
        <p :title="accountArtwork.thumbUrl">{{ accountArtwork.thumbUrl }}</p>
      </template>
      <iframe :src="accountArtwork.url"></iframe>
      <form v-if="showForm" id="form-artwork" @submit.prevent="updateArtwork()">
        <input type="text" placeholder="Title" v-model="title">
        <input type="text" placeholder="Authors" v-model="authors">
        <input type="text" placeholder="Url" v-model="url">
        <input type="text" placeholder="Thumbnail Url" v-model="thumbUrl">
        <input type="cancel" value="Cancel" class="button left flick" @click="showForm = false">
        <input type="submit" value="Save" id="submit" class="button left flick">
      </form>
      <ul v-if="showForm === false">
        <li><a @click="showForm = true" class="button">Update</a></li>
        <li><a @click="removeArtwork" class="button">Remove</a></li>
        <li v-if=" ! accountArtwork.publicId"><a @click="publishArtwork" class="button">Publish</a></li>
        <li v-if="accountArtwork.publicId"><a @click="unPublishArtwork" class="button">Un publish</a></li>
      </ul>
    </div>
  </main>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { cloneArtwork } from '../../models/artwork'
  import { log } from '../../helper'
  import firebase from '../../firebase-app'

  export default {
    created () {
      this.init()
    },
    data () {
      return {
        title: '',
        url: '',
        thumbUrl: '',
        author: '',
        showForm: false
      }
    },
    computed: {
      ...mapState(['user', 'accountArtwork'])
    },
    methods: {
      ...mapActions(['setRef']),
      ...mapMutations(['REMOVE_ACCOUNT_ARTWORK']),

      init () {
        this.source = firebase.database().ref('users/' + this.user.uid + '/artworks/' + this.$route.params.id)
        this.setRef({key: 'accountArtwork', ref: this.source})
      },
      updateArtwork () {
        this.showForm = false
        if (this.source) {
          this.source.update({
            'title': this.title,
            'author': this.authors,
            'url': this.url,
            'thumbUrl': this.thumbUrl || ''
          }, log)
          if (this.accountArtwork.publicId) {
            const value = cloneArtwork(this.user.uid, this.$route.params.id, this.accountArtwork)
            firebase.database().ref('artworks/' + this.accountArtwork.publicId).update(value, log)
          }
        }
      },
      publishArtwork () {
        if (this.source && this.accountArtwork.publicId === '') {
          const value = cloneArtwork(this.user.uid, this.$route.params.id, this.accountArtwork)
          const id = firebase.database().ref('artworks').push(value, log).key
          this.source.update({
            'publicId': id
          })
        }
      },
      unPublishArtwork () {
        if (this.source && this.accountArtwork.publicId !== '') {
          firebase.database().ref('artworks/' + this.accountArtwork.publicId).remove(log)
          this.source.update({'publicId': ''}, log)
        }
      },
      removeArtwork () {
        if (this.source) {
          if (this.accountArtwork.publicId) {
            firebase.database().ref('artworks/' + this.accountArtwork.publicId).remove(log)
          }
          this.source.remove(log)
          this.REMOVE_ACCOUNT_ARTWORK()
          this.$router.push('/account/artworks')
        }
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'user' () {
        this.init()
      },
      'accountArtwork' () {
        this.title = this.accountArtwork.title
        this.authors = this.accountArtwork.author
        this.url = this.accountArtwork.url
        this.thumbUrl = this.accountArtwork.thumbUrl
      }
    }
  }
</script>
