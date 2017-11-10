import latinize from 'latinize'
import { log } from '../helper'
import firebase from '../firebase-app'

/**
 * Returns the artists which name match the given search query as a Promise.
 */
export function searchArtists (ref, value, maxResults) {
  value = latinize(value).toLowerCase()
  const query = ref.orderByChild('_search_index/full_name').startAt(value).limitToFirst(maxResults).once('value')
  const reversedQuery = ref.orderByChild('_search_index/reversed_full_name').startAt(value).limitToFirst(maxResults).once('value')
  return Promise.all([query, reversedQuery]).then(results => {
    const artists = {}
    // construct people from the two search queries results.
    results.forEach(result => result.forEach(data => {
      artists[data.key] = data.val()
    }))

    // Remove results that do not start with the search query.
    const artistIds = Object.keys(artists)
    artistIds.forEach(artistId => {
      const name = artists[artistId]._search_index.full_name
      const reversedName = artists[artistId]._search_index.reversed_full_name
      if (!name.startsWith(value) && !reversedName.startsWith(value)) {
        delete artists[artistId]
      }
    })
    console.log(artists)
    return artists
  })
}

export default function (user) {
  const fireArtists = firebase.database().ref('artists')
  let namesString = ''
  let availableNames = []

  this.addNameToString = function (name) {
    if (namesString) namesString += ', '
    namesString += name
    this.removeNameFromAvailableNames(name)
    return namesString
  }

  this.removeNameFromAvailableNames = function (name) {
    const index = this.availableNames.indexOf(name)
    if (index !== -1) {
      availableNames.splice(index, 1)
    }
  }

  this.parseArtistsString = function () {
    let data = {}
    const artistsList = this.namesString.split(/\s*,\s*/)
    for (let i = 0; i < artistsList.length; i++) {
      const artist = this.searchArtistName(artistsList[i])
      if (artist) {
        data[artist['.key']] = true
      } else {
        // TODO: make it really happen.. right now it is just a mock-up call..
        // and after creation of the artist we need to update the artwork again..
        if (this.hasOwnProperty('createArtist')) {
          this.createArtist(artistsList[i])
        }
      }
    }
    return data
  }

  /**
   * @param {string} name
   * @return {Object|boolean}
   */
  this.searchArtistName = function (name) {
    for (let i = 0; i < this.artists.length; i++) {
      const artistObj = this.artists[i]
      if (artistObj.hasOwnProperty('fullName')) {
        if (artistObj.fullName === name) return artistObj

        const nameParts = name.split(/\s+/)
        const artistNameParts = artistObj.fullName.split(/\s+/)
        if (nameParts.length !== artistNameParts.length) return false

        let matched = false
        for (let n = 0; n < nameParts.length; n++) {
          const regx = new RegExp('(\\s' + nameParts[n] + '\\$)||(^' + nameParts[n] + '\\s)||(\\s' + nameParts[n] + '\\s)')
          matched = artistObj.fullName.test(regx)
        }
        if (matched) return artistObj
      }
    }
    return false
  }

  /**
   * @param {string} id
   */
  this.searchArtistId = function (id) {
    for (let i = 0; i < this.artists.length; i++) {
      const artistObj = this.artists[i]
      if (artistObj.hasOwnProperty('.key')) {
        if (artistObj['.key'] === id) return artistObj
      }
    }
    return false
  }

  // this.addArtist = function () {
  //   if (fireArtists && this.artistId) {
  //     const data = this.accountArtwork.artists ? this.accountArtwork.artists : {}
  //     data[this.artistId] = true
  //     this.source.update({ 'artists': data }, log)
  //     if (this.accountArtwork.publicId) {
  //       const value = cloneArtwork(this.user.uid, this.$route.params.id, this.accountArtwork)
  //       firebase.database().ref('artworks/' + this.accountArtwork.publicId).update(value, log)
  //     }
  //   }
  // }
  //
  // this.removeArtist = function (artist) {
  //   if (fireArtists && this.accountArtwork.artists) {
  //     const data = this.accountArtwork.artists
  //     delete data[artist]
  //     this.source.update({ 'artists': data }, log)
  //     if (this.accountArtwork.publicId) {
  //       const value = cloneArtwork(this.user.uid, this.$route.params.id, this.accountArtwork)
  //       firebase.database().ref('artworks/' + this.accountArtwork.publicId).update(value, log)
  //     }
  //   }
  // }

  /**
   * @param {string[]} ids
   * @return {Promise.<*[]>}
   */
  this.getNamesByIDs = function (ids) {
    let collectNames = []
    for (let i = 0; i < ids.length; i++) {
      collectNames.push(new Promise(getNameById(ids[i])))
    }
    return Promise.all(collectNames)
  }
  /**
   * @param {string[]} namesList
   * @return {Promise.<*[]>}
   */
  this.getIDsByNames = function (namesList) {
    let collectIDs = []
    for (let i = 0; i < namesList.length; i++) {
      collectIDs.push(new Promise(getIdByName(namesList[i])))
    }
    return Promise.all(collectIDs)
  }

  /**
   * @param artistsIDs
   * @param options
   */
  this.updateArtists = function (artistsIDs, options) {
    if (options.hasOwnProperty('fullName') && options.fullName === '') {
      throw new Error('Can\'t leave artist without name! : ' + options)
    }
    let collectUpdates = []
    for (let i = 0; i < artistsIDs.length; i++) {
      collectUpdates.push(new Promise(updateArtist(artistsIDs[i], options)))
    }
    return Promise.all(collectUpdates)
  }

  function getNameById (id) {
    return fireArtists.child(id + '/fullName')
  }

  function getIdByName (fullName) {
    return searchArtists(fullName).then(artists => {
      const artistID = Object.keys(artists).pop()
      if (!artistID) {
        return createArtist({ fullName: fullName })
      }
      return artistID
    })
  }

  /**
   * @param {Object} options
   * @return {string}
   */
  function createArtist (options) {
    const defaults = {
      ownerId: user && user.uid ? user.uid : '',
      photoUrl: ''
    }
    options = { ...defaults, ...options }
    if (!options.fullName) throw new Error('Can\'t create artist without name! : ' + options)
    options._search_index = {
      full_name: latinize(options.fullName.toLowerCase()),
      reversed_full_name: latinize(options.fullName.toLowerCase().split(' ').reverse().join(' '))
    }
    return fireArtists.push(options, log).key
  }

  /**
   * @param {string} id
   * @param {Object} options
   * @return {firebase.Promise.<void>}
   */
  function updateArtist (id, options) {
    return fireArtists.child(id).update(options)
  }

  function searchArtists (value, maxResults) {
    maxResults = maxResults || 1
    value = latinize(value).toLowerCase()
    const query = fireArtists.orderByChild('_search_index/full_name').startAt(value).limitToFirst(maxResults).once('value')
    const reversedQuery = fireArtists.orderByChild('_search_index/reversed_full_name').startAt(value).limitToFirst(maxResults).once('value')
    return Promise.all([query, reversedQuery]).then(results => {
      const artists = {}
      // construct people from the two search queries results.
      results.forEach(result => result.forEach(data => {
        artists[data.key] = data.val()
      }))

      // Remove results that do not start with the search query.
      const artistIds = Object.keys(artists)
      artistIds.forEach(artistId => {
        const name = artists[artistId]._search_index.full_name
        const reversedName = artists[artistId]._search_index.reversed_full_name
        if (!name.startsWith(value) && !reversedName.startsWith(value)) {
          delete artists[artistId]
        }
      })
      console.log(artists)
      return artists
    })
  }
}
