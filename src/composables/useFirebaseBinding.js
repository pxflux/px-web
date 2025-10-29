import { ref, onUnmounted, watch } from "vue";
import { onValue, ref as dbRef } from "firebase/database";
import { db } from "../firebase-app";

export function useFirebaseBinding(pathRef, options = {}) {
  const { transform, isList = true, defaultValue = [] } = options;
  const data = ref(defaultValue);
  let unsubscribe = null;

  const bind = (path) => {
    unbind();
    unsubscribe = onValue(
      dbRef(db, path),
      (snapshot) => {
        if (snapshot.exists()) {
          const value = snapshot.val();
          if (isList) {
            if (Array.isArray(value)) {
              data.value = transform ? transform(value) : value;
            } else {
              data.value = Object.keys(value).map((key) => {
                const item = { ...value[key], ".key": key };
                return transform ? transform(item) : item;
              });
            }
          } else {
            data.value = transform ? transform(value) : value;
          }
        } else {
          data.value = defaultValue;
        }
      },
      (error) => {
        console.error("Firebase binding error:", error);
        data.value = defaultValue;
      }
    );
  };

  const unbind = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    data.value = defaultValue;
  };

  onUnmounted(() => {
    unbind();
  });

  watch(
    pathRef,
    (path) => {
      if (path) {
        bind(path);
      } else {
        unbind();
      }
    },
    { immediate: true }
  );

  return {
    data,
  };
}
