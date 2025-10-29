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
const accountPlace = computed(() => storeInstance.state.accountPlace)

const accountId = computed(() => {
  if (!userAccount.value) {
    return null
  }
  return userAccount.value['.key']
})

const placeId = computed(() => {
  return route.params.id
})

const image = computed(() => {
  return accountPlace.value && accountPlace.value.image ? accountPlace.value.image : {
    displayUrl: null,
    storageUri: null
  }
})

const init = () => {
  if (accountId.value) {
    storeInstance.dispatch('setRef', {
      key: 'accountPlace',
      ref: dbRef(db, 'accounts/' + accountId.value + '/places/' + placeId.value)
    })
  }
}

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
