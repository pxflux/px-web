<template>
  <main>
    <div v-if="userAccount" class="wrap-content wrap-forms">
      <p v-if="! isNew">
        <router-link to="/account/artworks/">Artworks</router-link>
        •
        <router-link :to="'/account/artwork/' + artworkId">{{ title }}</router-link>
      </p>
      <form id="form-artwork" v-on:submit.prevent>
        <remote-control-editor v-bind:controls="selectedControls" v-on:update="setControls"/>
        <div class="editor-section">
          <label for="title">Title</label>
          <h1>
            <input id="title" type="text" v-model.trim="title" required="required">
          </h1>
          <label for="url">Work URL</label>
          <input id="url" type="text" v-model.trim="url" required="required">
        </div>
        <div class="editor-section">
          <label for="image">Image</label>
          <image-upload id="image" :imageUrl="artwork.thumbnail.displayUrl" @input-file="setImageFile"
                        @remove-image="setImageRemoved"></image-upload>
        </div>
        <div class="editor-section">
          <div>Video Preview</div>
          <attachment :attachmentData="preview" @changed="updatePreview"/>
        </div>
        <div class="editor-section">
          <label for="description">Description</label>
          <textarea id="description" v-model.trim="description"></textarea>
          <br>
          <label for="year">Year</label>
          <input id="year" type="text" v-model.trim="year" required="required">
        </div>
        <div class="editor-section">
          <label for="artistIds">Artists</label>
          <select id="artistIds" v-model="selectedArtistIds" multiple required>
            <option v-for="artist in artists" v-bind:value="artist['.key']">{{ artist.fullName }}</option>
          </select>
        </div>

        <div class="editor-section">
          <router-link v-if="isNew" to="/account/artworks">Cancel</router-link>
          <router-link v-if="! isNew" :to="'/account/artwork/' + artworkId">Cancel</router-link>
          <button v-if="isNew" @click="submitArtwork">Create</button>
          <button v-if="! isNew" @click="submitArtwork">Save</button>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { log } from '../../helper'
  import firebase, { store } from '../../firebase-app'
  import ImageUpload from '../elements/ImageUpload'
  import RemoteControlEditor from '../elements/RemoteControlEditor'
  import Attachment from '../elements/VideoAttachment'
  import { Artwork } from '../../data/Artwork'
  import { VideoAttachment } from '../../data/VideoAttachment'

  export default {
    props: ['isNew'],
    components: {ImageUpload, Attachment, RemoteControlEditor},
    created () {
      this.init()
    },
    computed: {
      ...mapState(['userAccount', 'accountArtwork', 'artists']),

      accountId () {
        if (!this.userAccount) {
          return null
        }
        return this.userAccount['.key']
      },
      artworkId () {
        return this.$route.params.id
      },
      published () {
        return this.accountArtwork && this.accountArtwork.published ? this.accountArtwork.published : false
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
        artwork: Artwork.empty(),
        imageFile: null,
        imageRemoved: false,
        url: '',
        title: '',
        description: '',
        year: '',
        preview: VideoAttachment.empty(),
        selectedArtistIds: [],
        selectedControls: []
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
      },

      setImageFile (file) {
        this.imageFile = file
      },
      setImageRemoved (flag) {
        this.imageRemoved = flag
      },
      /**
       * @param {VideoAttachment} videoAttachment
       */
      updatePreview (videoAttachment) {
        this.preview = videoAttachment
      },
      /**
       * @param {Control[]} controls
       */
      setControls (controls) {
        this.selectedControls = controls
      },
      submitArtwork () {
        if (!this.accountId) {
          return
        }
        const artwork = Artwork.fromJson(this.accountArtwork)
        artwork.url = this.url
        artwork.title = this.title
        artwork.description = this.description
        artwork.year = this.year
        artwork.preview = this.preview
        this.artists.filter(artist => this.selectedArtistIds.includes(artist['.key'])).forEach(artist => {
          const data = {fullName: artist.fullName}
          if (artist.photoUrl) {
            data.photoUrl = artist.photoUrl
          }
          artwork.artists[artist['.key']] = data
        })
        artwork.controls = this.selectedControls
        store(this.accountId, this.artworkId, 'artworks', artwork, this.imageRemoved, this.imageFile).then(function (ref) {
          this.$router.push('/account/artwork/' + ref.key)
        }.bind(this)).catch(log())
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'artists' () {
        console.log('this.artists: >>>>>>')
        console.log(this.artists)
      },
      'userAccount' () {
        this.init()
      },
      'accountArtwork' () {
        console.log('this.accountArtwork: >>>>>>')
        console.log(this.accountArtwork)
        const item = this.accountArtwork || {}

        // Backward compatibility
        if (item.url) this.artwork.source.url = item.url
        if (item.image) this.artwork.thumbnail.castFrom(item.image)

        this.artwork = Artwork.fromJson(this.accountArtwork) || Artwork.empty()
        const artwork = Artwork.fromJson(this.accountArtwork)
        if (artwork) {
          this.url = artwork.source.url
          this.title = artwork.title
          this.description = artwork.description
          this.year = artwork.year
          this.preview = artwork.preview
          this.selectedArtistIds = artwork.artists.map(artist => artist.id)
          this.selectedControls = artwork.controls
        }
      }
    }
  }
</script>
