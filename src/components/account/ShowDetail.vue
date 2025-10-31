<template>
  <main>
    <div v-if="accountId && accountShow" class="wrap-content text-block">
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
      <button v-if="!accountShow.published"><a @click="togglePublished(true)">Publish</a></button>
      <button v-if="accountShow.published"><a @click="togglePublished(false)">Un publish</a></button>
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
const showId = useRouteParams('id')

const path = computed(() => accountId.value && showId.value ? 'accounts/' + accountId.value + '/shows/' + showId.value : null)
const { data: accountShow } = useFirebaseBinding(path, { isList: false, defaultValue: {} })

const image = computed(() => accountShow.value?.image ?? { displayUrl: null, storageUri: null })
const places = computed(() => Object.entries(accountShow.value?.places || {}).map(([ id, place ]) => ({ ['.key']: id, ...place })))

const togglePublished = (published) => {
  if (!accountId.value) {
    return
  }
  update(dbRef(db, 'accounts/' + accountId.value + '/shows/' + showId.value), { published: published }).catch(log)
}

const removeShow = () => {
  if (!accountId.value) {
    return
  }
  remove(dbRef(db, 'accounts/' + accountId.value + '/shows/' + showId.value)).then(() => {
    router.push('/account/shows')
  }).catch(log)
}
</script>
