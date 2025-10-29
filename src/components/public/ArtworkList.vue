<template>
  <main>
    <div class="wrap-content grid" id="main-grid">
      <ArtworkItem v-for="artwork in artworks" :artwork="artwork" :key="artwork.key" :uri="'/artwork/' + artwork.key" />
      <router-link v-if="accountId" to="/account/artwork/new" class="grid-cell button frameless" title="Add Artwork">
        <i class="plus large"></i>
      </router-link>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Artwork } from '../../models/ArtworkData'
import ArtworkItem from '../elements/ArtworkItem.vue'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'

const store = useStore()
const accountId = computed(() => store.state.userAccount ? store.state.userAccount['.key'] : null)
const path = computed(() => accountId.value ? 'accounts/' + accountId.value + '/artworks' : 'artworks')
const { data: artworks } = useFirebaseBinding(path, { transform: Artwork.fromJson })
</script>
