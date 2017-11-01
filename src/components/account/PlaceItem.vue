<template>
  <transition mode="out-in" name="fade">
    <li>
      <router-link :to="'/account/place/' + place['.key']">{{ place.title }}</router-link>
    </li>
  </transition>
</template>

<script>
  export default {
    props: ['place']
  }
</script>
