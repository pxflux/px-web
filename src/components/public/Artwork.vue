<template>
  <main v-if="artwork">
    <div v-if="artwork.vimeoId">
      <vimeo :video-id='artwork.vimeoId' :options="{background:true}"></vimeo>
    </div>
    <div class="wrap-content text-block">
      <h1 :title="artwork.title">{{ artwork.title }}</h1>
      <img v-show="image.displayUrl" :src="image.displayUrl" width="200" height="200">
      <span v-show="artwork.year">{{ artwork.year }}</span>
      <ul v-if="accountPlayers.length">
        <li v-for="player in accountPlayers" :key="player['__key']">
          <button v-if="!launched(player)" @click="launch(player)">Launch on {{ player.pin }}</button>
          <template v-if="launched(player)">
            <button @click="stop(player)">Stop from {{ player.pin }}</button>
            <remote-control :controls="controls" v-on:select="sendControl(player, $event)"></remote-control>
          </template>
        </li>
      </ul>
      <h2 v-if="artists.length">Artists</h2>
      <ul v-if="artists.length">
        <li v-for="artist in artists" :key="artist['__key']">
          <router-link :to="'/artist/' + artist['.key']">{{ artist.fullName }}</router-link>
        </li>
      </ul>
      <h2 v-if="shows.length">Shows</h2>
      <ul v-if="shows.length">
        <li v-for="show in shows" :key="show['__key']">
          <router-link :to="'/show/' + show['.key']">{{ show.title }}</router-link>
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import firebase from '../../firebase-app'
  import { vueVimeoPlayer } from 'vue-vimeo-player'
  import RemoteControl from '../elements/RemoteControl'
  import { log } from '../../helper'

  export default {
    components: {
      vimeo: vueVimeoPlayer,
      RemoteControl
    },
    created () {
      this.init()
    },
    computed: {
      ...mapState(['userAccount', 'artwork', 'accountPlayers']),

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
        return this.artwork && this.artwork.image ? this.artwork.image : {
          displayUrl: null,
          storageUri: null
        }
      },
      artists () {
        return Object.keys(this.artwork.artists || {}).map(id => {
          return {...this.artwork.artists[id], ...{'.key': id}}
        })
      },
      shows () {
        return Object.keys(this.artwork.shows || {}).map(id => {
          return {...this.artwork.shows[id], ...{'.key': id}}
        })
      },
      controls () {
        if (this.artwork) {
          return this.artwork.controls || []
        }
        return []
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.setRef({key: 'artwork', ref: firebase.database().ref('artworks/' + this.artworkId)})
        if (this.accountId) {
          this.setRef({key: 'accountPlayers', ref: firebase.database().ref('accounts/' + this.accountId + '/players')})
        }
      },
      launched (player) {
        if (!this.accountId || !this.artwork || !player.artwork) {
          return false
        }
        return this.artworkId === player.artwork.key
      },
      launch (player) {
        if (!this.accountId || !this.artwork) {
          return
        }
        const data = {
          artwork: {
            key: this.artwork['.key'],
            url: this.artwork.url,
            title: this.artwork.title,
            author: this.artists.map(artist => artist.fullName).join(', '),
            controls: this.artwork.controls
          }
        }
        firebase.database().ref('accounts/' + this.accountId + '/players/' + player['.key']).update(data).catch(log)
      },
      stop (player) {
        if (!this.accountId || !this.artwork) {
          return
        }
        firebase.database().ref('accounts/' + this.accountId + '/players/' + player['.key'] + '/artwork').remove().catch(log)
      },
      sendControl (player, position) {
        firebase.database().ref('commands/' + player.pin).push({controlId: '' + position}).catch(log)
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'userAccount' () {
        this.init()
      }
    }
  }
</script>
