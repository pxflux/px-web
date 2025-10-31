import { createApp } from "vue";
import { createAppRouter } from "./router";
import { db, auth } from "./firebase-app";
import { ref, onValue, off, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { plugin as inputAutoWidth } from "vue-input-autowidth";
import VueScrollTo from "vue-scrollto";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./components/App.vue";
import { useAuth } from "./composables/useAuth";

function b64DecodeUnicode(str) {
  return decodeURIComponent(
    atob(str)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

// Create app instance
const app = createApp(App);

// Setup router
const router = createAppRouter();

// Install plugins
app.use(router);
app.use(inputAutoWidth);
app.use(VueScrollTo);
app.use(ElementPlus);

// Initialize auth composable
const { updateUser } = useAuth();

/**
 * Sync auth state with firebase.auth().currentUser
 *
 * This callback is called when firebase.auth() detects user changes,
 * so just update the auth composable with the new user object.
 */
let callback = null;
let userRef = null;
onAuthStateChanged(auth, (user) => {
  if (callback && userRef) {
    off(userRef, "value", callback);
  }
  if (user) {
    userRef = ref(db, "metadata/" + user.uid + "/refreshTime");
    callback = onValue(userRef, (snapshot) => {
      console.log("onMetadataChanged:", snapshot);
      fetchAccount(user).then(({ user, account }) => {
        updateUser({ user, account });
      }).catch(error => {
        console.error("Error fetching account:", error.message || error);
        updateUser({ user, account: null });
      });
    });
  } else {
    updateUser(null);
  }
});

router.isReady().then(() => {
  app.mount("#app");
});

const fetchAccount = async (user) => {
  const token = await user.getIdToken(true);
  const payload = JSON.parse(b64DecodeUnicode(token.split(".")[1]));
  if (payload.accountId) {
    const snapAccount = await get(ref(db, "accounts/" + payload.accountId));
    if (!snapAccount.exists()) {
      console.log("Account does not exist:", payload.accountId);
      return { user, account: null };
    }
    const account = snapAccount.val();
    account[".key"] = snapAccount.key;
    console.log("Account fetched:", account);
    return { user, account };
  }
  console.warn("No accountId in token payload, fetching from user accounts");
  const snapAccounts = await get(ref(db, "users/" + user.uid + "/accounts"));
  if (snapAccounts.exists()) {
    const value = snapAccounts.val();
    console.log("User accounts found:", value);
    const accounts = Array.isArray(value) ? value : Object.values(value);
    if (accounts.length > 0) {
      for (const account of accounts) {
        const snapAccount = await get(ref(db, "accounts/" + account[".key"]));
        if (snapAccount.exists()) {
          const account = snapAccount.val();
          account[".key"] = snapAccount.key;
          console.log("Account fetched from user accounts:", account);
          return { user, account };
        }
      }
    }
  }
  console.warn("No user accounts found for authenticated user:", user.email);
  return { user, account: null };
};
