export default {

  accountArtists (state, getters) {
    const {user, artists} = state
    if (!user) {
      return []
    }
    return artists.filter(artist => artist.ownerId === user.uid)
  },
  accountInvitations (state, getters) {
    const {userAccount, invitations} = state
    if (!userAccount) {
      return []
    }
    return invitations.filter(invitation => invitation.accountId === userAccount['.key'])
  }
}
