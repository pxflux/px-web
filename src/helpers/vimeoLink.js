import axios from 'axios'

/**
 * @typedef {
 *  {
 *    url: string,
 *    width: number,
 *    height: number,
 *    duration: number,
 *    author_name: string,
 *    author_url: string,
 *    description: string,
 *    vimeo_id: number,
 *    thumbnail: { url: string, width: number, height: number },
 *    error: string,
 *    warning: string
 *  }
 * } VimeoVideoInfo
 */
export default {
  methods: {
    /**
     * @param {string} url
     * @return {boolean}
     */
    isVimeoVideoUrl (url) {
      return url.match(/https:\/\/vimeo.com\/(\d+)(?=\b|\/)/)
    },
    /**
     * @param {string} url
     * @return {Promise<VimeoVideoInfo>}
     */
    getVimeoVideoInfo (url) {
      const embedUrl = 'https://vimeo.com/api/oembed.json?url=' + encodeURIComponent(url) + '&maxwidth=90000'
      return axios.get(embedUrl).then(function (response) {
        /**
         * @type {{
               *   account_type: string
               *   author_name: string
               *   author_url: string
               *   description: string
               *   duration: number
               *   height: number
               *   html: string
               *   is_plus: string
               *   thumbnail_height: number
               *   thumbnail_url: string
               *   thumbnail_url_with_play_button: string
               *   thumbnail_width: number
               *   video_id: number
               *   width: number
               * }}
         */
        const data = response.data
        return {
          is_plus: data.is_plus,
          url: url,
          width: data.width,
          height: data.height,
          duration: data.duration,
          author_name: data.author_name,
          author_url: data.author_url,
          description: data.description,
          vimeo_id: data.video_id,
          thumbnail: {
            url: data.thumbnail_url,
            width: data.thumbnail_width,
            height: data.thumbnail_height
          }
        }
      })
    }
  }
}
