<template>
  <transition mode="out-in" name="fade">
    <li>
      <router-link :to="'/account/show/' + show['.key']">{{ show.title }}</router-link>
    </li>
  </transition>
</template>

<script>
  export default {
    props: ['show']
  }
</script>
