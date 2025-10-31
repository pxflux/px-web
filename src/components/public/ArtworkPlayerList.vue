<template>
  <ul v-if="players.length">
    <template v-for="player in players" :key="player.key">
      <template v-if="!player.artwork">
        <li class="row" :key="player.key">
          <div class="cell row-header" @click="launch(player.key)">
            Preview on Display <span class="accent">{{ player.pin }}</span>
          </div>
          <div class="button" @click="launch(player.key)">
            <div class="icon display play"></div>
          </div>
        </li>
      </template>
      <template v-if="player.isArtworkLaunched(artwork.key)">
        <li class="row" :key="player.key">
          <div class="cell row-header active" @click="stop(player.key)">
            Stop Preview on <span class="accent">{{ player.pin }}</span>
          </div>
          <div class="button" @click="stop(player.key)">
            <div class="icon stop"></div>
          </div>
        </li>
        <li v-if="player.artwork.controls.length" :key="player.key + '-remote'" class="display-controls">
          <div class="header">Remote for <span class="accent">{{ player.pin }}</span></div>
          <remote-control :controls="player.artwork.controls" :displayId="player.pin"
            @select="sendControl(player.pin, $event)" />
        </li>
      </template>
    </template>
  </ul>
</template>

<script setup>
import { computed } from 'vue'
import RemoteControl from '../elements/RemoteControl.vue'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'
import { Player } from '../../models/Player'
import { db } from '../../firebase-app'
import { ref as dbRef, remove, update, push } from 'firebase/database'
import { PlayerArtwork } from '../../models/PlayerArtwork'
import { log } from '../../helper'

const props = defineProps({
  accountId: {
    type: String,
    required: true
  },
  artwork: {
    type: Object,
    required: true
  }
})

const path = computed(() => props.accountId ? 'accounts/' + props.accountId + '/players' : null)
const { data: data } = useFirebaseBinding(path, { transform: Player.fromJson })
const players = computed(() => data.value?.filter(player => player.connected) ?? [])

const launch = (playerId) => {
  if (!props.accountId || !props.artwork) {
    return
  }
  const playerPath = 'accounts/' + props.accountId + '/players/' + playerId + '/artwork/'
  const values = PlayerArtwork.fromArtwork(props.artwork.key, props.artwork).toUpdates(playerPath, PlayerArtwork.empty())
  remove(dbRef(db, playerPath)).then(() => {
    return update(dbRef(db), values)
  }).catch(log)
}

const stop = (playerId) => {
  if (!props.accountId || !props.artwork) {
    return
  }
  remove(dbRef(db, 'accounts/' + this.accountId + '/players/' + playerId + '/artwork')).catch(log)
}

const sendControl = (pin, position) => {
  push(dbRef(db, 'commands/' + pin), { controlId: `${position}` }).catch(log)
}
</script>

