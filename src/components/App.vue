<template>
  <div id="app" class="light">
    <site-header/>
    <router-view/>
    <site-footer/>
  </div>
</template>

<script>
  import SiteHeader from '@/components/Header'
  import SiteFooter from '@/components/Footer'

  export default {
    components: {SiteHeader, SiteFooter}
  }
</script>

<style lang="sass">
@import '../assets/sass/app'
</style>
