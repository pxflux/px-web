<template>
  <main>
    <div v-if="userAccount && accountShow" class="wrap-content text-block">
      <router-link to="/account/shows/">Shows</router-link>
      <h1>{{ accountShow.title }}</h1>
      <img v-show="image.displayUrl" :src="image.displayUrl" width="100" height="100">
      <h2>Places</h2>
      <ul>
        <li v-for="place in places" :key="place['.key']">
          <router-link :to="'/places/' + place['.key']">{{ place.title }}</router-link>
        </li>
      </ul>
      <router-link :to="'/account/show/' + showId + '/edit'" class="button">Update</router-link>
      <button @click="removeShow">Remove</button>
      <button v-if=" ! accountShow.published"><a @click="togglePublished(true)">Publish</a></button>
      <button v-if="accountShow.published"><a @click="togglePublished(false)">Un publish</a></button>
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
const accountShow = computed(() => storeInstance.state.accountShow)

const accountId = computed(() => {
  if (!userAccount.value) {
    return null
  }
  return userAccount.value['.key']
})

const showId = computed(() => {
  return route.params.id
})

const image = computed(() => {
  return accountShow.value && accountShow.value.image ? accountShow.value.image : {
    displayUrl: null,
    storageUri: null
  }
})

const places = computed(() => {
  return Object.keys(accountShow.value?.places || {}).map(id => {
    return { ...accountShow.value.places[id], ...{ '.key': id } }
  })
})

const init = () => {
  if (accountId.value) {
    storeInstance.dispatch('setRef', {
      key: 'accountShow',
      ref: dbRef(db, 'accounts/' + accountId.value + '/shows/' + showId.value)
    })
  }
}

const togglePublished = (published) => {
  if (!accountId.value) {
    return
  }
  store(accountId.value, showId.value, 'shows', { published: published }).catch(log)
}

const removeShow = () => {
  if (!accountId.value) {
    return
  }
  remove(dbRef(db, 'accounts/' + accountId.value + '/shows/' + showId.value)).then(() => {
    router.push('/account/shows')
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
