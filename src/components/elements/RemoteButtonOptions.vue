<template>
  <div class="remote-button-options-box">
    <header>{{title}}</header>
    <div class="option">
      <label class="first">Button Text</label>
      <input type="text" id="label" placeholder="Button Text" v-model="buttonData.label"/>
      
      <label>Trigger Event Type</label>
      <v-select v-model="buttonData.eventType"
                :options="types"
                :default-value="'keyboard'"/>
      <div v-if="buttonData.eventType === 'keyboard'">
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
      <div v-if="buttonData.eventType === 'custom'">
        <label>Custom Event Name</label>
        <input v-model="buttonData.type"/>
        <label>Event Data</label>
        <input v-model="buttonData.detail"/>
      </div>
      <div v-if="buttonData.eventType === 'mouse'" class="description">
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
  import VSelect from './UI/Select/components/Select'

  export default {
    name: 'remote-button-options',

    components: { VSelect },

    props: ['title', 'button', 'index', 'bus'],

    data () {
      return {
        buttonData: new RCButton(),
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
        keyCode: '',
        modifiers: [],
        modifiersLabels: { altKey: '⌥', ctrlKey: 'Ctrl', metaKey: '⌘', shiftKey: '⇧' },
        modifiersCodes: [18, 17, 91, 93, 16],
        toHtmlString () {
          if (!this.keyCode) return ''
          let litSrt = ''
          let str = ''
          this.modifiers.forEach(m => {
            if (litSrt) litSrt += ' '
            str += this.modifiersLabels[m]
            litSrt += m
          })
          if (litSrt) litSrt += ' '
          if (this.modifiersCodes.indexOf(this.keyCode) === -1) str += keycodes(this.keyCode).toUpperCase()
          litSrt += this.keyCode
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
        this.buttonData = new RCButton(this.button)
        console.log('WATCH--> this.buttonData: >>>>>>')
        console.log(this.buttonData)
        if (!this.buttonData.eventType) this.buttonData.eventType = 'keyboard'
      },
      index () {
        this.buttonData.order = this.index
      },
      'buttonData.eventType' () {
        if (this.buttonData.eventType === 'keyboard') {
          this.refreshHelpMessage()
          this.$nextTick(() => {
            const keyer = this.$refs.keysField
            console.log('buttonOptions.eventType --> keyer: >>>>>>')
            console.log(keyer)
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

        this.keyCombination.keyCode = e.keyCode
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
          label: this.buttonData.label,
          event: this.buttonData.event,
          keyCode: this.buttonData.keyCode,
          keyModifiers: this.buttonData.keyModifiers,
          funcName: this.buttonData.funcName
        }
        this.bus.$emit('updateOutputOptions', b, this.index)
      }
    }
  }
</script>
