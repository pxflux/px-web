<template>
  <main>
    <div class="wrap-content">
      <div class="content">
        <h1>Download</h1>
        <div class="card-stack">
          <!-- Show download link when available -->
          <a v-if="distribute.macos.directUrl" :href="distribute.macos.directUrl" class="card">
            <div class="photo">
              <img class="small player-ico" src="/static/img/pxflux-player-icon-v5-128px.png" alt="pxflux-player-icon">
            </div>
            <div class="info">
              <span class="h3">pxPlayer</span> v.0.01 alpha<br>
              for Mac OS (10.12)
            </div>
          </a>

          <!-- Show loading state while fetching config -->
          <div v-else-if="loading" class="card loading">
            <div class="photo">
              <img class="small player-ico" src="/static/img/pxflux-player-icon-v5-128px.png" alt="pxflux-player-icon">
            </div>
            <div class="info">
              <span class="h3">pxPlayer</span> v.0.01 alpha<br>
              for Mac OS (10.12)<br>
              <small>Loading download...</small>
            </div>
          </div>

          <!-- Show unavailable message when config is loaded but no download URL -->
          <div v-else class="card unavailable">
            <div class="photo">
              <img class="small player-ico" src="/static/img/pxflux-player-icon-v5-128px.png" alt="pxflux-player-icon">
            </div>
            <div class="info">
              <span class="h3">pxPlayer</span> v.0.01 alpha<br>
              for Mac OS (10.12)<br>
              <small>Download temporarily unavailable</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import { useFirebaseBinding } from '../../composables/useFirebaseBinding'
  import { computed, ref, watch } from 'vue'

  export default {
    setup() {
      const { data: config, bind } = useFirebaseBinding('config')
      const loading = ref(true)

      // Watch for config changes to determine loading state
      watch(config, (newConfig) => {
        loading.value = newConfig === null
      }, { immediate: true })

      const distribute = computed(() => {
        if (config.value && config.value.distribute) {
          return config.value.distribute
        }
        return { macos: {} }
      })

      return {
        config,
        distribute,
        loading
      }
    }
  }
</script>

<style scoped>
.card.loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.card.unavailable {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
}

.card.unavailable small {
  color: #999;
  font-style: italic;
}

.card.loading small {
  color: #666;
  font-style: italic;
}
</style>
