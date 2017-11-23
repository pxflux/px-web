<template>
  <main>
    <div v-if="userAccount" class="wrap-content text-block">
      <router-link to="/account/artworks/">Artworks</router-link>
      <template v-if="! isNew && accountArtwork">
        &gt;
        <router-link :to="'/account/artwork/' + artworkId">{{ accountArtwork.title }}</router-link>
      </template>

      <form id="form-artwork" v-on:submit.prevent>
        <remote-control-editor v-bind:controls="selectedControls" v-on:update="setControls"></remote-control-editor>

        <div class="editor-section">
          <label for="image">Image</label>
          <image-upload id="image" :imageUrl="image.displayUrl" @input-file="setImageFile"
                        @remove-image="setImageRemoved"></image-upload>
          <label for="url">Work URL</label>
          <input id="url" type="text" v-model.trim="url" required="required">
        </div>
        <fieldset>
        </fieldset>
        <fieldset>
          <label for="title">Title</label>
          <input id="title" type="text" v-model.trim="title" required="required">
        </fieldset>
        <fieldset>
          <label for="description">Description</label>
          <textarea id="description" v-model.trim="description"></textarea>
        </fieldset>
        <fieldset>
          <label for="year">Year</label>
          <input id="year" type="text" v-model.trim="year" required="required">
        </fieldset>
        <fieldset>
          <label for="vimeoId">Vimeo Id</label>
          <input id="vimeoId" type="text" v-model.trim="vimeoId" required="required">
        </fieldset>
        <fieldset>
          <label for="artistIds">Artists</label>
          <select id="artistIds" v-model="selectedArtistIds" multiple required>
            <option v-for="artist in artists" v-bind:value="artist['.key']">{{ artist.fullName }}</option>
          </select>
        </fieldset>
        <fieldset>
          <label for="showIds">Shows</label>
          <select id="showIds" v-model="selectedShowIds" multiple>
            <option v-for="show in shows" v-bind:value="show['.key']">{{ show.title }}</option>
          </select>
          <button v-show="selectedShowIds.length > 0" @click="selectedShowIds = []">Clear</button>
        </fieldset>

        <fieldset>
          <router-link v-if="isNew" to="/account/artworks">Cancel</router-link>
          <router-link v-if="! isNew" :to="'/account/artwork/' + artworkId">Cancel</router-link>
          <button v-if="isNew" @click="submitArtwork">Create</button>
          <button v-if="! isNew" @click="submitArtwork">Save</button>
        </fieldset>
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

  export default {
    props: ['isNew'],
    components: {
      ImageUpload, RemoteControlEditor
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
        imageFile: null,
        imageRemoved: false,
        url: '',
        title: '',
        description: '',
        year: '',
        vimeoId: '',
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
      setControls (value) {
        this.selectedControls = value
      },

      submitArtwork () {
        if (!this.accountId) {
          return
        }
        const artwork = {
          published: this.published,
          url: this.url,
          title: this.title,
          description: this.description || '',
          year: this.year || '',
          vimeoId: this.vimeoId || '',
          artists: {},
          shows: {},
          controls: this.selectedControls
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
        store(this.accountId, this.artworkId, 'artworks', artwork, this.imageRemoved, this.imageFile).then(function (ref) {
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
        const item = this.accountArtwork || {}
        this.url = item.url
        this.title = item.title
        this.description = item.description
        this.year = item.year
        this.vimeoId = item.vimeoId
        this.selectedArtistIds = Object.keys(item.artists || {})
        this.selectedShowIds = Object.keys(item.shows || {})
        this.selectedControls = item.controls || []
      }
    }
  }
</script>
