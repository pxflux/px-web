<template>
  <main>
    <div class="wrap-content">
      <div class="content">
        <h1>Download</h1>
        <div class="card-stack">
          <a :href="distribute.macos.directUrl" class="card">
            <div class="photo">
              <img class="small player-ico" src="/static/img/pxflux-player-icon-v5-128px.png" alt="pxflux-player-icon">
            </div>
            <div class="info">
              <span class="h3">pxPlayer</span> v.0.01 alpha<br>
              for Mac OS (10.12)
            </div>
          </a>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref } from 'firebase/database'
import { db } from '@/firebase-app'

const storeInstance = useStore()
const route = useRoute()

const config = computed(() => storeInstance.state.config)

const distribute = computed(() => {
  if (config.value) {
    return config.value.distribute
  }
  return { macos: {} }
})

const init = () => {
  storeInstance.dispatch('setRef', { key: 'config', ref: ref(db, 'config') })
}

onMounted(() => {
  init()
})

watch(() => route.path, () => {
  init()
})
</script>
