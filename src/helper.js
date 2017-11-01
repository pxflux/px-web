export function log (error) {
  if (error) {
    console.log(error)
  }
}

export default {
  data () {
    return {
      mediaRules: [
        {maxW: 100000, numItemsInRow: 4},
        {maxW: 1000, numItemsInRow: 3},
        {maxW: 750, numItemsInRow: 2},
        {maxW: 500, numItemsInRow: 1}
      ],
      placeholderClass: 'grid-cell-placeholder'
    }
  },
  methods: {
    removePlaceholdersFromGrid (numToKeep) {
      let placeholders = document.getElementsByClassName(this.placeholderClass)
      const numToRemove = placeholders.length - numToKeep
      if (numToRemove < 1) {
        return Math.abs(numToRemove)
      }
      for (let i = numToRemove; i >= 0; i--) {
        const el = placeholders[i]
        el.parentNode.removeChild(el)
      }
      return 0
    },

    addPlaceholdersToGrid (numToAdd) {
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

    fillEmptySpaceInGrid () {
      const winW = window.innerWidth
      const numArtworks = this.items.length

      let smallestMaxW = 1000000
      let numItemsInRow = 0
      for (let i = 0; i < this.mediaRules.length; i++) {
        const rule = this.mediaRules[i]
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
  mounted: function () {
    window.addEventListener('resize', this.fillEmptySpaceInGrid)
  }
}
