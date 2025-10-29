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
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref as dbRef, update } from 'firebase/database'
import { db } from '../../firebase-app'
import { log } from '../../helper'

const storeInstance = useStore()
const route = useRoute()

const inputTitle = ref(null)
const title = ref({
  val: '',
  edit: false
})
let source = null

const user = computed(() => storeInstance.state.user)
const accountIteration = computed(() => storeInstance.state.accountIteration)

const init = () => {
  if (user.value?.uid) {
    source = dbRef(db, 'users/' + user.value.uid + '/artworks/' + route.params.artworkId + '/iterations/' + route.params.id)
    storeInstance.dispatch('setRef', { key: 'accountIteration', ref: source })
  } else {
    source = null
  }
}

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
  if (source) {
    update(source, { 'title': title.value.val }).catch(log)
  }
}

const publishIteration = () => {
}

onMounted(() => {
  init()
})

watch(() => route.path, () => {
  init()
})

watch(user, () => {
  init()
})

watch(accountIteration, () => {
  title.value.val = accountIteration.value?.title || 'Untitled'
})
</script>
