<template>
  <main>
    <div v-if="user && accountArtwork" class="wrap-content text-block">
      <template v-if="showForm === false">
        <h1 :title="accountArtwork.title">{{ accountArtwork.title }}</h1>
        <p :title="accountArtwork.url">{{ accountArtwork.url }}</p>
        <p :title="accountArtwork.thumbUrl">{{ accountArtwork.thumbUrl }}</p>
      </template>
      <form v-if="showForm" id="form-artwork" @submit.prevent="updateArtwork()">
        <input type="text" placeholder="Title" v-model="title"/>
        <input type="text" placeholder="Url" v-model="url"/>
        <input type="text" placeholder="Thumbnail Url" v-model="thumbUrl"/>
        <input type="button" value="Cancel" @click="showForm = false"/>
        <input type="submit" value="Save"/>
      </form>
      <h2>Artists</h2>
      <ul v-if="accountArtwork.artists">
        <li v-for="(index, artist) in accountArtwork.artists" :key="index">
          {{ artist }}
          <a @click="removeArtist(artist)" class="button">X</a>
        </li>
      </ul>
      <form id="form-artwork-artists" @submit.prevent="addArtist()">
        <select v-model="artistId">
          <option v-for="artist in artists" v-bind:value="artist['.key']">{{ artist.fullName }}</option>
        </select>
        <input type="button" value="Cancel" @click="showForm = false">
        <input type="submit" value="Save">
      </form>
      <ul v-if="showForm === false">
        <li><a @click="showForm = true" class="button">Update</a></li>
        <li><a @click="removeArtwork" class="button">Remove</a></li>
        <li v-if=" ! accountArtwork.publicId"><a @click="publishArtwork" class="button">Publish</a></li>
        <li v-if="accountArtwork.publicId"><a @click="unPublishArtwork" class="button">Un publish</a></li>
      </ul>

      <iframe :src="accountArtwork.url"></iframe>
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
        artistId: '',
        showForm: false
      }
    },
    computed: {
      ...mapState(['user', 'accountArtwork', 'artists'])
    },
    methods: {
      ...mapActions(['setRef']),
      ...mapMutations(['REMOVE_ACCOUNT_ARTWORK']),

      init () {
        if (this.user.uid) {
          this.source = firebase.database().ref('users/' + this.user.uid + '/artworks/' + this.$route.params.id)
          this.setRef({key: 'accountArtwork', ref: this.source})
          this.setRef({key: 'artists', ref: firebase.database().ref('artists')})
        } else {
          this.source = null
          this.REMOVE_ACCOUNT_ARTWORK()
        }
      },
      updateArtwork () {
        this.showForm = false
        if (this.source) {
          this.source.update({
            'title': this.title,
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
      },
      addArtist () {
        if (this.source && this.artistId) {
          const data = this.accountArtwork.artists ? this.accountArtwork.artists : {}
          data[this.artistId] = true
          this.source.update({'artists': data}, log)
          if (this.accountArtwork.publicId) {
            const value = cloneArtwork(this.user.uid, this.$route.params.id, this.accountArtwork)
            firebase.database().ref('artworks/' + this.accountArtwork.publicId).update(value, log)
          }
        }
      },
      removeArtist (artist) {
        if (this.source && this.accountArtwork.artists) {
          const data = this.accountArtwork.artists
          delete data[artist]
          this.source.update({'artists': data}, log)
          if (this.accountArtwork.publicId) {
            const value = cloneArtwork(this.user.uid, this.$route.params.id, this.accountArtwork)
            firebase.database().ref('artworks/' + this.accountArtwork.publicId).update(value, log)
          }
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
        this.url = this.accountArtwork.url
        this.thumbUrl = this.accountArtwork.thumbUrl
      }
    }
  }
</script>
