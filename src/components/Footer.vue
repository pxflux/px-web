<template>
  <footer v-if="$route.name !== 'auth'" ref="footer">
    <div class="wrap"></div>
  </footer>
</template>
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // window.addEventListener('changeMainColor', (e) => {
  //   console.log('--> e.detail: >>>>>>')
  //   console.log(e.detail)
  //   console.log('--> e.detail.complement(): >>>>>>')
  //   console.log(e.detail.complement())
  //   if (this.$refs.hasOwnProperty('footer')) {
  //     this.$refs['footer'].style.backgroundColor = e.detail.complement().toRGBAString()
  //   }
  // })
})
</script>
