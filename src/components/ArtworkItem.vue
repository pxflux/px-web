<template>
  <transition mode="out-in" name="fade">
    <router-link :to="uri" class="item-wrap grid-cell">
      <div class="item-image-wrap">
        <img v-if="image.displayUrl" :src="image.displayUrl" class="item-image">
        <img v-else src="/static/img/no-preview.png" class="item-image">
      </div>
      <div class="item-description">
        <span :title="artwork.title" class="item-title">{{ artwork.title }}</span>
        <span v-if="artists" class="item-genre">{{ artists }}</span>
      </div>
    </router-link>
  </transition>
</template>

<script>
  export default {
    props: ['artwork', 'uri'],
    computed: {
      image () {
        return this.artwork && this.artwork.image ? this.artwork.image : {
          displayUrl: null,
          storageUri: null
        }
      },
      artists () {
        return Object.keys(this.artwork.artists || {}).map(id => this.artwork.artists[id].fullName).join(', ')
      }
    }
  }
</script>
