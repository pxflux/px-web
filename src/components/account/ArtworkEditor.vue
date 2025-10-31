<template>
  <main>
    <div v-if="artwork" class="wrap-content wrap-forms">
      <form id="form-artwork" @submit.prevent>
        <section class="editor-section">
          <div class="row">
            <label for="title"><span>Title</span></label>
            <div class="field">
              <input id="title" type="text" v-model.trim="artwork.title" required="required">
            </div>
          </div>
          <div class="work-specifications">
            <section>
              <artwork-setup-editor v-model="artwork.setups"/>
            </section>
            <section>
              <div class="row">
                <label><span>Remote Control</span></label>
                <div class="field">
                  <remote-control-editor v-model="artwork.controls"/>
                </div>
              </div>
            </section>
          </div>
          <div class="row">
            <label><span>By</span></label>
            <div class="field">
              <contributors-editor v-model="artwork.artists"/>
            </div>
          </div>
          <div class="row">
            <label><span>Credits</span></label>
            <div class="field">
              <contributors-editor v-model="artwork.credits" :withRoles="true"/>
            </div>
          </div>
          <div class="row">
            <label for="year"><span>Year</span></label>
            <div class="field">
              <input id="year" type="text" v-model.trim="artwork.year" required="required">
            </div>
          </div>
          <div class="row">
            <label for="description"><span>Description</span></label>
            <div class="field">
              <textarea id="description" v-model.trim="artwork.description"></textarea>
            </div>
          </div>
        </section>
        <footer class="editor-section">
          <router-link v-if="isNew" to="/artworks" class="button frameless">Cancel</router-link>
          <router-link v-if="! isNew" :to="'/artwork/' + artworkId" class="button frameless">Cancel</router-link>
          <button v-if="isNew" @click="submitArtwork" class="frameless">Create</button>
          <button v-if="! isNew" @click="submitArtwork" class="frameless">Save</button>
        </footer>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRouteParams } from '@vueuse/router'
import { ref as dbRef, update } from 'firebase/database'
import { db } from '../../firebase-app'
import { Artwork } from '../../models/ArtworkData'
import { log } from '../../helper'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'
import { useAuth } from '../../composables/useAuth'

import RemoteControlEditor from '../elements/RemoteControlEditor.vue'
import ContributorsEditor from '../elements/ContributorsEditor.vue'
import VideoAttachmentEditor from '../elements/VideoAttachmentEditor.vue'
import ImageAttachmentEditor from '../elements/ImageAttachmentEditor.vue'
import ArtworkSetupEditor from '../elements/ArtworkSetupEditor.vue'

const props = defineProps({
  isNew: Boolean
})

const { accountId } = useAuth()
const router = useRouter()

const artwork = ref(Artwork.empty())
const artworkId = useRouteParams('id')

const artworkPath = computed(() => props.isNew && accountId.value && artworkId.value ? 'accounts/' + accountId.value + '/artworks/' + artworkId.value : null)
const { data: accountArtwork } = useFirebaseBinding(artworkPath, { isList: false, defaultValue: {} })

const submitArtwork = () => {
  if (!accountId.value) {
    return
  }
  const path = 'accounts/' + accountId.value + '/artworks/'
  const id = props.isNew ? dbRef(db, path).push().key : artworkId.value
  const original = props.isNew ? Artwork.empty() : Artwork.fromJson(accountArtwork.value)
  const values = artwork.value.toUpdates(path + id + '/', original)
  update(dbRef(db), values).then(() => {
    router.push('/artwork/' + id)
  }).catch(log)
}

watch(accountArtwork, () => {
  artwork.value = Artwork.fromJson(accountArtwork.value)
})
</script>
