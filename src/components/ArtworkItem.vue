<template>
  <transition mode="out-in" name="fade">
    <router-link :to="uri" class="item-wrap grid-cell">
      <div class="item-image-wrap">
        <img v-if="artwork.thumbUrl" :src="artwork.thumbUrl" class="item-image">
        <img v-else-if="artwork.image && artwork.image.displayUrl" :src="artwork.image.displayUrl" class="item-image">
        <!--<iframe v-else-if="artwork.url" :src="artwork.url" class="work-preview"></iframe>-->
        <img v-else="" src="/static/img/no-preview.png" class="item-image">
        <div v-if="artwork.published" class="badge published"></div>
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
    props: ['artwork', 'uri', 'private'],
    computed: {
      authorsNames () {

      }
    },
    watch: {
      'artwork' () {
        console.log(this.artwork)
      }
    }
  }
</script>
