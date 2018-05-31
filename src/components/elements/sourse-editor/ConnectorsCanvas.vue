<template>
  <canvas ref="canvas" v-on:resize="updateCanvasSize"></canvas>
</template>

<script>
  /**
   * @typedef {{objectBounds: ClientRect, type: string}} Connector
   * @typedef {Object<string,Connector[]>} GroupedConnectors
   *
   * @typedef {{x:number, y:number, w:number, type: string}} Point
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

    mounted () {
      this.ctx = this.$refs.canvas.getContext('2d')
    },
    watch: {
      trigger: function () {
        this.draw()
      }
    },

    computed: {
      canvasBounds () {
        return this.$refs.canvas.parentElement.getBoundingClientRect()
      }
    },
    data () {
      return {
        ctx: null,
        pixDensity: window.devicePixelRatio || 1,
        w: 0,
        h: 0,
        t: 0,
        l: 0,
        lineColor: this.color ? this.color : '#ccc',
        lineW: 1,
        specialTypes: [
          'projection'
        ],
        options: {
          projectionBeamH: 30,
          projectorRay: 4
        }
      }
    },
    methods: {
      draw () {
        this.updateCanvasSize()

        const ctx = this.ctx
        const lineWidth = this.lineW * this.pixDensity
        ctx.clearRect(0, 0, this.w, this.h)

        /** @type PointsGroup[] */
        const endPointGroups = this.convertGroupedConnectorsToPointsGroup(this.endConnectors)
        this.convertGroupedConnectorsToPointsGroup(this.startConnectors).forEach((/** @type PointsGroup */ startPointsGroup, i) => {
          /** @type PointsGroup */
          const endPointsGroup = endPointGroups[i]
          const strokeColor = this.colors[startPointsGroup.type]

          startPointsGroup.points.forEach((startPoint, i) => {
            const endPoint = endPointsGroup.points[i]
            const half = (endPoint.y - startPoint.y) / 2

            let endY = endPoint.y
            if (endPoint.type === 'projection') {
              endY -= (this.options.projectionBeamH + this.options.projectorRay * 3) * this.pixDensity
            }
            const c1x = startPoint.x
            const c1y = startPoint.y + half
            const c2x = endPoint.x
            const c2y = endY - half

            ctx.beginPath()
            ctx.strokeStyle = strokeColor
            ctx.lineWidth = lineWidth
            ctx.moveTo(startPoint.x, startPoint.y)
            ctx.bezierCurveTo(c1x, c1y, c2x, c2y, endPoint.x, endY)
            ctx.stroke()
            this.drawEndPoint(endPoint)
          })
        })
      },
      /**
       * @param {Point} endPoint
       */
      drawEndPoint (endPoint) {
        const ctx = this.ctx

        switch (endPoint.type) {
          case 'projection':
            const originY = endPoint.y - this.options.projectionBeamH * this.pixDensity
            const rayH = this.options.projectorRay * this.pixDensity
            // BULB
            ctx.beginPath()
            ctx.strokeStyle = 'rgba(0,0,0,0.4)'
            // ctx.lineWidth = 1 / this.pixDensity
            ctx.save()
            ctx.translate(Math.floor(endPoint.x) - 0.5, Math.floor(originY) - rayH * 1.5 - 0.5)
            for (let i = 0; i < 5; i++) {
              ctx.moveTo(0, -rayH)
              ctx.lineTo(0, rayH)
              ctx.rotate(Math.PI * 2 / 8)
            }
            ctx.stroke()
            ctx.restore()

            // LIGHT BEAM
            ctx.beginPath()
            ctx.strokeStyle = 'rgba(0,0,0,0.07)'
            ctx.fillStyle = 'rgba(255,255,255,0.65)'
            ctx.lineWidth = 1 / this.pixDensity
            ctx.moveTo(endPoint.x, endPoint.y)
            ctx.lineTo(endPoint.x, originY)
            ctx.lineTo(endPoint.x + endPoint.w, endPoint.y)
            ctx.fill()
            ctx.stroke()
            break
          default:
        }
      },
      updateCanvasSize () {
        const bounds = this.$refs.canvas.parentElement.getBoundingClientRect()
        this.w = (bounds.right - bounds.left) * this.pixDensity
        this.h = (bounds.bottom - bounds.top) * this.pixDensity

        this.$refs.canvas.width = this.w
        this.$refs.canvas.height = this.h
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

          const point = this.convertBoundsToPoint(
            connector.objectBounds,
            canvasBounds,
            widthPlacement,
            heightPlacement
          )
          point.type = connector.type
          points.push(point)
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
          y: y * this.pixDensity,
          w: objectBounds.width * this.pixDensity
        }
      }
    }
  }
</script>
