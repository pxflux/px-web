import Vue from 'vue';
import VueFire from 'vuefire';
import firebaseApp from '@/firebase';

Vue.use(VueFire);

const db = firebaseApp.database();

export default db;
