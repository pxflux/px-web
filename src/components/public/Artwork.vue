<template>
  <main v-if="artwork">
    <attachment-panel :video="video" :images="images" />
    <div class="wrap-content">
      <div class="content">
        <h1 :title="artwork.title">{{ artwork.title }}</h1>
        <ul v-if="artwork.artists.length" class="by-string">
          <li v-for="artist in artwork.artists" :key="artist.key">
            <router-link :to="'/artist/' + artist.key">{{ artist.fullName }}</router-link>
          </li>
        </ul>
        <p class="work-meta caption">
          <span v-show="artwork.year">{{ artwork.year }}</span>
          <span>{{ sourceDescription }}</span>
          <span>no sound</span>
          <span>Javascript</span>
        </p>
        <section class="description">
          {{ artwork.description }}
        </section>
        <section class="credits">
          Credits
          <ul v-if="artwork.credits.length" class="credits-string">
            <li v-for="person in artwork.credits" :key="person.key">
              <span :to="'/artist/' + person.key">{{ person.fullName }}: <i>{{ person.role }}</i></span>
            </li>
          </ul>
        </section>
      </div>

      <div class="sidebar">
        <section class="social">
          <div class="row">
            <div class="button square">
              <div class="icon star">like</div>
            </div>
            <div class="button square">
              <div class="icon share">share</div>
            </div>
          </div>
        </section>
        <section class="actions">
          <div class="row">
            <div class="cell row-header">Add to Collection</div>
            <div class="button">
              <div class="icon plus"></div>
            </div>
          </div>
          <ul v-if="players.length">
            <template v-for="player in players">
              <template v-if="!player.isArtworkLaunched(id)">
                <li class="row" :key="player.key">
                  <div class="cell row-header" @click="launch(player)">
                    Preview on Display <span class="accent">{{ player.pin }}</span>
                  </div>
                  <div class="button" @click="launch(player)">
                    <div class="icon display play"></div>
                  </div>
                </li>
              </template>
              <template v-if="player.isArtworkLaunched(id)">
                <li class="row" :key="player.key">
                  <div class="cell row-header active" @click="stop(player)">
                    Stop Preview on <span class="accent">{{ player.pin }}</span>
                  </div>
                  <div class="button" @click="stop(player)">
                    <div class="icon stop"></div>
                  </div>
                </li>
                <li v-if="player.artwork.controls.length" :key="player.key + '-remote'" class="display-controls">
                  <div class="header">Remote for <span class="accent">{{ player.pin }}</span></div>
                  <remote-control :controls="player.artwork.controls" :displayId="player.pin"
                    @select="sendControl(player, $event)" />
                </li>
              </template>
            </template>
          </ul>
          <div v-if="accountId" class="row">
            <router-link :to="'/account/artwork/' + id + '/edit'" class="button">
              <div class="icon edit"></div>
            </router-link>
            <button v-if="!artwork.published" @click="togglePublished(true)">Publish</button>
            <button v-if="artwork.published" @click="togglePublished(false)">Unpublish</button>
            <button @click="removeArtwork">Delete</button>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useRouteParams } from '@vueuse/router'
import { db } from '../../firebase-app'
import { ref as dbRef, remove, update } from 'firebase/database'
import AttachmentPanel from '../elements/AttachmentsPanel.vue'
import RemoteControl from '../elements/RemoteControl.vue'
import { log } from '../../helper'
import { PlayerArtwork } from '../../models/PlayerArtwork'
import { Artwork } from '../../models/ArtworkData'
import { Player } from '../../models/Player'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'

const storeInstance = useStore()
const router = useRouter()
const id = useRouteParams('id')

const setupIndex = ref(0)

const userAccount = computed(() => storeInstance.state.userAccount)

const sourceDescription = computed(() => {
  if (setup.value && setup.value.channels.length && setup.value.channels[0].source) {
    return setup.value.channels[0].source.toString()
  }
})

const images = computed(() => {
  return setup.value ? setup.value.thumbnails : []
})

const video = computed(() => {
  return setup.value ? setup.value.preview : null
})

const setup = computed(() => {
  if (artwork.value && artwork.value.setups.length) {
    return artwork.value.setups[setupIndex.value]
  } else {
    return null
  }
})

const accountId = computed(() => userAccount.value ? userAccount.value['.key'] : null)

const { data: accountArtwork } = useFirebaseBinding(computed(() => {
  if (id.value) {
    if (accountId.value) {
      return 'accounts/' + accountId.value + '/artworks/' + id.value
    }
    return 'artworks/' + id.value
  }
  return null
}))

const playersPath = computed(() => accountId.value ? 'accounts/' + accountId.value + '/players' : null)
const { data: accountPlayersData } = useFirebaseBinding(playersPath)

const accountPlayers = computed(() => {
  if (accountPlayersData.value) {
    return Object.keys(accountPlayersData.value).map(key => ({ ...accountPlayersData.value[key], '.key': key }))
  }
  return []
})

const players = computed(() => {
  return accountPlayers.value.map(player => Player.fromJson(player)).filter(player => player.connected)
})

const artwork = computed(() => accountArtwork.value ? Artwork.fromJson(accountArtwork.value) : null)

const launch = (player) => {
  if (!accountId.value || !artwork.value) {
    return
  }
  const path = 'accounts/' + accountId.value + '/players/' + player.key + '/artwork/'
  const values = PlayerArtwork.fromArtwork(id.value, artwork.value).toUpdates(path, PlayerArtwork.empty())
  const pathRef = dbRef(db, path)
  remove(pathRef).then(() => {
    return update(dbRef(db), values)
  }).catch(log)
}

const stop = (player) => {
  if (!accountId.value || !artwork.value) {
    return
  }
}

const sendControl = (player, position) => {
}

const togglePublished = (published) => {
  if (!accountId.value) {
    return
  }
}

const removeArtwork = () => {
  if (!accountId.value) {
    return
  }
  router.push('/artworks')
}
</script>
