<template>
  <main v-if="artwork">
    <div class="attachments">
      <div class="display">
        <video-player v-if="preview"
                      :videoUrl="preview.displayUrl"
                      :ratio="preview.ratio">
        </video-player>
        <div>
          <img v-show="image.displayUrl" :src="image.displayUrl">
        </div>
      </div>
      <div class="toolbar">
        <div class="controls">
          <div class="video-player">
            <div class="button play">
              <div class="icon play"></div>
            </div>
            <div class="button sound">
              <div class="icon">
                sound
              </div>
            </div>
          </div>
          <div class="caption">
            Here is the caption for the above photograph or video
          </div>
        </div>
        <a href="#" class="button">
          <div class="icon arrow-left"></div>
        </a>
        <a class="button">
          <div class="icon arrow-right"></div>
        </a>
      </div>
    </div>
    <div class="wrap-content">
      <div class="content">
        <h1 :title="artwork.title">{{ artwork.title }}</h1>
        <ul v-if="artists.length" class="by-string">
          <li v-for="artist in artists" :key="artist['__key']">
            <router-link :to="'/artist/' + artist['.key']">{{ artist.fullName }}</router-link>
          </li>
        </ul>
        <section class="work-meta caption">
          <span v-show="artwork.year">{{ artwork.year }}</span>
          <span>Here comes the short technical description</span>
          <span>no sound</span>
          <span>Javascript</span>
        </section>
        <section v-if="this.artwork.description" class="description">
          {{ this.artwork.description }}
        </section>
      </div>
      
      <div class="sidebar">
        <section class="social">
          <div class="row">
            <div class="button square"><div class="icon star">like</div></div>
            <div class="button square"><div class="icon share">share</div></div>
          </div>
        </section>
        <section class="actions">
          <div class="row">
            <div class="cell row-header">Add to Collection</div>
            <div class="button"><div class="icon plus"></div></div>
          </div>
          <ul v-if="accountPlayers.length">
            <template v-for="player in accountPlayers">
            <li class="row" :key="player['__key']">
              <template v-if="!launched(player)">
                <div
                  class="cell row-header"
                  @click="launch(player)">
                  Preview on Display <span class="accent">{{ player.pin }}</span>
                </div>
                <div class="button" @click="launch(player)"><div class="icon display play"></div></div>
              </template>
              <template v-if="launched(player)">
                <div
                  class="cell row-header active"
                  @click="stop(player)">
                  Stop Preview on <span class="accent">{{ player.pin }}</span>
                </div>
                <div class="button" @click="stop(player)"><div class="icon stop"></div></div>
              </template>
            </li>
            <li v-if="launched(player)" :key="player['__key']-remote" class="display-controls">
              <div class="header">Remote for <span class="accent">{{ player.pin }}</span></div>
              <remote-control
                :controls="controls"
                :displayId="player.pin"
                v-on:select="sendControl(player, $event)">
              </remote-control>
            </li>
            </template>
          </ul>
          <div class="row">
            <router-link :to="'/account/artwork/' + artworkId + '/edit'" class="button">
              <div class="icon edit">edit</div>
            </router-link>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import firebase from '../../firebase-app'
  import VideoPlayer from '../VideoPlayer'
  import RemoteControl from '../elements/RemoteControl'
  import { log } from '../../helper'

  export default {
    components: {
      'video-player': VideoPlayer,
      RemoteControl
    },
    created () {
      this.init()
    },
    computed: {
      ...mapState(['userAccount', 'artwork', 'accountPlayers']),
      preview () {
        console.log('this.artwork: >>>>>>')
        console.log(this.artwork)
        return this.artwork && this.artwork.preview ? this.artwork.preview : null
      },
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
          return { ...this.artwork.artists[id], ...{ '.key': id } }
        })
      },
      shows () {
        return Object.keys(this.artwork.shows || {}).map(id => {
          return { ...this.artwork.shows[id], ...{ '.key': id } }
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
        this.setRef({ key: 'artwork', ref: firebase.database().ref('artworks/' + this.artworkId) })
        if (this.accountId) {
          this.setRef({
            key: 'accountPlayers',
            ref: firebase.database().ref('accounts/' + this.accountId + '/players')
          })
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
        firebase.database().ref('commands/' + player.pin).push({ controlId: '' + position }).catch(log)
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
