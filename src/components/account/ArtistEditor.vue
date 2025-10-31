<template>
  <main>
    <div v-if="accountId" class="wrap-content wrap-forms">
      <router-link to="/account/artists/">Artists</router-link>
      <template v-if="! isNew">
        &gt;
        <router-link :to="'/account/artist/' + artistId">{{ accountArtist.fullName }}</router-link>
      </template>
      <form id="form-artist" @submit.prevent>
        <section class="editor-section">
          <div class="row">
            <label for="image"><span>Image</span></label>
            <div class="field">
              <image-upload :imageUrl="image.displayUrl" @input-file="setImageFile" @remove-image="setImageRemoved"></image-upload>
            </div>
          </div>
          <div class="row">
            <label for="fullName"><span>Full name</span></label>
            <div class="field">
              <input id="fullName" type="text" v-model.trim="fullName" title="Artist name" required="required">
            </div>
          </div>
        </section>
        <footer class="editor-section">
          <router-link v-if="isNew" to="/account/artists" class="button frameless">Cancel</router-link>
          <router-link v-if="! isNew" :to="'/account/artist/' + artistId" class="button frameless">Cancel</router-link>
          <button v-if="isNew" @click="submitArtist" class="frameless">Create</button>
          <button v-if="! isNew" @click="submitArtist" class="frameless">Save</button>
        </footer>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRouteParams } from '@vueuse/router'
import { db, store } from '../../firebase-app'
import { log } from '../../helper'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'
import { useAuth } from '../../composables/useAuth'
import ImageUpload from '../elements/ImageUpload.vue'
import latinize from 'latinize'

const props = defineProps({
  isNew: Boolean
})

const { accountId } = useAuth()
const router = useRouter()

const imageFile = ref(null)
const imageRemoved = ref(false)
const fullName = ref('')
const artistId = useRouteParams('id')

const artistPath = computed(() => {
  if (!props.isNew && accountId.value && artistId.value) {
    return 'accounts/' + accountId.value + '/artists/' + artistId.value
  }
  return null
})
const { data: accountArtist } = useFirebaseBinding(artistPath, { isList: false, defaultValue: {} })

const published = computed(() => accountArtist.value?.published ?? false)

const image = computed(() => accountArtist.value?.image ?? { displayUrl: null, storageUri: null })

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

watch(accountArtist, () => {
  fullName.value = accountArtist.value?.fullName
})
</script>
