export function cloneArtwork (uid, artworkId, artwork) {
  const newArtwork = {
    ownerId: uid,
    sourceId: artworkId,
    title: artwork.title,
    url: artwork.url,
    actors: artwork.actors || [],
    controls: []
  }
  if (artwork.imageUrl) {
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
