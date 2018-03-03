<template>
  <div class="remote-button-options-box">
    <header>{{title}}</header>
    <div class="option">
      <label class="first">Button Text</label>
      <input type="text" id="label" placeholder="Button Text" v-model="buttonOptions.label"/>
      
      <label>Trigger Event Type</label>
      <v-select v-model="buttonOptions.eventType"
                :options="types"
                :default-value="'keyboard'"/>
      <div v-if="buttonOptions.eventType === 'keyboard'">
        <label :for="'keys' + index">Keyboard Key (+ Modifier Keys)</label>
        <div contenteditable="true"
             @click="refreshHelpMessage"
             @blur="blurKyeDisplay"
             :id="'keys' + index"
             ref="keysField"
             class="key-code-display" placeholder="Click here to add KyeCode">
          {{keyCodeDisplayStr}}
          <span>{{keyCodeLiteralStr}}</span>
        </div>
        <span class="description with-arrow">
          {{helpMessage}}
        </span>
      </div>
      <div v-if="buttonOptions.eventType === 'custom'">
        <label>Custom Event Name</label>
        <input v-model="buttonOptions.type"/>
        <label>Event Data</label>
        <input v-model="buttonOptions.detail"/>
      </div>
      <div v-if="buttonOptions.type === 'mouse'" class="description">
        Not Supported yet :(<br>Working hard to get it done soon.
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
  import { RCButton } from '../../models/remote-control/RCButton'
  import keycodes from 'keycode'
  import VSelect from './Select/components/Select'

  export default {
    name: 'remote-button-options',

    components: { VSelect },

    props: ['title', 'button', 'index', 'bus'],

    data () {
      return {
        buttonOptions: new RCButton(),
        types: ['keyboard', 'custom', 'mouse'],
        keyCombination: { toHtmlString: () => { return '' } },
        keyCodeDisplayStr: '',
        keyCodeLiteralStr: '',
        helpMessage: '',
        keyUpTimeout: null
      }
    },

    mounted () {
      const the = this
      this.keyCombination = {
        code: '',
        modifiers: [],
        modifiersLabels: { altKey: '⌥', ctrlKey: 'Ctrl', metaKey: '⌘', shiftKey: '⇧' },
        modifiersCodes: [18, 17, 91, 93, 16],
        toHtmlString () {
          if (!this.code) return ''
          let litSrt = ''
          let str = ''
          this.modifiers.forEach(m => {
            if (litSrt) litSrt += ' '
            str += this.modifiersLabels[m]
            litSrt += m
          })
          if (litSrt) litSrt += ' '
          if (this.modifiersCodes.indexOf(this.code) === -1) str += keycodes(this.code).toUpperCase()
          litSrt += this.code
          the.keyCodeDisplayStr = str
          the.keyCodeLiteralStr = litSrt
          return str
        }
      }

      const keyer = this.$refs.keysField
      if (keyer) {
        keyer.addEventListener('keydown', this.getKeysCombination)
        keyer.addEventListener('keyup', this.blurKyeDisplay)
      }
      this.helpMessage = this.refreshHelpMessage()
    },

    watch: {
      button () {
        this.buttonOptions = new RCButton(this.button)
        console.log('WATCH--> this.buttonOptions: >>>>>>')
        console.log(this.buttonOptions)
        if (!this.buttonOptions.eventType) this.buttonOptions.eventType = 'keyboard'
      },
      index () {
        this.buttonOptions.order = this.index
      },
      'buttonOptions.eventType' () {
        if (this.buttonOptions.eventType === 'keyboard') {
          this.refreshHelpMessage()
          this.$nextTick(() => {
            const keyer = this.$refs.keysField
            keyer.addEventListener('keydown', this.getKeysCombination)
            keyer.addEventListener('keyup', this.blurKyeDisplay)
          })
        }
      }
    },

    methods: {
      blurKyeDisplay () {
        this.keyUpTimeout = setTimeout(() => {
          console.log('--> this.$refs.keysField: >>>>>>')
          console.log(this.$refs.keysField)
          this.$refs.keysField.blur()
          this.refreshHelpMessage()
        }, 200)
      },

      refreshHelpMessage () {
        // this.nextTick(() => {
        let str = ''
        if (document.activeElement === this.$refs.keysField) {
          str = 'Press a key combination, which is expected by your program.'
        } else {
          str = 'Click to '
          str += this.keyCodeDisplayStr ? 'Modify' : 'Specify Key'
        }
        this.helpMessage = str
        // })
      },
      /**
       * @param {KeyboardEvent} e
       */
      getKeysCombination (e) {
        clearTimeout(this.keyUpTimeout)

        this.keyCombination.code = e.keyCode
        this.keyCombination.modifiers = []
        const modifiers = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey']
        modifiers.forEach(m => {
          if (e[m] === true) this.keyCombination.modifiers.push(m)
        })
        this.keyCombination.toHtmlString()
        e.preventDefault()
      },

      submit () {
        const b = {
          label: this.buttonOptions.label,
          event: this.buttonOptions.event,
          keyCode: this.buttonOptions.keyCode,
          keyModifiers: this.buttonOptions.keyModifiers,
          funcName: this.buttonOptions.funcName
        }
        this.bus.$emit('updateOutputOptions', b, this.index)
      }
    }
  }
</script>
