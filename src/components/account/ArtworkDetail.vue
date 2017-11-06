<template>
  <main>
    <div v-if="user && accountArtwork" class="wrap-content text-block">
      <medium-editor
        :text='title' :options='mediumSingleLineOptions'
        :data-placeholder="defaultTitle" :data-lable="labels.title" :data-field-name="'title'"
        v-on:edit="processEditOperation" custom-tag='h1'>
      </medium-editor>
      <medium-editor
        :text='url' :options='mediumSingleLineOptions'
        :data-placeholder="placeholders.url" :data-lable="labels.url" :data-field-name="'url'"
        v-on:edit='processEditOperation' custom-tag='p'>
      </medium-editor>
      <medium-editor
        :text='thumbUrlText' :options='mediumSingleLineOptions'
        :data-placeholder="placeholders.thumbUrl" :data-lable="labels.thumbUrl" :data-field-name="'thumbUrl'"
        v-on:edit='processEditOperation' custom-tag='p'>
      </medium-editor>
      
      <div class="editor-section">
        <medium-editor
          :text='artistsNamesStr' :options='mediumSingleLineOptions'
          :data-placeholder="placeholders.artists" :data-lable="labels.artists" :data-field-name="''"
          v-on:edit='' custom-tag='p'></medium-editor>
        <p>
          <!--<button class="mini">+</button>-->
          <select @change="addArtistNameToString" v-model="artistName">
            <option v-for="fullName in availableArtistsNames" v-bind:value="fullName">{{ fullName }}</option>
          </select>
        </p>
      </div>
      
      <medium-editor
        :text='year' :options='mediumSingleLineOptions'
        :data-placeholder="placeholders.year" :data-lable="labels.year" :data-field-name="'year'"
        v-on:edit='processEditOperation' custom-tag='p'>
      </medium-editor>
      
      <medium-editor
        :text='description' :options='mediumMultiLineOptions'
        :data-placeholder="placeholders.description"
        :data-lable="labels.description" :data-field-name="'description'"
        v-on:edit='processEditOperation' custom-tag='div'>
      </medium-editor>
      <button v-on:click="updateArtwork()">Save</button>
      <!---->
      <iframe :src="accountArtwork.url"></iframe>
    </div>
  </main>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { cloneArtwork } from '../../models/artwork'
  import { log } from '../../helper'
  import firebase from '../../firebase-app'
  import vueMediumEditor from 'vue2-medium-editor'

  export default {
    created () {
      this.init()
    },
    components: {
      'medium-editor': vueMediumEditor
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
          description: 'Description'
        },
        placeholders: {
          url: 'Enter work URL',
          thumbUrl: 'Enter thumbnail URL',
          year: 'Enter year of production',
          artists: 'Type the name of the author(s) here or select it from the list',
          description: 'Type your text'
        },
        title: '',
        url: '',
        thumbUrl: '',
        year: '',
        description: '',
        artistsList: [],
        artistsNamesStr: '',
        availableArtistsNames: [],
        artistId: '',
        artistName: '',
        showForm: false,
        mediumSingleLineOptions: {
          toolbar: false,
          disableReturn: true,
          disableExtraSpaces: true
        },
        mediumMultiLineOptions: {}
      }
    },
    computed: {
      ...mapState(['user', 'accountArtwork', 'artists']),
      thumbUrlText () {
        return this.thumbUrl
      }
    },
    methods: {
      addArtistNameToString () {
        if (this.artistName) {
          if (this.artistsNamesStr) this.artistsNamesStr += ', '
          this.artistsNamesStr += this.artistName
          this.removeArtistNameFromAvailableNames(this.artistName)
          this.artistName = ''
        }
      },
      removeArtistNameFromAvailableNames (name) {
        const index = this.availableArtistsNames.indexOf(name)
        if (index !== -1) {
          this.availableArtistsNames.splice(index, 1)
        }
      },
      processEditOperation: function (operation) {
        const field = operation.api.origElements.dataset.fieldName
        if (this.hasOwnProperty(field)) {
          this[field] = operation.api.origElements.innerHTML
        }
      },
      ...mapActions(['setRef']),
      ...mapMutations(['REMOVE_ACCOUNT_ARTWORK']),

      init () {
        if (this.user && this.user.uid) {
          this.source = firebase.database().ref('users/' + this.user.uid + '/artworks/' + this.$route.params.id)
          this.setRef({ key: 'accountArtwork', ref: this.source })
          this.setRef({ key: 'artists', ref: firebase.database().ref('artists') })
        } else {
          this.source = null
          this.REMOVE_ACCOUNT_ARTWORK()
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
          this.source.update({ 'publicId': '' }, log)
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
      parseArtistsString () {
        let data = {}
        const artistsList = this.artistsNamesStr.split(/\s*,\s*/)
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
            firebase.database().ref('artworks/' + this.accountArtwork.publicId).update(value, log)
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
            firebase.database().ref('artworks/' + this.accountArtwork.publicId).update(value, log)
          }
        }
      },
      convertArtistIDsToNames () {
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
        const artworkNames = this.convertArtistIDsToNames()
        this.availableArtistsNames = []
        for (let i = 0; i < this.artists.length; i++) {
          const artist = this.artists[i]
          if (artworkNames.indexOf(artist.fullName) !== -1) continue
          this.availableArtistsNames.push(artist.fullName)
        }
        this.artistsNamesStr = artworkNames.join(', ')
      },
      'accountArtwork' () {
        this.title = this.accountArtwork.title
        this.url = this.accountArtwork.url
        this.thumbUrl = this.accountArtwork.thumbUrl
        this.year = this.accountArtwork.year
        this.description = this.accountArtwork.hasOwnProperty('description') ? this.accountArtwork.description : ''
        this.$forceUpdate()
      }
    }
  }
</script>
