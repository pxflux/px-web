<template>
  <main>
    <div v-if="userAccount" class="wrap-content text-block">
      <router-link to="/account/artists/">Artists</router-link>
      <template v-if="! isNew">
        &gt;
        <router-link :to="'/account/artist/' + artistId">{{ accountArtist.fullName }}</router-link>
      </template>
      <form id="form-artist">
        <fieldset>
          <label>Image</label>
          <image-upload :imageUrl="image.displayUrl" @input-file="setImageFile" @remove-image="setImageRemoved"></image-upload>
        </fieldset>
        <fieldset>
          <label>Full name</label>
          <input type="text" v-model.trim="fullName" title="Artist name" required="required">
        </fieldset>

        <router-link v-if="isNew" to="/account/artists">Cancel</router-link>
        <router-link v-if="! isNew" :to="'/account/artist/' + artistId">Cancel</router-link>
        <button v-if="isNew" @click.prevent="submitArtist">Create</button>
        <button v-if="! isNew" @click.prevent="submitArtist">Save</button>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ref as dbRef } from 'firebase/database'
import { db, store } from '../../firebase-app'
import { log } from '../../helper'
import ImageUpload from '../elements/ImageUpload.vue'
import latinize from 'latinize'

const props = defineProps({
  isNew: Boolean
})

const storeInstance = useStore()
const route = useRoute()
const router = useRouter()

const imageFile = ref(null)
const imageRemoved = ref(false)
const fullName = ref('')

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

const published = computed(() => {
  return accountArtist.value && accountArtist.value.published ? accountArtist.value.published : false
})

const image = computed(() => {
  return accountArtist.value && accountArtist.value.image ? accountArtist.value.image : {
    displayUrl: null,
    storageUri: null
  }
})

const init = () => {
  if (!props.isNew && accountId.value) {
    storeInstance.dispatch('setRef', {
      key: 'accountArtist',
      ref: dbRef(db, 'accounts/' + accountId.value + '/artists/' + artistId.value)
    })
  }
}

const setImageFile = (file) => {
  imageFile.value = file
}

const setImageRemoved = (flag) => {
  imageRemoved.value = flag
}

const submitArtist = () => {
  if (!accountId.value) {
    return
  }
  const artist = {
    published: published.value,
    fullName: fullName.value,
    _search_index: {
      full_name: latinize(fullName.value.toLowerCase()),
      reversed_full_name: latinize(fullName.value.toLowerCase().split(' ').reverse().join(' '))
    }
  }
  store(accountId.value, artistId.value, 'artists', artist, imageRemoved.value, imageFile.value).then((ref) => {
    router.push('/account/artist/' + ref.key)
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

watch(accountArtist, () => {
  fullName.value = accountArtist.value?.fullName
})
</script>
