<template>
  <main>
    <div v-if="userAccount" class="wrap-content wrap-forms">
      <form id="form-artwork" v-on:submit.prevent>
        <section class="editor-section">
          <div class="row">
            <label for="title"><span>Title</span></label>
            <div class="field">
              <input id="title" type="text" v-model.trim="artwork.title" required="required">
            </div>
          </div>
          <div class="work-specifications">
            <section>
              <artwork-config-editor :artwork="artwork"/>
            </section>
            <section>
              <div class="row">
                <label>Remote Control</label>
                <div class="field">
                  <remote-control-editor v-bind:controls="selectedControls" v-on:update="setControls"/>
                </div>
              </div>
            </section>
          </div>
          <div class="row">
            <label>By</label>
            <div class="field">
              <contributors-editor v-model="artwork.artists"/>
            </div>
          </div>
          <div class="row">
            <label>Credits</label>
            <div class="field">
              <contributors-editor v-model="artwork.credits" :withRoles="true"/>
            </div>
          </div>
          <div class="row">
            <label for="year">Year</label>
            <div class="field">
              <input id="year" type="text" v-model.trim="artwork.year" required="required">
            </div>
          </div>
          <div class="row">
            <label for="description">Description</label>
            <div class="field">
              <textarea id="description" v-model.trim="artwork.description"></textarea>
            </div>
          </div>
        </section>
        <footer class="editor-section">
          <router-link v-if="isNew" to="/account/artworks">Cancel</router-link>
          <router-link v-if="! isNew" :to="'/account/artwork/' + artworkId">Cancel</router-link>
          <button v-if="isNew" @click="submitArtwork">Create</button>
          <button v-if="! isNew" @click="submitArtwork">Save</button>
        </footer>
      </form>
    </div>
  </main>
</template>

<script>
  // SELECTs
  // https://github.com/sagalbot/vue-select
  // https://github.com/shentao/vue-multiselect
  // SORTABLE
  // https://github.com/Jexordexan/vue-slicksort
  // https://github.com/hilongjw/vue-dragging *

  import { mapActions, mapState } from 'vuex'
  import { log } from '../../helper'
  import firebase, { store } from '../../firebase-app'
  import { Artwork } from '../../data-types/Artwork'

  import RemoteControlEditor from '../elements/RemoteControlEditor'
  import ContributorsEditor from '../elements/ContributorsEditor'
  import VideoAttachmentEditor from '../elements/VideoAttachmentEditor'
  import ImageAttachmentEditor from '../elements/ImageAttachmentEditor'
  import ArtworkConfigEditor from '../elements/ArtworkConfigEditor'

  export default {
    props: ['isNew'],
    components: {
      ImageAttachmentEditor,
      VideoAttachmentEditor,
      RemoteControlEditor,
      ContributorsEditor,
      ArtworkConfigEditor
    },
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
        artwork: new Artwork(),
        selectedControls: null
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
          const data = { fullName: artist.fullName }
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
      },
      'userAccount' () {
        this.init()
      },
      'accountArtwork' () {
        this.artwork.fromJson(this.accountArtwork)
      }
    }
  }
</script>
