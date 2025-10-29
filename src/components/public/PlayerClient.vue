<template>
  <main>
    <div class="wrap-content">
      <div class="content">
        <form v-if="!playerPin" id="form-player-new" @submit.prevent="accept">
          <label>Pin</label>
          <input type="text" v-model="pin0" required="required" size="2" maxlength="1" @change="setPin"
                 :disabled="pinReady"/>
          <input type="text" v-model="pin1" required="required" size="2" maxlength="1" @change="setPin"
                 :disabled="pinReady"/>
          <input type="text" v-model="pin2" required="required" size="2" maxlength="1" @change="setPin"
                 :disabled="pinReady"/>
          <input type="text" v-model="pin3" required="required" size="2" maxlength="1" @change="setPin"
                 :disabled="pinReady"/>
          <input type="text" v-model="pin4" required="required" size="2" maxlength="1" @change="setPin"
                 :disabled="pinReady"/>
          <input type="text" v-model="pin5" required="required" size="2" maxlength="1" @change="setPin"
                 :disabled="pinReady"/>
        </form>
        <p v-if="playerPin && !artwork">No artwork</p>
        <template v-if="playerPin && artwork">
          <h1 :title="artwork.title">{{ artwork.title }}</h1>
          <ul v-if="artists.length" class="by-string">
            <li v-for="artist in artists" :key="artist['__key']">
              <router-link :to="'/artist/' + artist['.key']">{{ artist.fullName }}</router-link>
            </li>
          </ul>
          <p class="work-meta caption">
            <span v-show="artwork.year">{{ artwork.year }}</span>
          </p>
          <remote-control v-if="controls.length > 0" :controls="controls" @select="sendControl($event)"/>
        </template>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref as dbRef, push } from 'firebase/database'
import { db } from '@/firebase-app'
import { log } from '../../helper'
import RemoteControl from '../elements/RemoteControl.vue'

const storeInstance = useStore()
const route = useRoute()

const pin0 = ref('')
const pin1 = ref('')
const pin2 = ref('')
const pin3 = ref('')
const pin4 = ref('')
const pin5 = ref('')

const playerPin = computed(() => storeInstance.state.playerPin)

const playerId = computed(() => {
  return route.params.id
})

const pin = computed(() => {
  return pin0.value + pin1.value + pin2.value + pin3.value + pin4.value + pin5.value
})

const pinReady = computed(() => {
  return pin.value > 100000
})

const artwork = computed(() => {
  if (playerPin.value) {
    return playerPin.value.artwork
  }
  return null
})

const artists = computed(() => {
  if (artwork.value) {
    return Object.keys(artwork.value.artists || {}).map(id => {
      return { ...artwork.value.artists[id], ...{ '.key': id } }
    })
  }
  return []
})

const controls = computed(() => {
  if (artwork.value) {
    return artwork.value.controls || []
  }
  return []
})

const setPin = () => {
  init()
}

const init = () => {
  if (route.params.id > 100000 && route.params.id < 999999) {
    const value = route.params.id.split('')
    if (!pin0.value) {
      pin0.value = value[0]
    }
    if (!pin1.value) {
      pin1.value = value[1]
    }
    if (!pin2.value) {
      pin2.value = value[2]
    }
    if (!pin3.value) {
      pin3.value = value[3]
    }
    if (!pin4.value) {
      pin4.value = value[4]
    }
    if (!pin5.value) {
      pin5.value = value[5]
    }
  }
  if (pinReady.value) {
    storeInstance.commit('SET_LOADING', true)
    storeInstance.dispatch('setRef', { key: 'playerPin', ref: dbRef(db, 'player-pins/' + pin.value) })
  }
}

const sendControl = (position) => {
  push(dbRef(db, 'commands/' + pin.value), { controlId: '' + position }).catch(log)
}

onMounted(() => {
  init()
})

watch(() => route.path, () => {
  init()
})
</script>
