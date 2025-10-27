<template>
  <div id="app" class="light">
    <site-header/>
    <router-view/>
    <site-footer/>
  </div>
</template>

<script setup>
import SiteHeader from '@/components/Header.vue'
import SiteFooter from '@/components/Footer.vue'
</script>

<style lang="scss">
@import '../assets/sass/app.scss';
</style>
