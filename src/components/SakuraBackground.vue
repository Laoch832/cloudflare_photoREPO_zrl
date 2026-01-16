<template>
  <canvas ref="canvas" class="sakura-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx = null
let width = 0
let height = 0
let particles = []
let animationFrameId = null

const particleCount = 40 // 樱花数量

class Sakura {
  constructor() {
    this.reset()
  }

  reset() {
    this.x = Math.random() * width
    this.y = Math.random() * -height
    this.size = Math.random() * 15 + 10
    this.speedX = Math.random() * 1 - 0.5
    this.speedY = Math.random() * 1.5 + 0.5
    this.rotation = Math.random() * 360
    this.rotationSpeed = Math.random() * 2 - 1
    this.opacity = Math.random() * 0.5 + 0.3
    // 随机选择花瓣图片或绘制形状，这里简单绘制粉色花瓣形状
    this.type = Math.random() > 0.5 ? 1 : 2 
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY
    this.rotation += this.rotationSpeed

    // 飘落时的左右摇摆
    this.speedX += Math.random() * 0.1 - 0.05
    
    // 边界检查
    if (this.y > height + 50 || this.x < -50 || this.x > width + 50) {
      this.reset()
    }
  }

  draw() {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation * Math.PI / 180)
    ctx.globalAlpha = this.opacity
    
    // 绘制花瓣
    ctx.beginPath()
    const rad = this.size / 2
    
    if (this.type === 1) {
      // 形状1：普通花瓣
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(rad, -rad, rad * 2, 0, 0, rad * 2)
      ctx.bezierCurveTo(-rad * 2, 0, -rad, -rad, 0, 0)
    } else {
      // 形状2：稍微圆润一点
      ctx.ellipse(0, 0, rad, rad * 1.5, 0, 0, Math.PI * 2)
    }
    
    // 樱花粉色
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size)
    gradient.addColorStop(0, '#ffeff2')
    gradient.addColorStop(1, '#ffb7c5')
    
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.restore()
  }
}

const init = () => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  resize()
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Sakura())
  }
  
  animate()
}

const resize = () => {
  if (!canvas.value) return
  width = window.innerWidth
  height = window.innerHeight
  canvas.value.width = width
  canvas.value.height = height
}

const animate = () => {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  
  particles.forEach(p => {
    p.update()
    p.draw()
  })
  
  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  init()
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
.sakura-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 让鼠标事件穿透，不影响交互 */
  z-index: 9999; /* 放在最上层，或者根据需要调整 */
}
</style>