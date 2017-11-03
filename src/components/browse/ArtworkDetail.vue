<template>
  <main v-if="artwork">
    <div class="wrap-content text-block">
      <h1 :title="artwork.title">{{ artwork.title }}</h1>
      <p :title="artwork.author">{{ artwork.author }}</p>
      <p :title="artwork.url">source: {{ artwork.url }}</p>
      <p :title="artwork.thumbUrl">thumb: {{ artwork.thumbUrl }}</p>
    </div>
    <template v-if="artwork.artists">
      <h2>Artists</h2>
      <ul v-for="artist in artwork.artists" :key="artist['__key']">
        <li>{{ artist.name }}</li>
      </ul>
    </template>
    <template v-if="artwork.shows">
      <h2>Shows</h2>
      <ul v-for="show in artwork.shows" :key="show['__key']">
        <li>{{ show.title }}</li>
      </ul>
    </template>
    <iframe :src="artwork.url"></iframe>
  </main>
</template>

<script>
  export default {
    name: 'artwork-detail',

    computed: {
      artwork () {
        return this.$store.state.items[this.$route.params.id]
      }
    },

    asyncData ({store, route: {params: {id}}}) {
      return store.dispatch('FETCH_ITEMS', {ids: [id]})
    }
  }
</script>
