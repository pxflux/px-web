<template>
  <main v-if="artwork">
    <attachment-panel v-if="image" :preview="preview" :image="image"> </attachment-panel>
    <div class="wrap-content">
      <div class="content">
        <h1 :title="artwork.title">{{ artwork.title }}</h1>
        <ul v-if="artists.length" class="by-string">
          <li v-for="artist in artists" :key="artist['__key']">
            <router-link :to="'/artist/' + artist['.key']">{{ artist.fullName }}</router-link>
          </li>
        </ul>
        <p class="work-meta caption">
          <span v-show="artwork.year">{{ artwork.year }}</span>
          <span>Here comes the short technical description</span>
          <span>no sound</span>
          <span>Javascript</span>
        </p>
        <section class="description">
          {{ this.artwork.description }}
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod ipsum in dolor convallis viverra. Nam ut laoreet turpis, vitae dictum turpis. Etiam eu tellus sit amet enim porta blandit. Pellentesque cursus vehicula purus ac imperdiet. Nunc lacinia ipsum nec urna laoreet, id aliquam risus luctus. Praesent et sem aliquet, tincidunt nisl et, lobortis purus. Integer massa justo, pellentesque eget iaculis sed, sagittis eu urna. Quisque bibendum, quam vel iaculis pretium, nibh velit volutpat risus, eget pulvinar urna velit vel nunc. Donec lacinia sem non tellus pretium ultrices. Mauris tristique lacinia sollicitudin. Curabitur sed nibh eu nisi sollicitudin tristique eu eu sem. Suspendisse arcu quam, imperdiet ut posuere ut, suscipit non dolor. Nunc porta eu mi nec porttitor.</p>
          <p>Donec sed justo vestibulum, tempor nulla eget, tempor dui. Quisque nec aliquam odio, ac consequat orci. Vivamus consectetur tortor id arcu viverra, at congue ante interdum. Donec ac lectus vitae felis laoreet euismod quis sed purus. Vivamus ut elementum lorem, sit amet congue sem. Mauris tempus bibendum mauris, nec malesuada nisl ornare ac. Quisque pellentesque, sem nec malesuada tempus, enim ligula aliquam ex, a ultricies velit dolor ut mauris. Sed finibus mi nec fermentum malesuada. Sed a molestie est. Sed vulputate, libero a pellentesque pellentesque, massa justo viverra odio, id tincidunt sapien lorem et lorem. Sed elementum libero sit amet ante scelerisque, scelerisque sodales dolor euismod. Ut sed euismod arcu. Praesent purus leo, elementum nec porttitor a, pharetra at risus. Mauris ultricies fermentum finibus. Pellentesque aliquet ex sit amet massa suscipit, eu mattis nibh auctor. Pellentesque mattis semper augue, eu egestas sapien blandit nec.</p>
          <p>Praesent rhoncus semper orci at interdum. Morbi eu augue non augue aliquet ullamcorper. Etiam luctus gravida lorem vel accumsan. Cras rhoncus porttitor porttitor. Aenean tincidunt varius auctor. Proin arcu diam, lobortis vel ipsum non, rhoncus tincidunt risus. Sed non vulputate justo, at dapibus enim. Integer lobortis nibh ante. Aliquam condimentum ullamcorper sem. Vestibulum porttitor sit amet leo at tristique. Nullam ac mauris non orci lacinia imperdiet. Donec feugiat elit sit amet arcu consequat, eget tempor eros ornare. Vestibulum dapibus at orci at aliquet.</p>
          <p>Fusce vehicula orci tortor, et hendrerit nisl aliquam eu. Donec bibendum sem id tellus congue viverra. Donec mattis tempus lectus, vel viverra augue malesuada vel. Suspendisse vitae mattis nibh. Integer erat turpis, suscipit in facilisis a, consectetur eget ante. Suspendisse lacinia interdum quam, ut ultricies arcu rutrum ac. Vestibulum non purus suscipit, consectetur erat id, ullamcorper nulla. Aenean sed est enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <p>Pellentesque quis purus a nisi vehicula blandit. Fusce at ex nisi. Nulla tristique nec dolor non finibus. Etiam porttitor posuere facilisis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc faucibus eu elit ut aliquet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquam at odio ut pharetra. Cras magna felis, fermentum ac augue eu, varius tempus augue. Aenean molestie quam eget erat elementum, sit amet elementum eros consectetur. In molestie placerat dolor lobortis interdum. Aliquam nec ligula mauris. Sed sit amet eleifend augue. Vivamus cursus sagittis sem, at tincidunt purus rhoncus sed. Praesent nec pulvinar erat, non tempor dui. Cras a eros felis.</p>
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
  import AttachmentPanel from '../elements/AttachmentsPanel'
  import RemoteControl from '../elements/RemoteControl'
  import { log } from '../../helper'

  export default {
    components: {
      AttachmentPanel,
      RemoteControl
    },
    created () {
      this.init()
    },
    computed: {
      ...mapState(['userAccount', 'artwork', 'accountPlayers']),
      preview () {
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
        console.log('this.artwork: >>>>>> image?')
        console.log(this.artwork)
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
