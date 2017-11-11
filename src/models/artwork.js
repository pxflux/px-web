export const artworkDefaultFields = {
  ownerId: '',
  sourceId: '',
  publicId: '',
  title: 'Untitled',
  url: '',
  thumbUrl: '',
  artists: [],
  year: '',
  description: '',
  controls: [],
  iterations: []
}

export function cloneArtwork (uid, artworkId, artwork) {
  const newArtwork = { ...artworkDefaultFields, ...artwork }
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
