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
            <input id="title" type="text" v-model.trim="title" required="required">
          </h1>
          <label for="url">Work URL</label>
          <input id="url" type="text" v-model.trim="artwork.url" required="required">
        </div>
        <div class="editor-section">
          <label for="image">Image</label>
          <image-upload id="image" :imageUrl="image.displayUrl" @input-file="setImageFile"
                        @remove-image="setImageRemoved"></image-upload>
        </div>
        <div class="editor-section">
          <div>Video Preview</div>
          <attachment v-model="preview" :attachmentData="preview"
                      @changed="updatePreview">
          </attachment>
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

  // import axios from 'axios'
  function ArtworkDataStruct () { return ArtworkData }

  const ArtworkData = {
    accountId: '',
    published: false,
    title: 'Untitled',
    url: '', // TODO: url should be stored in 'source':{url:'', type:''}.. and this could be just a shortcut
    /** @type Attachment */
    thumbnail: null,
    /** @type Attachment */
    preview: null,
    year: '',
    /** @type Contributor[] */
    credits: [],
    artists: this.credits, // TODO: has to be removed.. it is now just for a backward compatibility
    statisticsShort: null,
    description: '',
    source: {
      url: '',
      type: 'video' | 'html'
    },
    controls: [],
    iterations: [],
    shows: [],
    category: [],
    tags: [],
    statistics: null
  }

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
        /** @type ArtworkDataStruct */
        artwork: { ...ArtworkDataStruct },
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
        this.preview = previewData
        console.log('previewData >>>>')
        console.log(previewData)
      },
      setControls (value) {
        this.selectedControls = value
      },

      submitArtwork () {
        if (!this.accountId) {
          return
        }
        console.log('this.preview: >>>>>>')
        console.log(this.preview)
        const artwork = {
          published: this.published,
          url: this.url,
          title: this.title,
          preview: this.preview,
          description: this.description || '',
          year: this.year || '',
          vimeoId: this.vimeoId || '',
          artists: {},
          shows: {},
          controls: this.selectedControls
        }
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
      },
      upgradeToNewDataStruct () {
        /** @type ArtworkDataStruct */
        let artwork = this.artwork
        artwork = { ...ArtworkDataStruct, ...this.accountArtwork }
        artwork.url = this.accountArtwork.url
        this.title = this.accountArtwork.title
        this.description = this.accountArtwork.description
        this.year = this.accountArtwork.year
        this.vimeoId = this.accountArtwork.vimeoId
        this.selectedArtistIds = Object.keys(this.accountArtwork.artists || {})
        this.selectedShowIds = Object.keys(this.accountArtwork.shows || {})
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
        const item = this.accountArtwork || {}
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
