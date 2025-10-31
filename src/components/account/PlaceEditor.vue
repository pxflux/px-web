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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRouteParams } from '@vueuse/router'
import { store } from '../../firebase-app'
import { log } from '../../helper'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'
import { useAuth } from '../../composables/useAuth'
import ImageUpload from '../elements/ImageUpload.vue'

const props = defineProps({
  isNew: Boolean
})

const { userAccount } = useAuth()
const router = useRouter()

const imageFile = ref(null)
const imageRemoved = ref(false)
const title = ref('')
const placeId = useRouteParams('id')

const accountId = computed(() => userAccount.value?.['.key'] ?? null)

const placePath = computed(() => {
  if (!props.isNew && accountId.value && placeId.value) {
    return 'accounts/' + accountId.value + '/places/' + placeId.value
  }
  return null
})

const { data: accountPlace } = useFirebaseBinding(placePath, { isList: false, defaultValue: {} })

const published = computed(() => accountPlace.value?.published ? accountPlace.value.published : false)

const image = computed(() => {
  return accountPlace.value?.image ?? {
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

watch(accountPlace, () => {
  title.value = accountPlace.value?.title
})
</script>
