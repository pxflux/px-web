<template>
  <transition mode="out-in" name="fade">
    <router-link :to="uri" class="item-wrap grid-cell">
      <div class="item-image-wrap">
        <img v-if="artwork.thumbUrl" :src="artwork.thumbUrl" class="item-image">
        <!--<iframe v-else-if="artwork.url" :src="artwork.url" class="work-preview"></iframe>-->
        <img v-else src="/static/img/no-preview.png" class="item-image">
      </div>
      <div class="item-description">
        <span :title="artwork.title" class="item-title">{{ artwork.title }}</span>
      </div>
    </router-link>
  </transition>
</template>

<script>
  export default {
    props: ['artwork', 'uri'],
    watch: {
      'artwork' () {
        console.log(this.artwork)
      }
    }
  }
</script>
