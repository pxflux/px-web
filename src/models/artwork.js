import { ArrayOfType, ArtworkContributorsList, BasicData } from './data-types'

export class ArtworkData extends BasicData {
  constructor (data) {
    super()

    /** @type string */
    this.ownerId = this.getValueFrom(data, 'ownerId', '')

    /** @type string */
    this.sourceId = this.getValueFrom(data, 'sourceId', '')

    /** @type string */
    this.published = this.getValueFrom(data, 'published', '')

    /** @type string */
    this.title = this.getValueFrom(data, 'title', 'Untitled')

    /** @type string */
    this.url = this.getValueFrom(data, 'url', '')

    /** @type UrlSet */
    this.thumbnail = this.getValueFrom(data, 'thumbnail', '')

    /** @type UrlSet */
    this.preview = this.getValueFrom(data, 'preview', '')

    /** @type ArtworkContributorsList */
    this.artists = new ArtworkContributorsList(this.getValueFrom(data, 'artists'))

    /** @type string */
    this.year = this.getValueFrom(data, 'year', '')

    /** @type string */
    this.description = this.getValueFrom(data, 'description', '')

    /** @type ControlsList */
    this.controls = []

    /** @type IterationsList */
    this.iterations = []
  }

  get artistNames () {
    let names = []
    for (let id in this.artists) {
      if (!this.artists.hasOwnProperty(id)) continue
      const name = this.artists[id].hasOwnProperty('fullName') ? this.artists[id].fullName : id
      names.push(name)
    }
    return names.join(', ')
  }

  castFrom (data) {
    for (let prop in data) {
      if (data.hasOwnProperty(prop) && this.hasOwnProperty(prop)) {
        this[prop] = data[prop]
      }
    }
  }
}

export function cloneArtwork (uid, artworkId, artwork) {
  const newArtwork = { ...ArtworkData, ...artwork }
  newArtwork.ownerId = uid
  newArtwork.sourceId = artworkId

  if (artwork.imageUrl) {
    // TODO it's should be removed.. is it ever used??
    newArtwork.imageUrl = artwork.imageUrl
  }
  if (artwork.controls) {
    artwork.controls.forEach(control => {
      const newControl = {
        label: control.label,
        type: control.type
      }
      if (control.type === 'keyboard') {
        newControl.value = {
          type: control.value.type
        }
        if (control.value.keyCode) {
          newControl.value.keyCode = control.value.keyCode
        }
        if (control.value.altKey) {
          newControl.value.altKey = control.value.altKey
        }
        if (control.value.ctrlKey) {
          newControl.value.ctrlKey = control.value.ctrlKey
        }
        if (control.value.shiftKey) {
          newControl.value.shiftKey = control.value.shiftKey
        }
        if (control.value.metaKey) {
          newControl.value.metaKey = control.value.metaKey
        }
      } else if (control.type === 'function') {
        newControl.value = {
          'function': control.value.function
        }
      }
      newArtwork.controls.push(newControl)
    })
  }
  return newArtwork
}

export class ArtworksList extends ArrayOfType {
  constructor () {
    super()
    this.DataType = ArtworkData
    if (arguments.length) super.setup(arguments)
  }
}
