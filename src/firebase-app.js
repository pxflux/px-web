import { initializeApp } from 'firebase/app'
import { getDatabase, ref as databaseRef, push, update, get } from 'firebase/database'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAYMwrJAFUxlY-Igs_ts-goUAkLwN2ZPKc',
  authDomain: 'pxfluxplayer.firebaseapp.com',
  databaseURL: 'https://pxfluxplayer.firebaseio.com',
  projectId: 'pxfluxplayer',
  storageBucket: 'pxfluxplayer.appspot.com',
  messagingSenderId: '434021624365'
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const auth = getAuth(app)

export async function store (accountId, id, path, data, imageRemoved, imageFile) {
  const ref = await save(id, 'accounts/' + accountId + '/' + path, data)
  if (imageRemoved) {
    return removeFile(ref)
  } else if (imageFile) {
    return uploadFile(ref, '/accounts/' + accountId + '/' + path, imageFile)
  }
  return ref
}

async function save (id, path, data) {
  if (id) {
    const ref = databaseRef(db, path + '/' + id)
    await update(ref, data)
    return ref
  } else {
    return push(databaseRef(db, path), data)
  }
}

async function uploadFile (dbRef, path, file) {
  const storage = getStorage(app)
  const snapshot = await get(dbRef)
  const storageUri = snapshot.val()?.image?.storageUri
  if (storageUri?.startsWith('gs://')) {
    await deleteObject(storageRef(storage, storageUri))
  }
  await update(dbRef, {
    image: {
      displayUrl: null,
      storageUri: null
    }
  })
  const filePath = [path + '/' + dbRef.key, getFileExtension(file)].map(_ => _).join('.')
  const uploadSnapshot = await uploadBytes(storageRef(storage, filePath), file)
  const downloadURL = await getDownloadURL(uploadSnapshot.ref)
  await update(dbRef, {
    image: {
      displayUrl: downloadURL,
      storageUri: uploadSnapshot.ref.toString()
    }
  })
  return dbRef
}

async function removeFile (dbRef) {
  const snapshot = await get(dbRef)
  const storageUri = snapshot.val()?.image?.storageUri
  if (storageUri?.startsWith('gs://')) {
    await deleteObject(storageRef(getStorage(app), storageUri))
  }
  await update(dbRef, {
    image: {
      displayUrl: null,
      storageUri: null
    }
  })
  return dbRef
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

export { app as firebaseApp, db, auth }
