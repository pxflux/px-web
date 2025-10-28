import { ref, onUnmounted } from 'vue'
import { getDatabase, onValue } from 'firebase/database'
import { firebaseApp } from '../firebase-app'

export function useFirebaseBinding(path) {
  const data = ref(null)
  let unsubscribe = null

  const bind = (dbPath) => {
    if (unsubscribe) {
      unsubscribe()
    }

    if (!dbPath) {
      data.value = null
      return
    }

    const db = getDatabase(firebaseApp)
    const dbRef = require('firebase/database').ref(db, dbPath)

    unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          data.value = snapshot.val()
        } else {
          data.value = null
        }
      },
      (error) => {
        console.error('Firebase binding error:', error)
        data.value = null
      }
    )
  }

  const unbind = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    data.value = null
  }

  onUnmounted(() => {
    unbind()
  })

  if (path) {
    bind(path)
  }

  return {
    data,
    bind,
    unbind
  }
}

