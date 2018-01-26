<template>
  <main>
    <div v-if="userAccount" class="wrap-content wrap-forms">
      <p v-if="! isNew">
        <!--<router-link to="/account/artworks/">Artworks</router-link>
        •
        <router-link :to="'/account/artwork/' + artworkId">{{ title }}</router-link>
      </p>-->
      <form id="form-artwork" v-on:submit.prevent>
        <section class="editor-section">
          <div class="row">
            <label for="title">Title</label>
            <div class="field">
              <input id="title" type="text" v-model.trim="artwork.title" required="required">
            </div>
          </div>
          <div class="row">
            <label for="url">Work URL</label>
            <div class="field">
              <input id="url" type="text" v-model.trim="artwork.source.url" required="required">
            </div>
          </div>
          <div class="row">
            <label>Credits</label>
            <div class="field">
              <contributors-editor v-model="artwork.artists"/>
            </div>
          </div>
        </section>
        <section class="editor-section attachments">
          <div class="row">
            <image-attachment-editor v-model="artwork.thumbnail"/>
          </div>
          <div class="row">
            <label>Video Preview</label>
            <div class="field">
              <video-attachment-editor v-model="artwork.preview"/>
            </div>
          </div>
        </section>
      <div class="editor-section">
        <div class="row">
          <label for="description">Description</label>
          <div class="field">
            <textarea id="description" v-model.trim="artwork.description"></textarea>
          </div>
        </div>
        <div class="row">
          <label for="year">Year</label>
          <div class="field">
            <input id="year" type="text" v-model.trim="artwork.year" required="required">
          </div>
        </div>
        <section>
          <div class="row">
            <label>Remote Control</label>
            <div class="field">
              <remote-control-editor v-bind:controls="selectedControls" v-on:update="setControls"/>
            </div>
          </div>
        </section>

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
  import { Artwork } from '../../data/Artwork'

  import RemoteControlEditor from '../elements/RemoteControlEditor'
  import ContributorsEditor from '../elements/ContributorsEditor'
  import VideoAttachmentEditor from '../elements/VideoAttachmentEditor'
  import ImageAttachmentEditor from '../elements/ImageAttachmentEditor'

  export default {
    props: ['isNew'],
    components: {ImageAttachmentEditor, VideoAttachmentEditor, RemoteControlEditor, ContributorsEditor},
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
        artwork: Artwork.empty()
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
        this.artwork = Artwork.fromJson(this.accountArtwork)
      }
    }
  }
</script>
