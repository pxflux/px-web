import axios from 'axios'
export default {
  data () {
    return {
      vimeoVideo: {
        url: '',
        width: 0,
        height: 0,
        duration: 0,
        author_name: '',
        author_url: '',
        description: '',
        vimeo_id: 0,
        thumbnail: { url: '', width: 0, height: 0 },
        error: '',
        warning: ''
      }
    }
  },
  methods: {
    /**
     * @param {string} url
     * @return {string||null} - The Vimeo video ID or null
     */
    getVimeoVideoIdFromUrl (url) {
      const match = url.match(/https:\/\/vimeo.com\/(\d+)(?=\b|\/)/)
      if (match) return match[1]
      return null
    },
    /**
     * @param {string} url
     * @param {function} callback
     */
    getVimeoVideoInfo (url, callback) {
      if (url) {
        // Validate Vimeo url and retrieve info about the video
        const id = this.getVimeoVideoIdFromUrl(url)
        if (!id) {
          this.error = 'It doesn\'t look like a correct Vimeo URL.'
        } else {
          const embedUrl = 'https://vimeo.com/api/oembed.json?url=' + encodeURIComponent(url) + '&maxwidth=90000'
          axios.get(embedUrl).then(function (response) {
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
            this.vimeoVideo.url = url
            this.vimeoVideo.width = data.width
            this.vimeoVideo.height = data.height
            this.vimeoVideo.duration = data.duration
            this.vimeoVideo.author_name = data.author_name
            this.vimeoVideo.author_url = data.author_url
            this.vimeoVideo.description = data.description
            this.vimeoVideo.vimeo_id = data.video_id
            this.vimeoVideo.thumbnail = {
              url: data.thumbnail_url,
              width: data.thumbnail_width,
              height: data.thumbnail_height
            }

            this.vimeoVideo.warning = (parseInt(data.is_plus) === 0) ? 'This video is from <b>Basic</b> Vimeo account.' : ''
            this.vimeoVideo.error = ''
            callback(this.vimeoVideo)
          }.bind(this)).catch(function (error) {
            console.log(error)
            this.error = error.message
          }.bind(this))
        }
      }
    }
  }
}
