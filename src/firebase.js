import Firebase from 'firebase';
import store from './store';

const app = Firebase.initializeApp({
  apiKey: 'AIzaSyAYMwrJAFUxlY-Igs_ts-goUAkLwN2ZPKc',
  authDomain: 'pxfluxplayer.firebaseapp.com',
  databaseURL: 'https://pxfluxplayer.firebaseio.com',
  projectId: 'pxfluxplayer',
  storageBucket: 'pxfluxplayer.appspot.com',
  messagingSenderId: '434021624365',
});

export default app;

/**
 * Sync store.state.user with firebase.auth().currentUser
 *
 * This callback is called when firebase.auth() detects user changes,
 * so just update the vuex store with the new user object.
 */
app.auth().onAuthStateChanged((user) => {
  store.commit('UPDATE_USER', user);
});
