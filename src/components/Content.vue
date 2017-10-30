<template>
	<main>
		<div class="wrap-content">
			<Item v-for="item in items" :item="item" :key="item['.key']" :uri="'browse/' + item['.key']"></Item>
		</div>
	</main>
</template>

<script>
  import Item from './Item'
  import firebase from '../firebase'
  import { mapState } from 'vuex'

  export default {
    created () {
      this.$store.dispatch('setItemsRef', firebase.database().ref('artworks'))
    },
    data () {
      return {}
    },
    components: {
      Item
    },
    computed: {
      ...mapState(['items'])
    }
  }
</script>
