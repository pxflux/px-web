<template>
  <transition mode="out-in" name="fade">
    <router-link :to="uri" class="item-wrap">
      <div class="item-image-wrap">
        <img src="/static/img/no-preview.png" class="item-image">
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
    props: ['artwork', 'uri']
  }
</script>
