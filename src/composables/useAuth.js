import { ref, readonly } from 'vue'

const user = ref(null)
const userAccount = ref(null)

export function useAuth() {
  const updateUser = (payload) => {
    if (payload === null) {
      user.value = null
      userAccount.value = null
    } else {
      user.value = payload.user
      if (payload.account) {
        userAccount.value = payload.account
      }
    }
  }

  return {
    user: readonly(user),
    userAccount: readonly(userAccount),
    updateUser
  }
}

