<template>
  <transition mode="out-in" name="fade">
    <router-link :to="uri" class="item-wrap">
      <div class="item-image-wrap">
        <img src="/static/img/no-image.png" class="item-image">
      </div>
      <div class="item-content">
        <span :title="artwork.title" class="item-title">{{ artwork.title }}</span>
        <span class="item-genre">{{ artwork.author }}</span>
      </div>
    </router-link>
  </transition>
</template>

<script>
  export default {
    props: ['item', 'uri'],

    data () {
      return {
        /** @type {firebase.database.Reference} */
        artwork: this.item
      }
    },
    computed: {
      noImage () {
        return 'assets/img/no-image.png'
      }
    }
  }
</script>
