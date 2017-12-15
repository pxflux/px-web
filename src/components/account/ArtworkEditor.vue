<template>
  <main>
    <div v-if="userAccount" class="wrap-content wrap-forms">
      <p v-if="! isNew">
        <router-link to="/account/artworks/">Artworks</router-link>
        •
        <router-link :to="'/account/artwork/' + artworkId">{{ title }}</router-link>
      </p>
      <form id="form-artwork" v-on:submit.prevent>
        <remote-control-editor v-bind:controls="selectedControls" v-on:update="setControls"></remote-control-editor>
        <div class="editor-section">
          <label for="title">Title</label>
          <h1>
            <input id="title" type="text" v-model.trim="artwork.title" required="required">
          </h1>
          <label for="url">Work URL</label>
          <input id="url" type="text" v-model.trim="artwork.source.url" required="required">
        </div>
        <div class="editor-section">
          <label for="image">Image</label>
          <image-upload id="image" :imageUrl="artwork.thumbnail.displayUrl" @input-file="setImageFile"
                        @remove-image="setImageRemoved"></image-upload>
        </div>
        <div class="editor-section">
          <div>Video Preview</div>
          <attachment v-model="artwork.preview" :attachmentData="artwork.preview"
                      @changed="updatePreview">
          </attachment>
        </div>
        <div class="editor-section">
          <label for="description">Description</label>
          <textarea id="description" v-model.trim="artwork.description"></textarea>
          <br>
          <label for="year">Year</label>
          <input id="year" type="text" v-model.trim="artwork.year" required="required">
        </div>
        <div class="editor-section">
          <label for="artistIds">Artists</label>
          <select id="artistIds" v-model="selectedArtistIds" multiple required>
            <option v-for="artist in artists" v-bind:value="artist['.key']">{{ artist.fullName }}</option>
          </select>
        </div>
        <div class="editor-section">
          <label for="showIds">Shows</label>
          <select id="showIds" v-model="selectedShowIds" multiple>
            <option v-for="show in shows" v-bind:value="show['.key']">{{ show.title }}</option>
          </select>
          <button v-show="selectedShowIds.length > 0" @click="selectedShowIds = []">Clear</button>
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
  import { mapState, mapActions } from 'vuex'
  import { log } from '../../helper'
  import firebase, { store } from '../../firebase-app'
  import ImageUpload from '../elements/ImageUpload'
  import RemoteControlEditor from '../elements/RemoteControlEditor'
  import Attachment from './data-type-editors/Attachment'
  import {ArtworkDataStruct} from '../../models/artwork'

  export default {
    props: ['isNew'],
    components: {
      'image-upload': ImageUpload,
      'attachment': Attachment,
      RemoteControlEditor
    },
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
        artwork: new ArtworkDataStruct(),
        imageFile: null,
        imageRemoved: false,
        url: '',
        title: '',
        description: '',
        year: '',
        preview: { type: 'video' },
        vimeoBasic: false,
        selectedArtistIds: [],
        selectedShowIds: [],
        selectedControls: []
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (!this.isNew && this.accountId) {
          this.source = firebase.database().ref('accounts/' + this.accountId + '/artworks/' + this.artworkId)
          this.setRef({ key: 'accountArtwork', ref: this.source })
        } else {
          this.source = null
        }
        this.setRef({ key: 'artists', ref: firebase.database().ref('artists') })
        this.setRef({ key: 'shows', ref: firebase.database().ref('shows') })
      },

      setImageFile (file) {
        this.imageFile = file
      },
      setImageRemoved (flag) {
        this.imageRemoved = flag
      },
      updatePreview (previewData) {
        this.artwork.preview = previewData
        console.log('this.artwork.preview >>>>')
        console.log(this.artwork.preview)
      },
      setControls (value) {
        this.selectedControls = value
      },

      submitArtwork () {
        if (!this.accountId) {
          return
        }
        const artwork = this.artwork
        this.artists.filter(artist => this.selectedArtistIds.includes(artist['.key'])).forEach(artist => {
          const data = { fullName: artist.fullName }
          if (artist.photoUrl) {
            data.photoUrl = artist.photoUrl
          }
          artwork.artists[artist['.key']] = data
        })
        this.shows.filter(show => this.selectedShowIds.includes(show['.key'])).forEach(show => {
          artwork.shows[show['.key']] = { title: show.title }
        })
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
        this.artwork.castFrom(item)
        // Backward compatibility
        if (item.url) this.artwork.source.url = item.url
        if (item.image) this.artwork.thumbnail.castFrom(item.image)
        console.log('this.artwork: >>>>>>')
        console.log(this.artwork)
        this.url = item.url
        this.title = item.title
        this.description = item.description
        this.year = item.year
        this.preview = this.accountArtwork.preview ? this.accountArtwork.preview : { type: 'video' }
        this.vimeoId = item.vimeoId
        this.selectedArtistIds = Object.keys(item.artists || {})
        this.selectedShowIds = Object.keys(item.shows || {})
        this.selectedControls = item.controls || []
      }
    }
  }
</script>
