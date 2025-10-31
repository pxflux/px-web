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
import { Artwork } from '../../models/ArtworkData'
import ArtworkItem from '../elements/ArtworkItem.vue'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'
import { useAuth } from '../../composables/useAuth'

const { userAccount } = useAuth()
const accountId = computed(() => userAccount.value ? userAccount.value['.key'] : null)
const path = computed(() => accountId.value ? 'accounts/' + accountId.value + '/artworks' : 'artworks')
const { data: artworks } = useFirebaseBinding(path, { transform: Artwork.fromJson })
</script>
