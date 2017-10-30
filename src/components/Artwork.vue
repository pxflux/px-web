<template>
	<transition mode="out-in" name="fade">
		<div class="item-wrap">
			<div class="item-image-wrap">
				<img :src="noImage" class="item-image">
			</div>
			<div class="item-content">
				<span :title="artwork.title" class="item-title">{{ artwork.title }}</span>
				<span class="item-genre">{{ artwork.author }}</span>
			</div>
		</div>
	</transition>
</template>

<script>
  export default {
    props: ['item'],

    data () {
      return {
        artwork: this.item
      }
    },
    computed: {
      noImage () {
        return './static/img/no-image.png'
      }
    }
  }
</script>
