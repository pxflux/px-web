<template>
  <main>
    <div v-if="accountId && accountArtist" class="wrap-content text-block">
      <router-link to="/account/artists/">Artists</router-link>
      <h1>{{ accountArtist.fullName }}</h1>
      <img v-show="image.displayUrl" :src="image.displayUrl" width="100" height="100">
      <router-link :to="'/account/artist/' + artistId + '/edit'" class="button">Update</router-link>
      <button @click="removeArtist">Remove</button>
      <button v-if="!accountArtist.published"><a @click="togglePublished(true)">Publish</a></button>
      <button v-if="accountArtist.published"><a @click="togglePublished(false)">Un publish</a></button>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRouteParams } from '@vueuse/router'
import { ref as dbRef, remove, update } from 'firebase/database'
import { db } from '../../firebase-app'
import { log } from '../../helper'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'
import { useAuth } from '../../composables/useAuth'

const { accountId } = useAuth()
const router = useRouter()
const artistId = useRouteParams('id')

const path = computed(() => {
  if (accountId.value && artistId.value) {
    return 'accounts/' + accountId.value + '/artists/' + artistId.value
  }
  return null
})

const { data: accountArtist } = useFirebaseBinding(path, { isList: false, defaultValue: {} })

const image = computed(() => accountArtist.value?.image ?? { displayUrl: null, storageUri: null })

const togglePublished = (published) => {
  if (!accountId.value) {
    return
  }
  update(dbRef(db, 'accounts/' + accountId.value + '/artists/' + artistId.value), { published: published }).catch(log)
}

const removeArtist = () => {
  if (!accountId.value) {
    return
  }
  remove(dbRef(db, 'accounts/' + accountId.value + '/artists/' + artistId.value)).then(() => {
    router.push('/account/artists')
  }).catch(log)
}
</script>
