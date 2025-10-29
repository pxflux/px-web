<template>
  <main>
    <div v-if="user && accountIteration" class="wrap-content text-block">
      <span v-show="!title.edit" @click="toggleTitle()">{{ title.val }}</span>
      <input v-show="title.edit" type="text" ref="inputTitle" v-model="title.val" @blur="saveTitle()">

      <button v-if="accountIteration['.key'] === 'draft'" @click="publishIteration" class="button">Publish</button>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref as dbRef, update } from 'firebase/database'
import { db } from '../../firebase-app'
import { log } from '../../helper'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'

const storeInstance = useStore()
const route = useRoute()

const inputTitle = ref(null)
const title = ref({
  val: '',
  edit: false
})

const user = computed(() => storeInstance.state.user)

const path = computed(() => {
  if (user.value?.uid && route.params.artworkId && route.params.id) {
    return 'users/' + user.value.uid + '/artworks/' + route.params.artworkId + '/iterations/' + route.params.id
  }
  return null
})

const { data: accountIteration } = useFirebaseBinding(path, { isList: false, defaultValue: {} })

const toggleTitle = () => {
  title.value.edit = !title.value.edit
  if (title.value.edit) {
    nextTick(() => {
      inputTitle.value?.focus()
    })
  }
}

const saveTitle = () => {
  toggleTitle()
  if (path.value) {
    update(dbRef(db, path.value), { 'title': title.value.val }).catch(log)
  }
}

const publishIteration = () => {
}

watch(accountIteration, () => {
  title.value.val = accountIteration.value?.title || 'Untitled'
})
</script>
