<template>
  <div class="video-options-box">
    <header>{{title}}</header>
    <div class="option">
      <div class="select-wrap">
        <v-select v-model="outputOptions.type"
                  :options="types"
                  :default-value="'any'"/>
      </div>
      <div class="resolution-header">
        <label>Min</label>
        <label>Optimal</label>
        <label>Max</label>
      </div>
      <div class="resolution-row width">
        <input v-for="(n, i) in ['Min', 'Max', 'Optimal']"
               type="number"
               min="0"
               v-model="outputOptions.resolution[0]"
               :class="[outputOptions.resolution[0] > 0 ? 'active': '']"/>
      </div>
      <div class="resolution-row height">
        <input v-for="(n, i) in ['Min', 'Max', 'Optimal']"
               type="number"
               min="0"
               v-model="outputOptions.resolution[1]"
               :class="[outputOptions.resolution[1] > 0 ? 'active': '']"/>
      </div>
    </div>
    <footer>
      <div class="button frameless" @click="submit">
        <span>OK</span>
      </div>
    </footer>
  </div>
</template>

<script>
  import VSelect from '../Select/components/Select'

  export default {
    name: 'output-video-options',

    components: { VSelect },

    props: ['title', 'output', 'index', 'bus'],

    data () {
      return {
        outputOptions: {
          type: 'any',
          resolution: [0, 0],
          orientation: 'landscape',
          identical: false
        },
        types: ['any', 'monitor', 'projection', 'handheld', 'headset']
      }
    },

    created () {
      this.outputOptions.type = this.output.type
      this.outputOptions.resolution = this.output.resolution
      this.outputOptions.orientation = this.output.orientation
    },

    methods: {
      submit () {
        // const data = { options: this.outputOptions, outputIndex: this.index }
        this.bus.$emit('updateOutputOptions', this.outputOptions, this.index)
      }
    }
  }
</script>
