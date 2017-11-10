<template>
  <main>
    <div v-if="user && accountArtwork" class="wrap-content text-block editor">
      <div class="editor-sidebar">
        <div class="preview-box">
          <div class="thumbnail-cell">
            <div class="item-image-wrap"><img :src="thumbUrlText" class="item-image"/></div>
          </div>
          <iframe :src="accountArtwork.url"></iframe>
        </div>
      </div>
      <div class="editor-body">
        <div class="editor-section">
          <medium-editor
            :text='title' :options='mediumSingleLineOptions'
            :data-placeholder="defaultTitle" :data-label="labels.title" :data-field-name="'title'"
            v-on:edit="processEditOperation" custom-tag='h1'>
          </medium-editor>
          <medium-editor
            :text='url' :options='mediumSingleLineOptions'
            :data-placeholder="placeholders.url" :data-label="labels.url" :data-field-name="'url'"
            v-on:edit='processEditOperation' custom-tag='p'>
          </medium-editor>
          <medium-editor
            :text='thumbUrlText' :options='mediumSingleLineOptions'
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
            :text='year' :options='mediumSingleLineOptions'
            :data-placeholder="placeholders.year" :data-label="labels.year" :data-field-name="'year'"
            v-on:edit='processEditOperation' custom-tag='p'>
          </medium-editor>
          
          <medium-editor
            :text='description' :options='mediumMultiLineOptions'
            :data-placeholder="placeholders.description"
            :data-label="labels.description" :data-field-name="'description'"
            :class="'text'"
            v-on:edit='processEditOperation' custom-tag='div'>
          </medium-editor>
          
          <remote-control-editor :class="'with-label'" :data-label="labels.remoteControl">
          </remote-control-editor>
          
          <button v-on:click="updateArtwork()">Save</button>
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
      </div>
    </div>
  </main>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { cloneArtwork } from '../../models/artwork'
  import { log } from '../../helper'
  import Firebase from 'firebase'
  import firebaseApp from '../../firebase-app'
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
        title: '',
        url: '',
        thumbUrl: '',
        year: '',
        description: '',
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
        iterationTitle: ''
      }
    },
    computed: {
      ...mapState(['user', 'accountArtwork', 'artists']),
      thumbUrlText () {
        return this.thumbUrl
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
        if (this.hasOwnProperty(field)) {
          this[field] = operation.api.origElements.innerHTML
        }
      },

      init () {
        if (this.user && this.user.uid) {
          this.source = firebaseApp.database().ref('users/' + this.user.uid + '/artworks/' + this.$route.params.id)
          this.setRef({ key: 'accountArtwork', ref: this.source })
          this.setRef({ key: 'artists', ref: firebaseApp.database().ref('artists') })
        } else {
          this.source = null
          this.REMOVE_ACCOUNT_ARTWORK()
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
        this.showForm = false
        if (this.source) {
          const artistsData = this.parseArtistsString()
          this.source.update({
            'title': this.title || this.defaultTitle,
            'url': this.url,
            'thumbUrl': this.thumbUrl || '',
            'year': this.year || '',
            'description': this.description || '',
            'artists': artistsData
          }, log)
          if (this.accountArtwork.publicId) {
            const value = cloneArtwork(this.user.uid, this.$route.params.id, this.accountArtwork)
            firebaseApp.database().ref('artworks/' + this.accountArtwork.publicId).update(value, log)
          }
        }
      },
      publishArtwork () {
        if (this.source && this.accountArtwork.publicId === '') {
          const value = cloneArtwork(this.user.uid, this.$route.params.id, this.accountArtwork)
          const id = firebaseApp.database().ref('artworks').push(value, log).key
          this.source.update({
            'publicId': id
          })
        }
      },
      unPublishArtwork () {
        if (this.source && this.accountArtwork.publicId !== '') {
          firebaseApp.database().ref('artworks/' + this.accountArtwork.publicId).remove(log)
          this.source.update({ 'publicId': '' }, log)
        }
      },
      removeArtwork () {
        if (this.source) {
          if (this.accountArtwork.publicId) {
            firebaseApp.database().ref('artworks/' + this.accountArtwork.publicId).remove(log)
          }
          this.source.remove(log)
          this.REMOVE_ACCOUNT_ARTWORK()
          this.$router.push('/account/artworks')
        }
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
              const regx = new RegExp('(\\s' + nameParts[n] + '\\$)||(^' + nameParts[n] + '\\s)||(\\s' + nameParts[n] + '\\s)')
              matched = artistObj.fullName.test(regx)
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
      'user' () {
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
        this.title = this.accountArtwork.title
        this.url = this.accountArtwork.url
        this.thumbUrl = this.accountArtwork.thumbUrl
        this.year = this.accountArtwork.year
        this.description = this.accountArtwork.hasOwnProperty('description') ? this.accountArtwork.description : ''
        this.$nextTick(this.clickEditorsToRemovePlaceholders)
      }
    }
  }
</script>
