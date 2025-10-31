<template>
  <main>
    <div v-if="userAccount && accountPlace" class="wrap-content text-block">
      <router-link to="/account/places/">Places</router-link>
      <h1>{{ accountPlace.title }}</h1>
      <img v-show="image.displayUrl" :src="image.displayUrl" width="100" height="100">
      <router-link :to="'/account/place/' + placeId + '/edit'" class="button">Update</router-link>
      <button @click="removePlace">Remove</button>
      <button v-if=" ! accountPlace.published"><a @click="togglePublished(true)">Publish</a></button>
      <button v-if="accountPlace.published"><a @click="togglePublished(false)">Un publish</a></button>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRouteParams } from '@vueuse/router'
import { ref as dbRef, remove } from 'firebase/database'
import { db, store } from '../../firebase-app'
import { log } from '../../helper'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'
import { useAuth } from '../../composables/useAuth'

const { userAccount } = useAuth()
const router = useRouter()
const placeId = useRouteParams('id')

const accountId = computed(() => {
  if (!userAccount.value) {
    return null
  }
  return userAccount.value['.key']
})

const path = computed(() => {
  if (accountId.value && placeId.value) {
    return 'accounts/' + accountId.value + '/places/' + placeId.value
  }
  return null
})

const { data: accountPlace } = useFirebaseBinding(path, { isList: false, defaultValue: {} })

const image = computed(() => {
  return accountPlace.value && accountPlace.value.image ? accountPlace.value.image : {
    displayUrl: null,
    storageUri: null
  }
})

const togglePublished = (published) => {
  if (!accountId.value) {
    return
  }
  store(accountId.value, placeId.value, 'places', { published: published }).catch(log)
}

const removePlace = () => {
  if (!accountId.value) {
    return
  }
  remove(dbRef(db, 'accounts/' + accountId.value + '/places/' + placeId.value)).then(() => {
    router.push('/account/places')
  }).catch(log)
}
</script>
