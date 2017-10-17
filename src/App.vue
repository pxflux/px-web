<template>
  <div id="app">
    <router-view></router-view>
    <site-footer></site-footer>
  </div>
</template>

<script>
  import SiteFooter from '@/components/Footer';

  export default {
    components: { SiteFooter },
  };
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
