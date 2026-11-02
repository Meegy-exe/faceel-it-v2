import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export function useWaveCanvas(waveCanvas: Ref<HTMLCanvasElement | null>) {
  let animationFrameId: number | null = null
  let waveTime = 0

  function drawWaves() {
    const canvas = waveCanvas.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const width = window.innerWidth
    const height = window.innerHeight
    ctx.clearRect(0, 0, width, height)

    const numLines = 25
    for (let i = 0; i < numLines; i++) {
      ctx.beginPath()
      ctx.lineWidth = 1.5
      const opacity = 0.15 + (i / numLines) * 0.7
      ctx.strokeStyle = `rgba(34, 197, 94, ${opacity})`

      for (let x = 0; x <= width; x += 5) {
        const baseWave = Math.sin(x * 0.002 + waveTime + i * 0.035) * 150
        const secondaryWave = Math.sin(x * 0.001 - waveTime * 0.8) * 60
        const yOffset = (i - numLines / 2) * 5
        const y = height / 2 + baseWave + secondaryWave + yOffset
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  }

  function animateWaves() {
    waveTime += 0.0025
    drawWaves()
    animationFrameId = requestAnimationFrame(animateWaves)
  }

  function resizeWaveCanvas() {
    const canvas = waveCanvas.value
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const logicalWidth = window.innerWidth
    const logicalHeight = window.innerHeight
    canvas.width = logicalWidth * dpr
    canvas.height = logicalHeight * dpr
    const ctx = canvas.getContext('2d')
    ctx?.scale(dpr, dpr)
    drawWaves()
  }

  onMounted(() => {
    if (import.meta.env.SSR) return
    resizeWaveCanvas()
    window.addEventListener('resize', resizeWaveCanvas)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion) animateWaves()
    else drawWaves()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeWaveCanvas)
    if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
  })
}
