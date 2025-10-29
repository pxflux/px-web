import { ref, onUnmounted, watch } from 'vue'
import { onValue, ref as dbRef } from 'firebase/database'
import { db } from '../firebase-app'

export function useFirebaseBinding(pathRef) {
  const data = ref(null)
  let unsubscribe = null

  const bind = (path) => {
    if (unsubscribe) {
      unsubscribe()
    }
    unsubscribe = onValue(
      dbRef(db, path),
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

  watch(pathRef, (path) => {
    if (path) {
      bind(path)
    } else {
      unbind()
    }
  }, { immediate: true })

  return {
    data
  }
}

