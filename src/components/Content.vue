<template>
  <main>
    <div class="wrap-content grid" id="main-grid">
      <Item v-for="item in items" :item="item" :key="item['.key']" :uri="'browse/' + item['.key']"></Item>
    </div>
  </main>
</template>

<script>
  import Item from './Item'
  import firebase from '../firebase'
  import { mapState } from 'vuex'

  export default {
    created () {
      this.$store.dispatch('setItemsRef', firebase.database().ref('artworks'))
    },
    data () {
      return {
        mediaRules: [
          { maxW: 100000, numItemsInRow: 4 },
          { maxW: 1000, numItemsInRow: 3 },
          { maxW: 750, numItemsInRow: 2 },
          { maxW: 500, numItemsInRow: 1 }
        ],
        placeholderClass: 'grid-cell-placeholder'
      }
    },
    components: {
      Item
    },
    computed: {
      ...mapState([ 'items' ])
    },
    methods: {
      removePlaceholdersFromGrid: function (numToKeep) {
        let placeholders = document.getElementsByClassName(this.placeholderClass)
        const numToRemove = placeholders.length - numToKeep
        if (numToRemove < 1) {
          return Math.abs(numToRemove)
        }
        for (let i = numToRemove; i >= 0; i--) {
          const el = placeholders[ i ]
          el.parentNode.removeChild(el)
        }
        return 0
      },

      addPlaceholdersToGrid: function (numToAdd) {
        if (numToAdd) {
          const container = document.getElementById('main-grid')
          if (!container) {
            return
          }

          for (let i = 0; i < numToAdd; i++) {
            let placeholder = document.createElement('div')
            placeholder.className = this.placeholderClass
            container.appendChild(placeholder)
          }
        }
      },

      fillEmptySpaceInGrid: function () {
        const winW = window.innerWidth
        const numArtworks = this.items.length

        let smallestMaxW = 1000000
        let numItemsInRow = 0
        for (let i = 0; i < this.mediaRules.length; i++) {
          const rule = this.mediaRules[ i ]
          if (winW <= rule.maxW && rule.maxW < smallestMaxW) {
            numItemsInRow = rule.numItemsInRow
          }
        }

        const numRows = numArtworks / numItemsInRow
        const numHangingItems = (numRows - Math.floor(numRows)) * numItemsInRow
        let numToAdd = numHangingItems > 0 ? numItemsInRow - numHangingItems : 0

        numToAdd = this.removePlaceholdersFromGrid(numToAdd)
        this.addPlaceholdersToGrid(numToAdd)
      }
    },
    watch: {
      items: function () {
        this.$nextTick(function () {
          this.fillEmptySpaceInGrid()
        })
      }
    },
    /* updated: function () {
      this.$nextTick(function () {
        this.fillEmptySpaceInGrid()
      })
    }, */
    mounted: function () {
      window.addEventListener('resize', this.fillEmptySpaceInGrid)
    }
  }
</script>
