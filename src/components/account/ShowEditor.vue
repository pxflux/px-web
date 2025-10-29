<template>
  <main>
    <div v-if="userAccount" class="wrap-content text-block">
      <router-link to="/account/shows/">Shows</router-link>
      <template v-if="! isNew">
        &gt;
        <router-link :to="'/account/show/' + showId">{{ accountShow.title }}</router-link>
      </template>
      <form id="form-show">
        <fieldset>
          <label>Image</label>
          <image-upload :imageUrl="image.displayUrl" @input-file="setImageFile" @remove-image="setImageRemoved"></image-upload>
        </fieldset>
        <fieldset>
          <label>Title</label>
          <input type="text" v-model.trim="title" title="Show title" required="required">
        </fieldset>
        <fieldset>
          <label>Places</label>
          <select v-model="selectedPlaceIds" multiple required>
            <option v-for="place in places" v-bind:value="place['.key']">{{ place.title }}</option>
          </select>
        </fieldset>

        <router-link v-if="isNew" to="/account/shows">Cancel</router-link>
        <router-link v-if="! isNew" :to="'/account/show/' + showId">Cancel</router-link>
        <button v-if="isNew" @click.prevent="submitShow">Create</button>
        <button v-if="! isNew" @click.prevent="submitShow">Save</button>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useRouteParams } from '@vueuse/router'
import { db, store } from '../../firebase-app'
import { log } from '../../helper'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'
import ImageUpload from '../elements/ImageUpload.vue'

const props = defineProps({
  isNew: Boolean
})

const storeInstance = useStore()
const router = useRouter()

const imageFile = ref(null)
const imageRemoved = ref(false)
const title = ref('')
const selectedPlaceIds = ref([])

const userAccount = computed(() => storeInstance.state.userAccount)
const showId = useRouteParams('id')

const accountId = computed(() => {
  if (!userAccount.value) {
    return null
  }
  return userAccount.value['.key']
})

const showPath = computed(() => {
  if (!props.isNew && accountId.value && showId.value) {
    return 'accounts/' + accountId.value + '/shows/' + showId.value
  }
  return null
})

const { data: accountShow } = useFirebaseBinding(showPath, { isList: false, defaultValue: {} })

const placesPath = computed(() => 'places')
const { data: places } = useFirebaseBinding(placesPath)

const published = computed(() => {
  return accountShow.value && accountShow.value.published ? accountShow.value.published : false
})

const image = computed(() => {
  return accountShow.value && accountShow.value.image ? accountShow.value.image : {
    displayUrl: null,
    storageUri: null
  }
})

const setImageFile = (file) => {
  imageFile.value = file
}

const setImageRemoved = (flag) => {
  imageRemoved.value = flag
}

const submitShow = () => {
  if (!accountId.value) {
    return
  }
  const show = {
    published: published.value,
    title: title.value,
    places: {}
  }
  places.value.filter(place => selectedPlaceIds.value.includes(place['.key'])).forEach(place => {
    show.places[place['.key']] = { title: place.title }
  })
  store(accountId.value, showId.value, 'shows', show, imageRemoved.value, imageFile.value).then((ref) => {
    router.push('/account/show/' + ref.key)
  }).catch(log)
}

watch(accountShow, () => {
  title.value = accountShow.value?.title
  selectedPlaceIds.value = Object.keys(accountShow.value?.places || {})
})
</script>
