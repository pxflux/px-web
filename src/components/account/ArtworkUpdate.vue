<template>
  <main>
    <div v-if="userAccount" class="wrap-content text-block">
      <router-link to="/account/artworks/">Artworks</router-link>
      <template v-if="! isNew">
        &gt;
        <router-link :to="'/account/artwork/' + artworkId">{{ accountArtwork.title }}</router-link>
      </template>
      <image-upload :imageUrl="image.displayUrl" @input-file="setImageFile"
                    @remove-image="setImageRemoved"></image-upload>
      <form id="form-artwork">
        <input type="text" v-model.trim="title" title="Artwork title" required="required">

        <select v-model="selectedArtistIds" multiple required>
          <option v-for="artist in artists" v-bind:value="artist['.key']">{{ artist.fullName }}</option>
        </select>

        <select v-model="selectedShowIds" multiple>
          <option v-for="show in shows" v-bind:value="show['.key']">{{ show.title }}</option>
        </select>
        <button v-show="selectedShowIds.length > 0" @click="selectedShowIds = []">Clear</button>

        <router-link v-if="isNew" to="/account/artworks">Cancel</router-link>
        <router-link v-if="! isNew" :to="'/account/artwork/' + artworkId">Cancel</router-link>
        <button v-if="isNew" @click.prevent="submitArtwork">Create</button>
        <button v-if="! isNew" @click.prevent="submitArtwork">Update</button>
      </form>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { log } from '../../helper'
  import firebase, { store } from '../../firebase-app'

  export default {
    props: ['isNew'],
    created () {
      this.init()
    },
    computed: {
      ...mapState(['userAccount', 'accountArtwork', 'artists', 'shows']),

      accountId () {
        if (!this.userAccount) {
          return null
        }
        return this.userAccount['.key']
      },
      artworkId () {
        return this.$route.params.id
      },
      image () {
        return this.accountArtwork && this.accountArtwork.image ? this.accountArtwork.image : {
          displayUrl: null,
          storageUri: null
        }
      }
    },
    data () {
      return {
        imageFile: null,
        imageRemoved: false,
        title: '',
        selectedArtistIds: [],
        selectedShowIds: []
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (!this.isNew && this.accountId) {
          this.source = firebase.database().ref('accounts/' + this.accountId + '/artworks/' + this.artworkId)
          this.setRef({key: 'accountArtwork', ref: this.source})
        } else {
          this.source = null
        }
        this.setRef({key: 'artists', ref: firebase.database().ref('artists')})
        this.setRef({key: 'shows', ref: firebase.database().ref('shows')})
      },

      setImageFile (file) {
        this.imageFile = file
      },
      setImageRemoved (flag) {
        this.imageRemoved = flag
      },

      submitArtwork () {
        if (!this.accountId) {
          return
        }
        const artwork = {
          title: this.title,
          artists: {},
          shows: {}
        }
        this.artists.filter(artist => this.selectedArtistIds.includes(artist['.key'])).forEach(artist => {
          const data = {fullName: artist.fullName}
          if (artist.photoUrl) {
            data.photoUrl = artist.photoUrl
          }
          artwork.artists[artist['.key']] = data
        })
        this.shows.filter(show => this.selectedShowIds.includes(show['.key'])).forEach(show => {
          artwork.shows[show['.key']] = {title: show.title}
        })
        const path = '/accounts/' + this.accountId + '/artworks'
        store(this.artworkId, artwork, path, this.imageRemoved, this.imageFile).then(function (ref) {
          this.$router.push('/account/artwork/' + ref.key)
        }.bind(this)).catch(log())
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'userAccount' () {
        this.init()
      },
      'accountArtwork' () {
        this.title = this.accountArtwork.title
        this.selectedArtistIds = Object.keys(this.accountArtwork.artists || {})
        this.selectedShowIds = Object.keys(this.accountArtwork.shows || {})
      }
    }
  }
</script>
