<template>
  <main>
    <div v-if="userAccount && accountArtist" class="wrap-content text-block">
      <router-link to="/account/artists/">Artists</router-link>
      <h1>{{ accountArtist.fullName }}</h1>
      <img v-show="image.displayUrl" :src="image.displayUrl" width="100" height="100">
      <router-link :to="'/account/artist/' + artistId + '/edit'" class="button">Update</router-link>
      <button @click="removeArtist">Remove</button>
      <button v-if=" ! accountArtist.published"><a @click="togglePublished(true)">Publish</a></button>
      <button v-if="accountArtist.published"><a @click="togglePublished(false)">Un publish</a></button>
    </div>
  </main>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ref as dbRef, remove } from 'firebase/database'
import { db, store } from '../../firebase-app'
import { log } from '../../helper'

const storeInstance = useStore()
const route = useRoute()
const router = useRouter()

const userAccount = computed(() => storeInstance.state.userAccount)
const accountArtist = computed(() => storeInstance.state.accountArtist)

const accountId = computed(() => {
  if (!userAccount.value) {
    return null
  }
  return userAccount.value['.key']
})

const artistId = computed(() => {
  return route.params.id
})

const image = computed(() => {
  return accountArtist.value && accountArtist.value.image ? accountArtist.value.image : {
    displayUrl: null,
    storageUri: null
  }
})

const init = () => {
  if (accountId.value) {
    storeInstance.dispatch('setRef', {
      key: 'accountArtist',
      ref: dbRef(db, 'accounts/' + accountId.value + '/artists/' + artistId.value)
    })
  }
}

const togglePublished = (published) => {
  if (!accountId.value) {
    return
  }
  store(accountId.value, artistId.value, 'artists', { published: published }).catch(log)
}

const removeArtist = () => {
  if (!accountId.value) {
    return
  }
  remove(dbRef(db, 'accounts/' + accountId.value + '/artists/' + artistId.value)).then(() => {
    router.push('/account/artists')
  }).catch(log)
}

onMounted(() => {
  init()
})

watch(() => route.path, () => {
  init()
})

watch(userAccount, () => {
  init()
})
</script>
