// ============================================================================
// 文字粒子生成器 - 将文字转换为烟花粒子坐标
// 用于实现"用烟花显示文字"的效果
// ============================================================================

import type { Particle } from '@/types'

/**
 * 文字粒子配置
 */
interface TextParticleConfig {
  text: string
  centerX: number
  centerY: number
  fontSize: number
  color: string
  particleDensity?: number  // 粒子密度 (1-10)
}

/**
 * 使用 Canvas 获取文字的像素点位置
 * 这是实现文字烟花的核心算法
 */
export function getTextPixelPositions(
  text: string,
  fontSize: number = 80,
  density: number = 3
): { x: number; y: number }[] {
  // 创建离屏 Canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  
  // 设置 Canvas 尺寸（足够大以容纳文字）
  const estimatedWidth = text.length * fontSize * 1.2
  const estimatedHeight = fontSize * 1.5
  canvas.width = estimatedWidth
  canvas.height = estimatedHeight
  
  // 设置字体样式
  ctx.font = `bold ${fontSize}px "Noto Serif SC", "华文行楷", "楷体", serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#FFFFFF'
  
  // 绘制文字到 Canvas
  ctx.fillText(text, estimatedWidth / 2, estimatedHeight / 2)
  
  // 获取像素数据
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = imageData.data
  
  const positions: { x: number; y: number }[] = []
  const step = Math.max(1, Math.floor(6 - density))  // 采样间隔
  
  // 遍历像素，找出非透明的点
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const index = (y * canvas.width + x) * 4
      const alpha = pixels[index + 3]
      
      // 如果像素不透明，记录位置
      if (alpha > 128) {
        // 转换为相对于中心的坐标
        positions.push({
          x: x - estimatedWidth / 2,
          y: y - estimatedHeight / 2
        })
      }
    }
  }
  
  return positions
}

/**
 * 生成文字烟花的粒子数组
 * 粒子会从爆炸中心飞向文字位置
 */
export function createTextFireworkParticles(
  config: TextParticleConfig
): Particle[] {
  const {
    text,
    centerX,
    centerY,
    fontSize,
    color,
    particleDensity = 4
  } = config
  
  // 获取文字的像素位置
  const textPositions = getTextPixelPositions(text, fontSize, particleDensity)
  
  const particles: Particle[] = []
  
  // 多种颜色用于文字烟花
  const colors = [
    color,
    '#FFD700',  // 金色
    '#FFA500',  // 橙色
    '#FF6347',  // 番茄红
    '#FFFFFF'   // 白色高光
  ]
  
  for (const pos of textPositions) {
    // 计算目标位置
    const targetX = centerX + pos.x
    const targetY = centerY + pos.y
    
    // 计算从中心到目标的方向
    const dx = targetX - centerX
    const dy = targetY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // 初始速度（指向目标位置）
    const speed = distance * 2.5 + Math.random() * 50
    const angle = Math.atan2(dy, dx)
    const vx = Math.cos(angle) * speed
    const vy = Math.sin(angle) * speed
    
    // 随机选择颜色
    const particleColor = colors[Math.floor(Math.random() * colors.length)]
    
    const particle: Particle = {
      x: centerX,
      y: centerY,
      vx,
      vy,
      life: 1.2,
      color: particleColor,
      size: 2 + Math.random() * 2,
      opacity: 1,
      friction: 0.92,  // 较高阻力使粒子停在目标位置
      trail: [{ x: centerX, y: centerY, opacity: 1 }],
      isTextParticle: true,
      targetX,
      targetY
    }
    
    particles.push(particle)
  }
  
  // 添加一些装饰性的散射粒子
  const decorCount = Math.floor(textPositions.length * 0.2)
  for (let i = 0; i < decorCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 100 + Math.random() * 150
    
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 1.5 + Math.random() * 1.5,
      opacity: 1,
      friction: 0.98,
      trail: [{ x: centerX, y: centerY, opacity: 1 }]
    })
  }
  
  return particles
}

/**
 * 更新文字烟花粒子
 * 文字粒子有特殊的运动规律：飞向目标位置后停留
 */
export function updateTextParticle(particle: Particle, dt: number = 0.016): void {
  if (!particle.trail) {
    particle.trail = []
  }
  
  // 记录轨迹
  particle.trail.unshift({ x: particle.x, y: particle.y, opacity: particle.opacity })
  if (particle.trail.length > 8) {
    particle.trail.pop()
  }
  
  // 更新轨迹透明度
  for (let i = 0; i < particle.trail.length; i++) {
    particle.trail[i].opacity = particle.opacity * (1 - i / particle.trail.length) * 0.6
  }
  
  if (particle.isTextParticle && particle.targetX !== undefined && particle.targetY !== undefined) {
    // 文字粒子：向目标位置移动
    const dx = particle.targetX - particle.x
    const dy = particle.targetY - particle.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > 5) {
      // 还没到目标，继续移动
      particle.vx *= particle.friction
      particle.vy *= particle.friction
      particle.x += particle.vx * dt
      particle.y += particle.vy * dt
    } else {
      // 到达目标，停留并缓慢消失
      particle.x = particle.targetX
      particle.y = particle.targetY
      particle.vx = 0
      particle.vy = 0
      particle.life -= dt * 0.15  // 慢速消失
    }
  } else {
    // 普通装饰粒子
    particle.vy += 60 * dt
    particle.vx *= particle.friction
    particle.vy *= particle.friction
    particle.x += particle.vx * dt
    particle.y += particle.vy * dt
    particle.life -= dt * 0.5
  }
  
  particle.opacity = Math.max(0, Math.pow(particle.life, 0.6))
  particle.size *= 0.999
}

/**
 * 获取文字烟花显示的推荐配置
 */
export function getTextFireworkConfig(
  text: string,
  canvasWidth: number,
  canvasHeight: number
): TextParticleConfig {
  // 根据文字长度调整字体大小
  let fontSize = 80
  if (text.length > 6) {
    fontSize = 50
  } else if (text.length > 4) {
    fontSize = 65
  }
  
  // 确保文字不超出屏幕
  const maxWidth = canvasWidth * 0.8
  const estimatedWidth = text.length * fontSize * 0.8
  if (estimatedWidth > maxWidth) {
    fontSize = Math.floor(maxWidth / (text.length * 0.8))
  }
  
  return {
    text,
    centerX: canvasWidth / 2,
    centerY: canvasHeight * 0.4,  // 稍微偏上
    fontSize,
    color: '#FFD700',
    particleDensity: 4
  }
}

