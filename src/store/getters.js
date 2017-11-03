export default {

  accountArtists (state, getters) {
    const {user, artists} = state
    if (!user) {
      return []
    }
    return artists.filter(artist => artist.ownerId === user.uid)
  }
}
