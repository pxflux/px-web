import { getDatabase, ref, get } from 'firebase/database'
import { firebaseApp as app } from '../firebase-app'

const logRequests = true

function fetch (child, relationships = []) {
  logRequests && console.log(`fetching [${child}]`)
  const db = getDatabase(app)
  return get(ref(db, child))
    .then(snapshot => {
      const data = snapshot.val()
      if (data) {
        data.__key = snapshot.key
        // mark the timestamp when this item is cached
        data.__lastUpdated = Date.now()
      }
      logRequests && console.log('fetched', data)
      return data
    })
    .then(data => {
      if (data) {
        const queries = []
        relationships.forEach(name => {
          if (data[name]) {
            const relationIds = Object.keys(data[name])
            relationIds.forEach(relationId => {
              const path = name + '/' + relationId
              logRequests && console.log('fetching', path)
              queries.push(get(ref(db, path))
                .then(snapshot => {
                  const val = snapshot.val()
                  logRequests && console.log('fetched', val)
                  if (val) {
                    val.__key = snapshot.key
                    data[name][snapshot.key] = val
                  } else {
                    // We encountered a deleted record.
                    delete data[name][snapshot.key]
                  }
                }))
            })
          }
        })
        return Promise.all(queries).then(results => {
          return data
        })
      } else {
        return data
      }
    })
}

export function fetchArtwork (id) {
  return fetch(`artworks/${id}`, ['artists', 'shows'])
}

export function fetchArtworks (ids) {
  return Promise.all(ids.map(id => fetchArtwork(id)))
}
