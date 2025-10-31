<template>
  <main v-if="artwork">
    <attachment-panel :video="video" :images="images" />
    <div class="wrap-content">
      <div class="content">
        <h1 :title="artwork.title">{{ artwork.title }}</h1>
        <ul v-if="artwork.artists.length" class="by-string">
          <li v-for="artist in artwork.artists" :key="artist.key">
            <router-link :to="'/artist/' + artist.key">{{ artist.fullName }}</router-link>
          </li>
        </ul>
        <p class="work-meta caption">
          <span v-show="artwork.year">{{ artwork.year }}</span>
          <span>{{ sourceDescription }}</span>
          <span>no sound</span>
          <span>Javascript</span>
        </p>
        <section class="description">
          {{ artwork.description }}
        </section>
        <section class="credits">
          Credits
          <ul v-if="artwork.credits.length" class="credits-string">
            <li v-for="person in artwork.credits" :key="person.key">
              <span :to="'/artist/' + person.key">{{ person.fullName }}: <i>{{ person.role }}</i></span>
            </li>
          </ul>
        </section>
      </div>

      <div class="sidebar">
        <section class="social">
          <div class="row">
            <div class="button square">
              <div class="icon star">like</div>
            </div>
            <div class="button square">
              <div class="icon share">share</div>
            </div>
          </div>
        </section>
        <section class="actions">
          <div class="row">
            <div class="cell row-header">Add to Collection</div>
            <div class="button">
              <div class="icon plus"></div>
            </div>
          </div>
          <artwork-player-list
            v-if="accountId"
            :account-id="accountId"
            :artwork="artwork"
          />
          <div v-if="accountId" class="row">
            <router-link :to="'/account/artwork/' + id + '/edit'" class="button">
              <div class="icon edit"></div>
            </router-link>
            <button v-if="!artwork.published" @click="togglePublished(true)">Publish</button>
            <button v-if="artwork.published" @click="togglePublished(false)">Unpublish</button>
            <button @click="removeArtwork">Delete</button>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRouteParams } from '@vueuse/router'
import AttachmentPanel from '../elements/AttachmentsPanel.vue'
import ArtworkPlayerList from './ArtworkPlayerList.vue'
import { Artwork } from '../../models/ArtworkData'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'
import { useAuth } from '../../composables/useAuth'
import { ref as dbRef, remove, update } from 'firebase/database'
import { db } from '../../firebase-app'
import { log } from '../../helper'

const { userAccount } = useAuth()
const router = useRouter()
const id = useRouteParams('id')

const setupIndex = ref(0)

const accountId = computed(() => userAccount.value ? userAccount.value['.key'] : null)

const setup = computed(() => artwork.value?.setups?.[setupIndex.value] ?? null)
const sourceDescription = computed(() => setup.value?.channels?.[0]?.source?.toString() || '')
const images = computed(() => setup.value?.thumbnails || [])
const video = computed(() => setup.value?.preview || null)

const { data: artwork } = useFirebaseBinding(computed(() => {
  if (id.value) {
    if (accountId.value) {
      return 'accounts/' + accountId.value + '/artworks/' + id.value
    }
    return 'artworks/' + id.value
  }
  return null
}), { transform: Artwork.fromJson, isList: false, defaultValue: null })

const togglePublished = (published) => {
  if (!accountId.value) {
    return
  }
  update(dbRef(db, 'accounts/' + accountId.value + '/artworks/' + id.value), { published }).catch(log)
}

const removeArtwork = () => {
  if (!accountId.value) {
    return
  }
  remove(dbRef(db, 'accounts/' + accountId.value + '/artworks/' + id.value)).then(() => {
    router.push('/artworks')
  }).catch(log)
}
</script>
