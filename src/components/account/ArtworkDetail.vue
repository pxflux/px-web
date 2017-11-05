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
      
      <medium-editor
        :text='artistsNames' :options='mediumSingleLineOptions'
        :data-placeholder="placeholders.artists" :data-lable="labels.artist" :data-field-name="''"
        v-on:edit='' custom-tag='p'>
      </medium-editor>
      
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
      
      <h2>Artists</h2>
      <ul v-if="accountArtwork.artists">
        <li v-for="(index, artist) in accountArtwork.artists" :key="index">
          {{ artist }}
          <a @click="removeArtist(artist)" class="button">X</a>
        </li>
      </ul>
      <form id="form-artwork-artists" @submit.prevent="addArtist()">
        <select v-model="artistId">
          <option v-for="artist in artists" v-bind:value="artist['.key']">{{ artist.fullName }}</option>
        </select>
        <input type="button" value="Cancel" @click="showForm = false">
        <input type="submit" value="Save">
      </form>
      <ul v-if="showForm === false">
        <li><a @click="showForm = true" class="button">Update</a></li>
        <li><a @click="removeArtwork" class="button">Remove</a></li>
        <li v-if=" ! accountArtwork.publicId"><a @click="publishArtwork" class="button">Publish</a></li>
        <li v-if="accountArtwork.publicId"><a @click="unPublishArtwork" class="button">Un publish</a></li>
      </ul>
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
          artists: 'Add the author(s) of the work here',
          description: 'Type your text'
        },
        title: '',
        url: '',
        thumbUrl: '',
        year: '',
        description: '',
        artistId: '',
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
      artistsNames: function () {
        if (this.accountArtwork && this.accountArtwork.artists) {
          let str = ''
          for (let key in this.accountArtwork.artists) {
            if (this.accountArtwork.artists.hasOwnProperty(key)) {
              if (str) {
                str += ', '
              }
              str += key
            }
          }
          return str
        }
        return ''
      },
      thumbUrlText () {
        return this.thumbUrl
      }
    },
    methods: {
      disableEditor (operation) {
        // operation.tearDown()
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
          this.source.update({
            'title': this.title || this.defaultTitle,
            'url': this.url,
            'thumbUrl': this.thumbUrl || '',
            'year': this.year || '',
            'description': this.description || ''
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
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'user' () {
        this.init()
      },
      'accountArtwork' () {
        this.title = this.accountArtwork.title
        this.url = this.accountArtwork.url
        this.thumbUrl = this.accountArtwork.thumbUrl
        this.year = this.accountArtwork.year
        this.description = this.accountArtwork.hasOwnProperty('description') ? this.accountArtwork.description : ''
      }
    }
  }
</script>
