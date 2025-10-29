<template>
  <main>
    <div v-if="userAccount" class="wrap-content text-block">
      <router-link to="/account/places/">Places</router-link>
      <template v-if="! isNew">
        &gt;
        <router-link :to="'/account/place/' + placeId">{{ accountPlace.title }}</router-link>
      </template>
      <form id="form-place">
        <fieldset>
          <label>Image</label>
          <image-upload :imageUrl="image.displayUrl" @input-file="setImageFile" @remove-image="setImageRemoved"></image-upload>
        </fieldset>
        <fieldset>
          <label>Title</label>
          <input type="text" v-model.trim="title" title="Place title" required="required">
        </fieldset>

        <router-link v-if="isNew" to="/account/places">Cancel</router-link>
        <router-link v-if="! isNew" :to="'/account/place/' + placeId">Cancel</router-link>
        <button v-if="isNew" @click.prevent="submitPlace">Create</button>
        <button v-if="! isNew" @click.prevent="submitPlace">Save</button>
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

const props = defineProps({
  isNew: Boolean
})

const storeInstance = useStore()
const route = useRoute()
const router = useRouter()

const imageFile = ref(null)
const imageRemoved = ref(false)
const title = ref('')

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

const published = computed(() => {
  return accountPlace.value && accountPlace.value.published ? accountPlace.value.published : false
})

const image = computed(() => {
  return accountPlace.value && accountPlace.value.image ? accountPlace.value.image : {
    displayUrl: null,
    storageUri: null
  }
})

const init = () => {
  if (!props.isNew && accountId.value) {
    storeInstance.dispatch('setRef', {
      key: 'accountPlace',
      ref: dbRef(db, 'accounts/' + accountId.value + '/places/' + placeId.value)
    })
  }
}

const setImageFile = (file) => {
  imageFile.value = file
}

const setImageRemoved = (flag) => {
  imageRemoved.value = flag
}

const submitPlace = () => {
  if (!accountId.value) {
    return
  }
  const place = {
    published: published.value,
    title: title.value
  }
  store(accountId.value, placeId.value, 'places', place, imageRemoved.value, imageFile.value).then((ref) => {
    router.push('/account/place/' + ref.key)
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

watch(accountPlace, () => {
  title.value = accountPlace.value?.title
})
</script>
