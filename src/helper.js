export function log (error) {
  if (error) {
    console.log(error)
  }
}

export function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

/**
 * @param {object} parentObj
 * @param {string} propPath - Could be like: 'parentPropName/propName' or 'propName'
 * @param {*=} defaultValue
 * @return {*}
 */
export function getValueFromObj (parentObj, propPath, defaultValue) {
  if (typeof parentObj !== 'object') return defaultValue
  if (!propPath) return defaultValue

  const pathParts = propPath.split('/')
  const propName = pathParts.shift()
  if (!parentObj.hasOwnProperty(propName)) return defaultValue
  const value = parentObj[propName]

  if (pathParts.length) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      return getValueFromObj(pathParts.join('/'), value, defaultValue)
    } else {
      return defaultValue
    }
  } else {
    return value
  }
}

/**
 * @param {Object} thatClass
 * @param {Object} parentClass
 */
export function setupProtoInheritance (thatClass, parentClass) {
  thatClass.prototype = Object.create(parentClass.prototype)
  thatClass.prototype.constructor = thatClass
}
