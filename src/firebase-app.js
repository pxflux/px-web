import { initializeApp } from 'firebase/app'
import { getDatabase as getModularDatabase, ref as modularRef, push, update, get } from 'firebase/database'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

const firebaseConfig = {
  apiKey: 'AIzaSyAYMwrJAFUxlY-Igs_ts-goUAkLwN2ZPKc',
  authDomain: 'pxfluxplayer.firebaseapp.com',
  databaseURL: 'https://pxfluxplayer.firebaseio.com',
  projectId: 'pxfluxplayer',
  storageBucket: 'pxfluxplayer.appspot.com',
  messagingSenderId: '434021624365'
}

const app = initializeApp(firebaseConfig)

// Initialize compat app for vuexfire
const compatApp = firebase.initializeApp(firebaseConfig, 'compat')

export function store (accountId, id, path, data, imageRemoved, imageFile) {
  const promise = save(id, 'accounts/' + accountId + '/' + path, data)
  if (imageRemoved) {
    promise.then(function (ref) {
      return removeFile(ref)
    })
  } else if (imageFile) {
    promise.then(function (ref) {
      return uploadFile(ref, '/accounts/' + accountId + '/' + path, imageFile)
    })
  }
  return promise
}

async function save (id, path, data) {
  const db = getModularDatabase(app)
  if (id) {
    const source = modularRef(db, path + '/' + id)
    await update(source, data)
    return source
  } else {
    return push(modularRef(db, path), data)
  }
}

function uploadFile (dbRef, path, file) {
  const storage = getStorage(app)
  return get(dbRef).then(function (snapshot) {
    const val = snapshot.val()
    return val && val.image ? val.image.storageUri : null
  }).then(function (storageUri) {
    if (storageUri && storageUri.startsWith('gs://')) {
      return deleteObject(storageRef(storage, storageUri))
    }
  }).then(function () {
    return update(dbRef, {
      image: {
        displayUrl: null,
        storageUri: null
      }
    })
  }).then(function () {
    const filePath = [path + '/' + dbRef.key, getFileExtension(file)].map(_ => _).join('.')
    const fileRef = storageRef(storage, filePath)
    return uploadBytes(fileRef, file)
  }).then(function (snapshot) {
    return getDownloadURL(snapshot.ref).then(function (downloadURL) {
      return update(dbRef, {
        image: {
          displayUrl: downloadURL,
          storageUri: snapshot.ref.toString()
        }
      })
    })
  }).then(function () {
    return dbRef
  })
}

function removeFile (dbRef) {
  const storage = getStorage(app)
  return get(dbRef).then(function (snapshot) {
    const val = snapshot.val()
    return val && val.image ? val.image.storageUri : null
  }).then(function (storageUri) {
    if (storageUri && storageUri.startsWith('gs://')) {
      return deleteObject(storageRef(storage, storageUri))
    }
  }).then(function () {
    return update(dbRef, {
      image: {
        displayUrl: null,
        storageUri: null
      }
    })
  }).then(function () {
    return dbRef
  })
}

function getFileExtension (file) {
  if (file) {
    switch (file.type) {
      case 'image/jpeg':
      case 'image/jpg':
        return 'jpg'
      case 'image/png':
        return 'png'
      case 'image/gif':
        return 'gif'
    }
  }
  return null
}

export const auth = getAuth(app)

export { compatApp as default }
export { app as firebaseApp }
