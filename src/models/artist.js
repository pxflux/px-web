import latinize from 'latinize'

/**
 * Returns the artists which name match the given search query as a Promise.
 */
export function searchArtists (ref, value, maxResults) {
  value = latinize(value).toLowerCase()
  const query = ref.orderByChild('_search_index/full_name').startAt(value).limitToFirst(maxResults).once('value')
  const reversedQuery = ref.orderByChild('_search_index/reversed_full_name').startAt(value).limitToFirst(maxResults).once('value')
  return Promise.all([query, reversedQuery]).then(results => {
    const artists = {}
    // construct people from the two search queries results.
    results.forEach(result => result.forEach(data => {
      artists[data.key] = data.val()
    }))

    // Remove results that do not start with the search query.
    const artistIds = Object.keys(artists)
    artistIds.forEach(artistId => {
      const name = artists[artistId]._search_index.full_name
      const reversedName = artists[artistId]._search_index.reversed_full_name
      if (!name.startsWith(value) && !reversedName.startsWith(value)) {
        delete artists[artistId]
      }
    })
    console.log(artists)
    return artists
  })
}
