// ============================================================================
// Canvas 烟花渲染器 - 真实烟花效果
// 特性：从屏幕外升空、径向爆炸、发光拖尾、流畅60fps
// ============================================================================

import type { Firework, Particle } from '@/types'

/**
 * 初始化 Canvas 上下文
 */
export function initCanvasContext(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): {
  ctx: CanvasRenderingContext2D
  dpr: number
  width: number
  height: number
} {
  const dpr = window.devicePixelRatio || 1
  const ctx = canvas.getContext('2d')!

  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx.scale(dpr, dpr)

  return { ctx, dpr, width, height }
}

/**
 * 清空 Canvas 并绘制夜空背景
 */
export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  // 深邃夜空渐变
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, '#0a0a15')     // 顶部：深蓝黑
  gradient.addColorStop(0.3, '#0d0d1a')   // 上部
  gradient.addColorStop(0.7, '#111118')   // 下部
  gradient.addColorStop(1, '#000000')     // 底部：纯黑

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // 绘制星星
  drawStars(ctx, width, height)
}

/**
 * 绘制星星背景
 */
function drawStars(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  let seed = 54321
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  const starCount = Math.floor((width * height) / 12000)

  for (let i = 0; i < starCount; i++) {
    const x = random() * width
    const y = random() * height * 0.7
    const radius = random() * 1.2
    const opacity = 0.3 + random() * 0.5

    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

/**
 * 绘制升空中的烟花（发光弹头 + 拖尾）
 */
function drawLaunchingFirework(
  ctx: CanvasRenderingContext2D,
  firework: Firework
): void {
  if (firework.currentLaunchY === undefined) return

  const x = firework.x
  const y = firework.currentLaunchY
  const startY = firework.startY || (firework.y + firework.launchHeight)

  // 计算升空进度
  const totalDistance = startY - firework.y
  const currentDistance = startY - y
  const progress = currentDistance / totalDistance

  // 主颜色（取烟花第一个颜色）
  const mainColor = firework.colors[0] || '#FFD700'

  // ===== 绘制拖尾 =====
  const tailLength = Math.min(80 + progress * 60, y - firework.y)  // 拖尾长度随进度增加
  const tailGradient = ctx.createLinearGradient(x, y, x, y + tailLength)
  tailGradient.addColorStop(0, mainColor)
  tailGradient.addColorStop(0.3, `${mainColor}AA`)
  tailGradient.addColorStop(0.7, `${mainColor}44`)
  tailGradient.addColorStop(1, 'transparent')

  ctx.strokeStyle = tailGradient
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + (Math.random() - 0.5) * 2, y + tailLength)
  ctx.stroke()

  // ===== 绘制火花散射 =====
  const sparkCount = 5 + Math.floor(Math.random() * 5)
  for (let i = 0; i < sparkCount; i++) {
    const sparkX = x + (Math.random() - 0.5) * 20
    const sparkY = y + Math.random() * 30 + 10
    const sparkSize = 1 + Math.random() * 2

    ctx.fillStyle = `rgba(255, ${150 + Math.random() * 105}, 50, ${0.5 + Math.random() * 0.5})`
    ctx.beginPath()
    ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2)
    ctx.fill()
  }

  // ===== 绘制发光弹头 =====
  // 外层光晕
  const glowRadius = 15
  const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius)
  glowGradient.addColorStop(0, `${mainColor}FF`)
  glowGradient.addColorStop(0.3, `${mainColor}88`)
  glowGradient.addColorStop(0.6, `${mainColor}33`)
  glowGradient.addColorStop(1, 'transparent')

  ctx.fillStyle = glowGradient
  ctx.beginPath()
  ctx.arc(x, y, glowRadius, 0, Math.PI * 2)
  ctx.fill()

  // 核心亮点
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(x, y, 3, 0, Math.PI * 2)
  ctx.fill()
}

/**
 * 绘制单个爆炸粒子（带线条轨迹效果）
 * 实现真实烟花的"火花线"效果
 */
function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle): void {
  if (particle.opacity <= 0.01) return

  const { x, y, size, color, opacity, trail } = particle

  ctx.save()

  // ===== 绘制轨迹线条 =====
  if (trail && trail.length > 1) {
    // 使用贝塞尔曲线绘制平滑轨迹
    ctx.beginPath()
    ctx.moveTo(x, y)

    for (let i = 1; i < trail.length; i++) {
      const point = trail[i]
      const prevPoint = trail[i - 1]

      // 使用二次贝塞尔曲线使轨迹更平滑
      const cpX = (prevPoint.x + point.x) / 2
      const cpY = (prevPoint.y + point.y) / 2
      ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpX, cpY)
    }

    // 创建轨迹渐变
    const lastPoint = trail[trail.length - 1]
    const gradient = ctx.createLinearGradient(x, y, lastPoint.x, lastPoint.y)
    gradient.addColorStop(0, color)
    gradient.addColorStop(0.3, `${color}CC`)
    gradient.addColorStop(0.6, `${color}66`)
    gradient.addColorStop(1, 'transparent')

    ctx.strokeStyle = gradient
    ctx.lineWidth = Math.max(1, size * 0.8)
    ctx.lineCap = 'round'
    ctx.globalAlpha = opacity
    ctx.stroke()
  }

  // ===== 绘制粒子头部光点 =====
  ctx.globalAlpha = opacity

  // 外层光晕
  if (opacity > 0.3) {
    const glowSize = size * 3
    const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize)
    glowGradient.addColorStop(0, `${color}`)
    glowGradient.addColorStop(0.3, `${color}88`)
    glowGradient.addColorStop(0.6, `${color}33`)
    glowGradient.addColorStop(1, 'transparent')

    ctx.fillStyle = glowGradient
    ctx.beginPath()
    ctx.arc(x, y, glowSize, 0, Math.PI * 2)
    ctx.fill()
  }

  // 粒子核心亮点
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, size, 0, Math.PI * 2)
  ctx.fill()

  // 高亮度粒子添加白色核心
  if (opacity > 0.5) {
    ctx.fillStyle = '#FFFFFF'
    ctx.globalAlpha = opacity * 0.8
    ctx.beginPath()
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

/**
 * 绘制所有粒子
 */
function drawAllParticles(ctx: CanvasRenderingContext2D, fireworks: Firework[]): void {
  for (const firework of fireworks) {
    for (const particle of firework.particles) {
      drawParticle(ctx, particle)
    }
  }
}

/**
 * 主渲染函数
 */
export function renderFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fireworks: Firework[],
  currentTime: number,
  _showHolidayWish: boolean = true
): void {
  // 1. 清空并绘制背景
  clearCanvas(ctx, width, height)

  // 2. 绘制升空中的烟花
  for (const firework of fireworks) {
    if (!firework.hasExploded && firework.currentLaunchY !== undefined) {
      drawLaunchingFirework(ctx, firework)
    }
  }

  // 3. 绘制爆炸粒子
  drawAllParticles(ctx, fireworks)
}

