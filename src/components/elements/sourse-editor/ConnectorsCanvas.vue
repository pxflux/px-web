<template>
  <canvas ref="canvas" @resize="updateCanvasSize"></canvas>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  startConnectors: Object,
  endConnectors: Object,
  trigger: null
})

const canvas = ref(null)
const ctx = ref(null)
const pixDensity = ref(window.devicePixelRatio || 1)
const w = ref(0)
const h = ref(0)
const lineW = ref(1)
const options = ref({
  projectionBeamH: 30,
  projectorRay: 4
})

const colors = computed(() => {
  return {
    video: 'rgba(115, 253, 234, 0.6)',
    audio: 'rgba(248, 186, 0, 0.6)'
  }
})

const updateCanvasSize = () => {
  const bounds = canvas.value.parentElement.getBoundingClientRect()
  w.value = (bounds.right - bounds.left) * pixDensity.value
  h.value = (bounds.bottom - bounds.top) * pixDensity.value

  canvas.value.width = w.value
  canvas.value.height = h.value
}

const drawEndPoint = (endPoint) => {
  const c = ctx.value

  switch (endPoint.type) {
    case 'projection':
      const originY = endPoint.y - options.value.projectionBeamH * pixDensity.value
      const rayH = options.value.projectorRay * pixDensity.value
      c.beginPath()
      c.strokeStyle = 'rgba(0,0,0,0.4)'
      c.save()
      c.translate(Math.floor(endPoint.x) - 0.5, Math.floor(originY) - rayH * 1.5 - 0.5)
      for (let i = 0; i < 5; i++) {
        c.moveTo(0, -rayH)
        c.lineTo(0, rayH)
        c.rotate(Math.PI * 2 / 8)
      }
      c.stroke()
      c.restore()

      c.beginPath()
      c.strokeStyle = 'rgba(0,0,0,0.07)'
      c.fillStyle = 'rgba(255,255,255,0.65)'
      c.lineWidth = 1 / pixDensity.value
      c.moveTo(endPoint.x, endPoint.y)
      c.lineTo(endPoint.x, originY)
      c.lineTo(endPoint.x + endPoint.w, endPoint.y)
      c.fill()
      c.stroke()
      break
    default:
  }
}

const connectorToPoint = (connector, canvasBounds) => {
  let widthPlacement = connector.type === 'projection' ? 0 : 0.5
  let heightPlacement = connector.type === 'socket' ? 1 : 0
  return {
    type: connector.type,
    x: (connector.objectBounds.left + connector.objectBounds.width * widthPlacement - canvasBounds.left) * pixDensity.value,
    y: (connector.objectBounds.top + connector.objectBounds.height * heightPlacement - canvasBounds.top) * pixDensity.value,
    w: connector.objectBounds.width * pixDensity.value
  }
}

const convert = () => {
  const canvasBounds = canvas.value.parentElement.getBoundingClientRect()
  const points = []
  props.startConnectors.audio.forEach((connector, i) => {
    points.push({
      startPoint: connectorToPoint(connector, canvasBounds),
      endPoint: connectorToPoint(props.endConnectors.audio[i], canvasBounds),
      strokeColor: colors.value.audio
    })
  })
  props.startConnectors.video.forEach((connector, i) => {
    points.push({
      startPoint: connectorToPoint(connector, canvasBounds),
      endPoint: connectorToPoint(props.endConnectors.video[i], canvasBounds),
      strokeColor: colors.value.video
    })
  })
  return points
}

const draw = () => {
  updateCanvasSize()

  const c = ctx.value
  const lineWidth = lineW.value * pixDensity.value
  c.clearRect(0, 0, w.value, h.value)

  convert().forEach(({ startPoint, endPoint, strokeColor }) => {
    let endY = endPoint.y
    if (endPoint.type === 'projection') {
      endY -= (options.value.projectionBeamH + options.value.projectorRay * 3) * pixDensity.value
    }
    const half = (endPoint.y - startPoint.y) / 2
    const c1x = startPoint.x
    const c1y = startPoint.y + half
    const c2x = endPoint.x
    const c2y = endY - half

    c.beginPath()
    c.strokeStyle = strokeColor
    c.lineWidth = lineWidth
    c.moveTo(startPoint.x, startPoint.y)
    c.bezierCurveTo(c1x, c1y, c2x, c2y, endPoint.x, endY)
    c.stroke()
    drawEndPoint(endPoint)
  })
}

onMounted(() => {
  ctx.value = canvas.value.getContext('2d')
})

watch(() => props.trigger, () => {
  draw()
})

defineExpose({
  draw,
  updateCanvasSize
})
</script>
