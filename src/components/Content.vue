<template>
	<main>
		<div class="wrap-content">
			<Item v-for="(item, index) in artworks" :key="index" :item="item"></Item>
		</div>
	</main>
</template>

<script>
  import Vue from 'vue'
  import VueFire from 'vuefire'
  import Item from './Artwork'
  import firebaseApp from '../firebase'

  Vue.use(VueFire)

  const db = firebaseApp.database()

  export default {
    data () {
      return {}
    },
    firebase: {
      artworks: db.ref('artworks')
    },
    components: {
      Item
    }
  }
</script>
