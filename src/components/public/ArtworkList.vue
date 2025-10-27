<template>
  <main>
    <div v-if="userAccount" class="wrap-content grid" id="main-grid">
      <ArtworkItem v-for="artwork in artworks" :artwork="artwork" :key="artwork.key" :uri="'/artwork/' + artwork.key"/>
      <router-link to="/account/artwork/new" class="grid-cell button frameless" title="Add Artwork">
        <i class="plus large"></i>
      </router-link>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import firebaseApp from '../../firebase-app'
import { getDatabase, ref as dbRef } from 'firebase/database'
import { Artwork } from '../../models/ArtworkData'
import ArtworkItem from '../elements/ArtworkItem.vue'

const store = useStore()
const route = useRoute()
const instance = getCurrentInstance()

const accountArtworks = ref([])

const userAccount = computed(() => store.state.userAccount)

const accountId = computed(() => {
  if (!userAccount.value) {
    return null
  }
  return userAccount.value['.key']
})

const artworks = computed(() => {
  if (accountArtworks.value) {
    return accountArtworks.value.map(it => Artwork.fromJson(it))
  }
  return []
})

const init = () => {
  if (accountId.value) {
    const db = getDatabase(firebaseApp)
    instance.proxy.$databaseBind('accountArtworks', dbRef(db, 'accounts/' + accountId.value + '/artworks'))
  }
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
