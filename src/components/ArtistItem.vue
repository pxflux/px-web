<template>
  <transition mode="out-in" name="fade">
    <li>
      <router-link :to="'artist/' + artist['.key']">{{ artist.name }}</router-link>
    </li>
  </transition>
</template>

<script>
  export default {
    props: ['artist']
  }
</script>
