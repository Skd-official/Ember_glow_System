// Canvas 渲染器 - 真实烟花效果
import type { Firework, Particle } from './types'
import { getHolidayTextConfig } from './holidayTextEffects'
import { formatTextWithLineBreaks } from './textFireworks'

export function initCanvasContext(canvas: HTMLCanvasElement, width: number, height: number) {
  const dpr = window.devicePixelRatio || 1
  const ctx = canvas.getContext('2d')!
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx.scale(dpr, dpr)
  return { ctx, dpr, width, height }
}

export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, '#0a0a15')
  gradient.addColorStop(0.3, '#0d0d1a')
  gradient.addColorStop(0.7, '#111118')
  gradient.addColorStop(1, '#000000')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  let seed = 54321
  const random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
  const starCount = Math.floor((width * height) / 12000)
  for (let i = 0; i < starCount; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + random() * 0.5})`
    ctx.beginPath()
    ctx.arc(random() * width, random() * height * 0.7, random() * 1.2, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawLaunchingFirework(ctx: CanvasRenderingContext2D, fw: Firework): void {
  if (fw.currentLaunchY === undefined) return
  const x = fw.x, y = fw.currentLaunchY, mainColor = fw.colors[0] || '#FFD700'
  const tailGrad = ctx.createLinearGradient(x, y, x, y + 80)
  tailGrad.addColorStop(0, mainColor)
  tailGrad.addColorStop(1, 'transparent')
  ctx.strokeStyle = tailGrad
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x, y + 80)
  ctx.stroke()
  const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, 15)
  glowGrad.addColorStop(0, mainColor)
  glowGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = glowGrad
  ctx.beginPath()
  ctx.arc(x, y, 15, 0, Math.PI * 2)
  ctx.fill()
  if (fw.displayText) {
    ctx.globalAlpha = 0.6
    ctx.fillStyle = mainColor
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('✨', x - 15, y - 20)
    ctx.fillText('✨', x + 15, y - 20)
    ctx.globalAlpha = 1
  }
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle): void {
  if (p.opacity <= 0.01) return
  ctx.save()
  ctx.globalAlpha = p.opacity
  if (p.trail && p.trail.length > 1) {
    const grad = ctx.createLinearGradient(p.x, p.y, p.trail[p.trail.length - 1].x, p.trail[p.trail.length - 1].y)
    grad.addColorStop(0, p.color)
    grad.addColorStop(1, 'transparent')
    ctx.strokeStyle = grad
    ctx.lineWidth = Math.max(1, p.size * 0.8)
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    for (let i = 1; i < Math.min(p.trail.length, 5); i++) {
      ctx.lineTo(p.trail[i].x, p.trail[i].y)
    }
    ctx.stroke()
  }
  const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
  glowGrad.addColorStop(0, p.color)
  glowGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = glowGrad
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = p.color
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawFireworkTexts(ctx: CanvasRenderingContext2D, w: number, h: number, fireworks: Firework[], t: number): void {
  for (const fw of fireworks) {
    if (!fw.hasExploded || !fw.displayText) continue
    const e = t - fw.explosionTime
    if (e < 0 || e > 2000) continue
    const prog = e / 2000
    let op = 1
    if (prog < 0.2) op = prog / 0.2
    else if (prog > 0.8) op = (1 - prog) / 0.2

    ctx.save()
    ctx.globalAlpha = op

    // 处理多行文字（按 \n 分割）
    const lines = formatTextWithLineBreaks(fw.displayText, 9)

    // 节日文字和平时文字的配置不同
    let fontSize: number
    let textColor: string
    let glowColor: string
    let effectType: string = ''

    if (fw.isHolidayText) {
      // 节日文字：使用配置颜色和特效
      const holidayEffectType = fw.holiday?.effectType || ''
      const config = getHolidayTextConfig(holidayEffectType)
      fontSize = 52
      textColor = config.textColor
      glowColor = config.glowColor
      effectType = config.effectType
    } else {
      // 平时文字：金色，字号更小，无特效
      fontSize = 36
      textColor = '#FFD700'
      glowColor = 'rgba(255, 215, 0, 0.4)'
      effectType = '' // 无特效
    }

    // 计算多行文字的总高度和垂直偏移
    const lineHeight = fontSize * 1.3
    const totalHeight = lineHeight * lines.length
    const startY = fw.y - 80 - totalHeight / 2

    // 绘制每一行文字
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex]
      const lineY = startY + lineIndex * lineHeight

      // 绘制文字外光晕
      ctx.font = `bold ${fontSize}px "Noto Serif SC"`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = glowColor
      ctx.globalAlpha = op * 0.4
      for (let i = 0; i < 3; i++) {
        ctx.fillText(line, fw.x, lineY)
      }

      // 绘制文字主体
      ctx.globalAlpha = op
      ctx.fillStyle = textColor
      ctx.fillText(line, fw.x, lineY)

      // 绘制文字外框（增强视觉效果）
      ctx.strokeStyle = glowColor
      ctx.lineWidth = 1.5
      ctx.globalAlpha = op * 0.6
      ctx.strokeText(line, fw.x, lineY)
    }

    // 仅节日文字绘制特效
    if (fw.isHolidayText && effectType) {
      drawHolidayTextEffect(ctx, fw, prog, op, effectType)
    }

    ctx.restore()
  }
}

/**
 * 根据节日绘制特殊的文字特效
 */
function drawHolidayTextEffect(
  ctx: CanvasRenderingContext2D,
  fw: Firework,
  progress: number,
  opacity: number,
  effectType: string
): void {
  ctx.save()

  switch (effectType) {
    case 'firecrackers':
      drawFirecrackersEffect(ctx, fw, progress, opacity)
      break
    case 'lanterns':
      drawLanternsEffect(ctx, fw, progress, opacity)
      break
    case 'zongzi_floating':
      drawZongziFloatingEffect(ctx, fw, progress, opacity)
      break
    case 'starfall':
      drawStarfallEffect(ctx, fw, progress, opacity)
      break
    case 'moonlight':
      drawMoonlightEffect(ctx, fw, progress, opacity)
      break
    case 'labor_hammer':
      drawLaborHammerEffect(ctx, fw, progress, opacity)
      break
    case 'flag_spread':
      drawFlagSpreadEffect(ctx, fw, progress, opacity)
      break
  }

  ctx.restore()
}

/**
 * 春节/除夕特效：爆竹快速旋转
 */
function drawFirecrackersEffect(ctx: CanvasRenderingContext2D, fw: Firework, progress: number, opacity: number): void {
  const count = progress < 0.5 ? 10 : 8  // 前期多一些
  const radius = 30 + progress * 60
  const rotation = progress * Math.PI * 4  // 快速旋转

  for (let i = 0; i < count; i++) {
    const angle = (i * Math.PI * 2) / count + rotation
    const x = fw.x + Math.cos(angle) * radius
    const y = fw.y + Math.sin(angle) * radius - 80

    ctx.globalAlpha = opacity * (1 - progress * 0.5)
    ctx.fillStyle = '#FF0000'
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fill()

    // 金色尾迹
    ctx.fillStyle = 'rgba(255, 215, 0, 0.6)'
    ctx.beginPath()
    ctx.arc(x - Math.cos(angle) * 8, y - Math.sin(angle) * 8 - 80, 2, 0, Math.PI * 2)
    ctx.fill()
  }
}

/**
 * 元宵特效：金色灯笼缓慢环绕展开
 */
function drawLanternsEffect(ctx: CanvasRenderingContext2D, fw: Firework, progress: number, opacity: number): void {
  const count = 14
  const radius = 20 + progress * 50  // 缓慢扩散
  const rotation = progress * Math.PI * 0.5  // 缓慢旋转

  for (let i = 0; i < count; i++) {
    const angle = (i * Math.PI * 2) / count + rotation
    const x = fw.x + Math.cos(angle) * radius
    const y = fw.y + Math.sin(angle) * radius - 80

    // 灯笼光晕
    const grad = ctx.createRadialGradient(x, y, 0, x, y, 8)
    grad.addColorStop(0, `rgba(255, 215, 0, ${opacity * 0.8})`)
    grad.addColorStop(0.5, `rgba(255, 215, 0, ${opacity * 0.4})`)
    grad.addColorStop(1, 'rgba(255, 215, 0, 0)')

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.fill()

    // 灯笼中心
    ctx.fillStyle = '#FFA500'
    ctx.globalAlpha = opacity
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fill()
  }
}

/**
 * 端午特效：粽子上下浮动摇晃
 */
function drawZongziFloatingEffect(ctx: CanvasRenderingContext2D, fw: Firework, progress: number, opacity: number): void {
  const count = 8
  const baseRadius = 35

  for (let i = 0; i < count; i++) {
    const angle = (i * Math.PI * 2) / count

    // 上下浮动 (使用 sin 波)
    const floatY = Math.sin(progress * Math.PI * 3) * 15

    // 左右摇晃 (使用 cos 波)
    const swayX = Math.cos(progress * Math.PI * 2.5) * 10

    const x = fw.x + Math.cos(angle) * baseRadius + swayX
    const y = fw.y + Math.sin(angle) * baseRadius - 80 + floatY

    // 粽子形状（两个三角形组成）
    ctx.fillStyle = '#8B4513'  // 褐色
    ctx.globalAlpha = opacity * 0.8
    ctx.beginPath()
    ctx.moveTo(x - 6, y - 6)
    ctx.lineTo(x + 6, y - 6)
    ctx.lineTo(x, y + 8)
    ctx.closePath()
    ctx.fill()

    // 绿色叶子
    ctx.fillStyle = '#228B22'
    ctx.globalAlpha = opacity * 0.6
    ctx.beginPath()
    ctx.moveTo(x - 5, y - 4)
    ctx.lineTo(x, y - 8)
    ctx.lineTo(x + 5, y - 4)
    ctx.closePath()
    ctx.fill()
  }
}

/**
 * 七夕特效：星星从下向上飘落
 */
function drawStarfallEffect(ctx: CanvasRenderingContext2D, fw: Firework, progress: number, opacity: number): void {
  const count = 24

  for (let i = 0; i < count; i++) {
    // 随机角度和速度
    const seed = i * 12.9898 + progress * 78.233
    const randomAngle = (Math.sin(seed) * 0.5 + 0.5) * Math.PI * 2

    const upDistance = progress * 120  // 向上飘
    const swayDistance = Math.sin(seed * 3.14159) * 30  // 左右摇晃

    const x = fw.x + Math.cos(randomAngle) * 40 + swayDistance
    const y = fw.y - 80 - upDistance + (Math.random() - 0.5) * 40

    // 星星闪烁
    const twinkle = Math.sin(progress * Math.PI * 6 + seed) * 0.5 + 0.5
    ctx.globalAlpha = opacity * twinkle
    ctx.fillStyle = '#DA70D6'
    ctx.font = 'bold 18px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('✦', x, y)
  }
}

/**
 * 中秋特效：月光逐渐扩散
 */
function drawMoonlightEffect(ctx: CanvasRenderingContext2D, fw: Firework, progress: number, opacity: number): void {
  // 多层月光波
  for (let layer = 0; layer < 3; layer++) {
    const delay = layer * 0.15
    const adjustedProgress = Math.max(0, progress - delay)

    if (adjustedProgress <= 0) continue

    const radius = 40 + adjustedProgress * 80
    const layerOpacity = opacity * Math.max(0, 1 - (adjustedProgress - 0.5) * 2) * (1 - layer * 0.3)

    // 外圈光晕
    const grad = ctx.createRadialGradient(fw.x, fw.y - 80, radius - 15, fw.x, fw.y - 80, radius + 15)
    grad.addColorStop(0, 'rgba(65, 105, 225, 0)')
    grad.addColorStop(0.5, `rgba(65, 105, 225, ${layerOpacity * 0.4})`)
    grad.addColorStop(1, 'rgba(65, 105, 225, 0)')

    ctx.fillStyle = grad
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.arc(fw.x, fw.y - 80, radius, 0, Math.PI * 2)
    ctx.fill()

    // 内圈亮白
    const innerGrad = ctx.createRadialGradient(fw.x, fw.y - 80, Math.max(0, radius - 30), fw.x, fw.y - 80, radius - 10)
    innerGrad.addColorStop(0, `rgba(255, 255, 255, ${layerOpacity * 0.3})`)
    innerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = innerGrad
    ctx.beginPath()
    ctx.arc(fw.x, fw.y - 80, radius - 10, 0, Math.PI * 2)
    ctx.fill()
  }
}

/**
 * 劳动节特效：红黄镰锤交替闪烁
 */
function drawLaborHammerEffect(ctx: CanvasRenderingContext2D, fw: Firework, progress: number, opacity: number): void {
  const count = 12
  const radius = 35 + progress * 40

  for (let i = 0; i < count; i++) {
    const angle = (i * Math.PI * 2) / count
    const x = fw.x + Math.cos(angle) * radius
    const y = fw.y + Math.sin(angle) * radius - 80

    // 交替显示红黄
    const isRed = i % 2 === 0
    const color = isRed ? '#FF0000' : '#FFDE00'

    // 闪烁效果
    const flicker = Math.sin(progress * Math.PI * 8 + i) * 0.5 + 0.5
    ctx.globalAlpha = opacity * (0.5 + flicker * 0.5)
    ctx.fillStyle = color

    ctx.beginPath()
    ctx.arc(x, y, 6, 0, Math.PI * 2)
    ctx.fill()
  }
}

/**
 * 国庆节特效：红黄国旗色展开
 */
function drawFlagSpreadEffect(ctx: CanvasRenderingContext2D, fw: Firework, progress: number, opacity: number): void {
  const count = 12
  const radius = 25 + progress * 65

  for (let i = 0; i < count; i++) {
    const angle = (i * Math.PI * 2) / count
    const x = fw.x + Math.cos(angle) * radius
    const y = fw.y + Math.sin(angle) * radius - 80

    // 红黄相间
    const isRed = i % 2 === 0
    const color = isRed ? '#FF0000' : '#FFDE00'

    ctx.globalAlpha = opacity * (1 - progress * 0.3)
    ctx.fillStyle = color

    ctx.beginPath()
    ctx.arc(x, y, 6, 0, Math.PI * 2)
    ctx.fill()

    // 外圈高亮
    if (isRed) {
      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 1
      ctx.globalAlpha = opacity * 0.4
      ctx.stroke()
    }
  }
}

export function renderFrame(ctx: CanvasRenderingContext2D, w: number, h: number, fws: Firework[], t: number): void {
  clearCanvas(ctx, w, h)
  for (const fw of fws) {
    if (!fw.hasExploded && fw.currentLaunchY !== undefined) {
      drawLaunchingFirework(ctx, fw)
    }
  }
  for (const fw of fws) {
    for (const p of fw.particles) {
      drawParticle(ctx, p)
    }
  }
  drawFireworkTexts(ctx, w, h, fws, t)
}

