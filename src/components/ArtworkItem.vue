<template>
  <transition mode="out-in" name="fade">
    <router-link :to="uri" class="item-wrap grid-cell">
      <div class="item-image-wrap">
        <img v-if="image.displayUrl" :src="image.displayUrl" class="item-image">
        <img v-else src="/static/img/no-preview.png" class="item-image">
      </div>
      <div class="item-description">
        <span :title="artwork.title" class="item-title">{{ artwork.title }}</span>
        <span :title="authorsNames" class="item-title">{{ authorsNames }}</span>
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
      }
    }
  }
</script>
