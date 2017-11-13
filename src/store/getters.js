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
    return invitations.filter(invitation => invitation.account.id === userAccount['.key'])
  },
  userInvitations (state, getters) {
    const {user, invitations} = state
    if (!user) {
      return []
    }
    return invitations.filter(invitation => invitation.email === user.email)
  }
}
