<template>
  <canvas ref="canvas" v-on:resize="updateCanvasSize"></canvas>
</template>

<script>
  /**
   * @typedef {{objectBounds: ClientRect, type: string}} Connector
   * @typedef {Object<string,Connector[]>} GroupedConnectors
   *
   * @typedef {{point: {x:number, y:number}, type: string}} Point
   * @typedef {{type: string, points: Point[] }} PointsGroup
   */
  export default {
    name: 'connectors-canvas',
    props: [
      /** @type GroupedConnectors */
      'startConnectors',
      /** @type GroupedConnectors */
      'endConnectors',
      /** @type Object<string,string> */
      'colors',
      'trigger'
    ],
    data () {
      return {
        ctx: null,
        pixDensity: window.devicePixelRatio || 1,
        w: 0,
        h: 0,
        t: 0,
        l: 0,
        /** @type PointsGroup[] */
        startPointGroups: [],
        /** @type PointsGroup[] */
        endPointGroups: [],
        lineColor: this.color ? this.color : '#ccc',
        lineW: 1,
        drawingsSettings: {
          projector: {
            h: 24
          }
        }
      }
    },
    computed: {
      canvasBounds () {
        return this.$refs.canvas.parentElement.getBoundingClientRect()
      }
    },
    watch: {
      trigger: function () {
        this.draw()
      }
    },
    mounted () {
      this.ctx = this.$refs.canvas.getContext('2d')
    },
    methods: {
      draw () {
        this.updateCanvasSize()
        this.preparePoints()

        const ctx = this.ctx
        ctx.lineWidth = this.lineW * this.pixDensity
        ctx.clearRect(0, 0, this.w, this.h)

        this.startPointGroups.forEach((startPointsGroup, i) => {
          const endPointsGroup = this.endPointGroups[i]

          ctx.beginPath()
          ctx.strokeStyle = this.colors[startPointsGroup.type]

          startPointsGroup.points.forEach((startPoint, i) => {
            const endPoint = endPointsGroup.points[i]
            const h = (endPoint.point.y - startPoint.point.y) / 2

            const c1x = startPoint.point.x
            const c1y = startPoint.point.y + h
            const c2x = endPoint.point.x
            const c2y = endPoint.point.y - h

            ctx.moveTo(startPoint.point.x, startPoint.point.y)
            ctx.bezierCurveTo(c1x, c1y, c2x, c2y, endPoint.point.x, endPoint.point.y)
          })
          ctx.stroke()
        })
      },
      updateCanvasSize () {
        const bounds = this.$refs.canvas.parentElement.getBoundingClientRect()
        this.w = (bounds.right - bounds.left) * this.pixDensity
        this.h = (bounds.bottom - bounds.top) * this.pixDensity

        this.$refs.canvas.width = this.w
        this.$refs.canvas.height = this.h
      },
      preparePoints () {
        /** @type PointsGroup[] */
        this.startPointGroups = this.convertGroupedConnectorsToPointsGroup(this.startConnectors)
        /** @type PointsGroup[] */
        this.endPointGroups = this.convertGroupedConnectorsToPointsGroup(this.endConnectors)
      },
      convertGroupedConnectorsToPointsGroup (groupedConnectors) {
        const pointsGroup = []
        for (let key in groupedConnectors) {
          if (groupedConnectors.hasOwnProperty(key)) {
            pointsGroup.push({
              type: key,
              points: this.convertConnectorsToPoints(groupedConnectors[key])
            })
          }
        }
        return pointsGroup
      },
      /**
       * @param {Connector[]} connectors
       * @return {Point[]}
       */
      convertConnectorsToPoints (connectors) {
        const canvasBounds = this.$refs.canvas.parentElement.getBoundingClientRect()
        const points = []
        connectors.forEach(connector => {
          let widthPlacement = connector.type === 'projection' ? 0 : 0.5
          let heightPlacement = connector.type === 'socket' ? 1 : 0
          points.push(
            {
              type: connector.type,
              point: this.convertBoundsToPoint(connector.objectBounds, canvasBounds, widthPlacement, heightPlacement)
            }
          )
        })
        return points
      },
      /**
       * @param {ClientRect} objectBounds
       * @param {ClientRect} canvasBounds
       * @param {number} widthPlacement
       * @param {number} heightPlacement
       * @return {{x: number, y: number}}
       */
      convertBoundsToPoint (objectBounds, canvasBounds, widthPlacement, heightPlacement) {
        const x = objectBounds.left + objectBounds.width * widthPlacement - canvasBounds.left
        const y = objectBounds.top + objectBounds.height * heightPlacement - canvasBounds.top
        return {
          x: x * this.pixDensity,
          y: y * this.pixDensity
        }
      }
    }
  }
</script>

<style scoped>

</style>