import axios from 'axios'

export default function (url) {
  return axios.post('https://50artistsnet.ipage.com/url-to-headers/index.php?url=' + encodeURIComponent(url))
    .then(response => {
      if (typeof response.data === 'object' && response.data.hasOwnProperty('Content-Type')) {
        return response.data['Content-Type']
      } else {
        return ''
      }
    })
    .catch(function (error) {
      if (error.response) {
        throw new Error(error.response.data)
      } else if (error.request) {
        throw new Error('network/request-failed')
      }
      throw new Error('network/invalid-request')
    })
}
