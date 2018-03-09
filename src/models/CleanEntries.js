export function cleanEntries (value) {
  Object.keys(value).forEach((key) => (value[key] === null) && delete value[key])
  return Object.keys(value).length ? value : null
}
