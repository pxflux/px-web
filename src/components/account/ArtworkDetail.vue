<template>
  <main>
    <div v-if="userAccount && accountArtwork" class="wrap-content text-block editor">
      <div class="editor-sidebar">
        <div class="preview-box">
          <div class="thumbnail-cell">
            <div class="item-image-wrap">
              <img v-show="image.displayUrl" :src="image.displayUrl" width="100" height="100">
            </div>
          </div>
        </div>
      </div>
      <div class="editor-body">
        <div class="editor-section">
          <medium-editor
            :text='artworkData.title' :options='mediumSingleLineOptions'
            :data-placeholder="defaultTitle" :data-label="labels.title" :data-field-name="'title'"
            v-on:edit="processEditOperation" custom-tag='h1'>
          </medium-editor>
          <medium-editor
            :text='artworkData.url' :options='mediumSingleLineOptions'
            :data-placeholder="placeholders.url" :data-label="labels.url" :data-field-name="'url'"
            v-on:edit='processEditOperation' custom-tag='p'>
          </medium-editor>
          <medium-editor
            :text='artworkData.thumbUrl' :options='mediumSingleLineOptions'
            :data-placeholder="placeholders.thumbUrl" :data-label="labels.thumbUrl" :data-field-name="'thumbUrl'"
            v-on:edit='processEditOperation' custom-tag='p'>
          </medium-editor>

          <div class="editor-section">
            <medium-editor
              :text='namesString' :options='mediumSingleLineOptions'
              :data-placeholder="placeholders.artists" :data-label="labels.artists" :data-field-name="''"
              v-on:edit='' custom-tag='p'></medium-editor>
            <p>
              <!--<button class="mini">+</button>-->
              <select @change="addArtistNameToString" v-model="artistName">
                <option v-for="fullName in availableNames" v-bind:value="fullName">{{ fullName }}</option>
              </select>
            </p>
          </div>

          <medium-editor
            :text='artworkData.year' :options='mediumSingleLineOptions'
            :data-placeholder="placeholders.year" :data-label="labels.year" :data-field-name="'year'"
            v-on:edit='processEditOperation' custom-tag='p'>
          </medium-editor>

          <medium-editor
            :text='artworkData.description' :options='mediumMultiLineOptions'
            :data-placeholder="placeholders.description"
            :data-label="labels.description" :data-field-name="'description'"
            :class="'text'"
            v-on:edit='processEditOperation' custom-tag='div'>
          </medium-editor>

          <button @click="updateArtwork">{{uiStrings.save}}</button>
        </div>

        <div :class="'editor-section'">
          <div class="section-header with-label" :data-label="labels.remoteControl" @click="toggleRemoteControlEditor">
            <button :class="'drop-down ' + rcEditorState"></button>
            <div class="title" v-text="remoteControlSummary">{{remoteControlSummary}}</div>
          </div>
          <div :class="'section-body with-grid drop-down '+rcEditorState"
               v-if="rcEditorState == 'open'">
            <remote-control-editor
              :controls="artworkData.controls" v-on:updateRemoteControlData="updateRemoteControlData">
            </remote-control-editor>
            <button v-on:click="updateArtwork">{{uiStrings.save}}</button>
          </div>
        </div>

        <div class="editor-section">
          <h2>Iterations</h2>
          <ul>
            <li v-for="iteration in iterations" :key="iteration.__key">
              <router-link :to="'/account/artwork/' + $route.params.id + '/iterations/' + iteration.__key">
                {{ iteration.title }}
              </router-link>&nbsp;<button v-on:click="removeIteration(iteration.__key)">X</button>
            </li>
          </ul>
          <button v-on:click="createIteration()">Create</button>
        </div>
        <div class="editor-section">
          <button v-if="accountArtwork.published" @click="togglePublished(false)">{{uiStrings.unpublish}}</button>
          <button v-else @click="togglePublished(true)">{{uiStrings.publish}}</button>
          <button @click="removeArtwork">{{uiStrings.remove}}</button>
          <router-link :to="'/account/artwork/' + artworkId + '/edit'" class="button">Update</router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { cloneArtwork } from '../../models/artwork'
  import { log } from '../../helper'
  import Firebase from 'firebase'
  import firebaseApp, { store } from '../../firebase-app'
  import RemoteControlEditor from './RemoteControlEditor'
  import vueMediumEditor from 'vue2-medium-editor'

  export default {
    created () {
      this.init()
    },
    components: {
      'medium-editor': vueMediumEditor,
      'remote-control-editor': RemoteControlEditor
    },
    data () {
      return {
        defaultTitle: 'Untitled',
        labels: {
          title: 'Title',
          url: 'Work URL',
          thumbUrl: 'Thumbnail URL',
          year: 'Year',
          artist: 'Author',
          artists: 'Authors',
          description: 'Description',
          remoteControl: 'Remote Control'
        },
        placeholders: {
          url: 'Enter work URL',
          thumbUrl: 'Enter thumbnail URL',
          year: 'Enter the year of production',
          artists: 'Type the name of the author(s) here or select it from the list',
          description: 'Type your text'
        },
        uiStrings: {
          save: 'Save',
          publish: 'Publish',
          unpublish: 'Unpublish',
          remove: 'Delete the artwork'
        },
        namesString: '',
        availableNames: [],
        artistId: '',
        artistName: '',
        initialAuthorsLst: [],
        showForm: false,
        mediumSingleLineOptions: {
          toolbar: false,
          disableReturn: true,
          disableExtraSpaces: true
        },
        mediumMultiLineOptions: {},
        iterationTitle: '',
        rcEditorState: 'closed'
      }
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
      image () {
        return this.accountArtwork && this.accountArtwork.image ? this.accountArtwork.image : {
          displayUrl: null,
          storageUri: null
        }
      },

      remoteControlSummary () {
        if (this.rcEditorState === 'open') return ''
        const numButt = this.artworkData.controls.length
        if (!numButt) return 'No controls'
        return numButt + ' button' + (numButt > 1 ? 's' : '')
      },
      iterations () {
        return Object.keys(this.accountArtwork.iterations || {}).map(id => {
          const iteration = this.accountArtwork.iterations[id]
          if (id === 'draft') {
            return null
          }
          iteration.__key = id
          return iteration
        }).filter(_ => _)
      }
    },
    methods: {
      ...mapActions(['setRef']),
      ...mapMutations(['REMOVE_ACCOUNT_ARTWORK']),

      init () {
        if (this.accountId) {
          this.source = firebaseApp.database().ref('accounts/' + this.accountId + '/artworks/' + this.artworkId)
          this.setRef({ key: 'accountArtwork', ref: this.source })
          this.setRef({ key: 'artists', ref: firebaseApp.database().ref('artists') })
        } else {
          this.source = null
        }
      },

      addArtistNameToString () {
        if (this.artistName) {
          if (this.namesString) this.namesString += ', '
          this.namesString += this.artistName
          this.removeNameFromAvailableNames(this.artistName)
          this.artistName = ''
        }
        this.$nextTick(this.clickEditorsToRemovePlaceholders)
      },
      removeNameFromAvailableNames (name) {
        const index = this.availableNames.indexOf(name)
        if (index !== -1) {
          this.availableNames.splice(index, 1)
        }
      },
      processEditOperation: function (operation) {
        const field = operation.api.origElements.dataset.fieldName
        if (this.artworkData.hasOwnProperty(field)) {
          this.artworkData[field] = operation.api.origElements.innerHTML
        }
      },
      toggleRemoteControlEditor () {
        this.rcEditorState = this.rcEditorState === 'closed' ? 'open' : 'closed'
      },

      updateRemoteControlData (data) {
        this.artworkData.controls = []
        for (let i = 0; i < data.length; i++) {
          if (data[i]) this.artworkData.controls.push(data[i])
        }
      },

      clickEditorsToRemovePlaceholders (el) {
        // TODO remove placeholder on load/update text inside medium-editors
        // Just a hack... it has to be a better/ proper way to do this?
        // simulate click on medium-editors to remove placeholders when we update text
        if (el) {
          if (el.innerHTML !== '') el.click()
        } else {
          const editors = document.getElementsByClassName('medium-editor-element')
          for (let i = 0; i < editors.length; i++) {
            if (editors[i].innerHTML !== '') editors[i].click()
          }
        }
      },

      updateArtwork () {
//        this.showForm = false
//        if (this.source) {
//          this.artworkData.artists = this.parseArtistsString()
//
//          this.source.update(this.artworkData, log)
//          if (this.accountArtwork.publicId) {
//            const value = cloneArtwork(this.user.uid, this.$route.params.id, this.artworkData)
//            firebaseApp.database().ref('artworks/' + this.accountArtwork.publicId).update(value, log)
//          }
//        }
      },
      togglePublished (published) {
        if (!this.accountId) {
          return
        }
        store(this.accountId, this.artworkId, 'artworks', {published: published}).catch(log)
      },
      removeArtwork () {
        if (!this.accountId) {
          return
        }
        firebaseApp.database().ref('accounts/' + this.accountId + '/artworks/' + this.artworkId).remove().then(function () {
          this.$router.push('/account/artworks')
        }.bind(this)).catch(log)
      },
      parseArtistsString () {
        let data = {}
        const artistsList = this.namesString.split(/\s*,\s*/)
        for (let i = 0; i < artistsList.length; i++) {
          const artist = this.searchArtistName(artistsList[i])
          if (artist) {
            data[artist['.key']] = true
          } else {
            // TODO: make it really happen.. right now it is just a mock-up call..
            // and after creation of the artist we need to update the artwork again..
            if (this.hasOwnProperty('createArtist')) {
              this.createArtist(artistsList[i])
            }
          }
        }
        return data
      },
      /**
       * @param {string} name
       * @return {Object|boolean}
       */
      searchArtistName (name) {
        for (let i = 0; i < this.artists.length; i++) {
          const artistObj = this.artists[i]
          if (artistObj.hasOwnProperty('fullName')) {
            if (artistObj.fullName === name) return artistObj

            const nameParts = name.split(/\s+/)
            const artistNameParts = artistObj.fullName.split(/\s+/)
            if (nameParts.length !== artistNameParts.length) return false

            let matched = false
            for (let n = 0; n < nameParts.length; n++) {
              if (!nameParts[n]) continue
              const regx = new RegExp('(\\s' + nameParts[n] + '\\$)||(^' + nameParts[n] + '\\s)||(\\s' + nameParts[n] + '\\s)')
              matched = regx.test(artistObj.fullName)
            }
            if (matched) return artistObj
          }
        }
        return false
      },
      /**
       * @param {string} id
       */
      searchArtistId (id) {
        for (let i = 0; i < this.artists.length; i++) {
          const artistObj = this.artists[i]
          if (artistObj.hasOwnProperty('.key')) {
            if (artistObj['.key'] === id) return artistObj
          }
        }
        return false
      },
      addArtist () {
        if (this.source && this.artistId) {
          const data = this.accountArtwork.artists ? this.accountArtwork.artists : {}
          data[this.artistId] = true
          this.source.update({ 'artists': data }, log)
          if (this.accountArtwork.publicId) {
            const value = cloneArtwork(this.user.uid, this.$route.params.id, this.accountArtwork)
            firebaseApp.database().ref('artworks/' + this.accountArtwork.publicId).update(value, log)
          }
        }
      },
      removeArtist (artist) {
        if (this.source && this.accountArtwork.artists) {
          const data = this.accountArtwork.artists
          delete data[artist]
          this.source.update({ 'artists': data }, log)
          if (this.accountArtwork.publicId) {
            const value = cloneArtwork(this.user.uid, this.$route.params.id, this.accountArtwork)
            firebaseApp.database().ref('artworks/' + this.accountArtwork.publicId).update(value, log)
          }
        }
      },
      getNamesByIDs () {
        let names = []
        if (this.accountArtwork && this.accountArtwork.artists) {
          for (let id in this.accountArtwork.artists) {
            if (!this.accountArtwork.artists.hasOwnProperty(id)) continue
            const artist = this.searchArtistId(id)
            if (!artist) continue
            names.push(artist.fullName)
          }
        }
        return names
      },
      createIteration () {
        if (this.accountArtwork && this.source) {
          this.source.update({ 'iterations/draft/lastmodified': Firebase.database.ServerValue.TIMESTAMP }, function (error) {
            log(error)
            if (!error) {
              this.$router.push('/account/artwork/' + this.$route.params.id + '/iterations/draft')
            }
          }.bind(this))
        }
      },
      removeIteration (iteration) {
        if (this.source && this.accountArtwork.iterations) {
          const data = this.accountArtwork.iterations
          delete data[iteration]
          this.source.update({ 'iterations': data }, log)
        }
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'userAccount' () {
        this.init()
      },
      'artists' () {
        const artworkNames = this.getNamesByIDs()
        this.availableNames = []
        for (let i = 0; i < this.artists.length; i++) {
          const artist = this.artists[i]
          if (artworkNames.indexOf(artist.fullName) !== -1) continue
          this.availableNames.push(artist.fullName)
        }
        this.namesString = artworkNames.join(', ')
        this.$nextTick(this.clickEditorsToRemovePlaceholders)
      },
      'accountArtwork' () {
        this.$nextTick(this.clickEditorsToRemovePlaceholders)
      }
    }
  }
</script>
