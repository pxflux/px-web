<template>
  <main>
    <div class="wrap-content">
      <div class="content">
        <h1>Download</h1>
        <div class="card-stack">
          <a :href="distribute.macos.directUrl" class="card">
            <div class="photo">
              <img class="small player-ico" src="/img/pxflux-player-icon-v5-128px.png" alt="pxflux-player-icon">
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
import { computed } from 'vue'
import { useFirebaseBinding } from '../../composables/useFirebaseBinding'

const path = computed(() => 'config')
const { data: config } = useFirebaseBinding(path, { isList: false, defaultValue: {} })
const distribute = computed(() => config.value?.distribute ?? { macos: {} })
</script>
