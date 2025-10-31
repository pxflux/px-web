<template>
  <transition mode="out-in" name="fade">
    <router-link :to="uri" class="item-wrap grid-cell">
      <div class="grid-cell-border"></div>
      <div class="item-image-wrap">
        <img v-if="thumbnail" :src="thumbnail.displayUrl" class="item-image">
        <div v-else class="item-image no-image"></div>
      </div>
      <div class="item-description">
        <span :title="artwork.title" class="item-title">{{ artwork.title }}</span>
        <span v-if="artists" class="item-genre">{{ artists }}</span>
      </div>
    </router-link>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  artwork: {
    type: Object,
    required: true
  },
  uri: {
    type: String,
    required: true
  }
})

const thumbnail = computed(() => {
  if (props.artwork.setups.length && props.artwork.setups[0].thumbnails.length) {
    return props.artwork.setups[0].thumbnails[0].storage
  }
  return null
})

const artists = computed(() => props.artwork.artists.map(artist => artist.fullName).join(', '))
</script>
