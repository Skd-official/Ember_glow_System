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
 * 
 * @param text - 要显示的文字
 * @param fontSize - 字体大小
 * @param spacing - 粒子间距（越大越稀疏，文字越清晰）
 */
export function getTextPixelPositions(
  text: string,
  fontSize: number = 120,
  spacing: number = 6
): { x: number; y: number }[] {
  // 创建离屏 Canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  
  // 检测是否包含换行（双行文字）
  const lines = text.split('\n')
  const lineCount = lines.length
  const maxLineLength = Math.max(...lines.map(l => l.length))
  
  // 设置 Canvas 尺寸（足够大以容纳文字）
  const estimatedWidth = maxLineLength * fontSize * 1.2
  const estimatedHeight = fontSize * lineCount * 1.4
  canvas.width = estimatedWidth
  canvas.height = estimatedHeight
  
  // 设置字体样式
  ctx.font = `bold ${fontSize}px "Noto Serif SC", "华文行楷", "楷体", serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#FFFFFF'
  
  // 绘制文字到 Canvas（支持多行）
  const lineHeight = fontSize * 1.3
  const startY = (estimatedHeight - (lineCount - 1) * lineHeight) / 2
  
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], estimatedWidth / 2, startY + i * lineHeight)
  }
  
  // 获取像素数据
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = imageData.data
  
  const positions: { x: number; y: number }[] = []
  // 【关键】增大采样间隔，让文字粒子更稀疏、更清晰可读
  // spacing 越大，粒子越少，文字越清晰
  const step = Math.max(4, spacing)  // 最小间隔4像素
  
  // 遍历像素，找出非透明的点
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const index = (y * canvas.width + x) * 4
      const alpha = pixels[index + 3]
      
      // 如果像素不透明，记录位置
      if (alpha > 128) {
        // 转换为相对于中心的坐标，并放大间距
        positions.push({
          x: (x - estimatedWidth / 2) * 1.5,   // 放大1.5倍间距
          y: (y - estimatedHeight / 2) * 1.5
        })
      }
    }
  }
  
  return positions
}

/**
 * 生成文字烟花的粒子数组
 * 粒子会从爆炸中心飞向文字位置，然后缓慢下沉消失
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
    particleDensity = 6  // 默认间距增大，让文字更清晰
  } = config
  
  // 获取文字的像素位置
  const textPositions = getTextPixelPositions(text, fontSize, particleDensity)
  
  const particles: Particle[] = []
  
  // 金色系为主的颜色（更醒目）
  const colors = [
    '#FFD700',  // 金色（主色）
    '#FFC125',  // 深金色
    '#FFEC8B',  // 浅金色
    '#FFFFFF',  // 白色高光
    color       // 配置颜色
  ]
  
  for (const pos of textPositions) {
    // 计算目标位置
    const targetX = centerX + pos.x
    const targetY = centerY + pos.y
    
    // 计算从中心到目标的方向
    const dx = targetX - centerX
    const dy = targetY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // 初始速度（指向目标位置）- 速度更快让粒子更快到达
    const speed = distance * 3.5 + Math.random() * 80
    const angle = Math.atan2(dy, dx)
    const vx = Math.cos(angle) * speed
    const vy = Math.sin(angle) * speed
    
    // 随机选择颜色（金色系为主）
    const colorIndex = Math.random() < 0.7 
      ? Math.floor(Math.random() * 3)  // 70%概率选金色系
      : Math.floor(Math.random() * colors.length)
    const particleColor = colors[colorIndex]
    
    const particle: Particle = {
      x: centerX,
      y: centerY,
      vx,
      vy,
      life: 3.0,  // 增加生命周期，让文字显示更久
      color: particleColor,
      size: 4 + Math.random() * 2,  // 【增大粒子】让文字更醒目
      opacity: 1,
      friction: 0.85,  // 阻力让粒子更快停下
      trail: [{ x: centerX, y: centerY, opacity: 1 }],
      isTextParticle: true,
      targetX,
      targetY,
      // 新增：下沉相关属性
      hasReachedTarget: false,
      sinkStartTime: 0,
      sinkDuration: 1.5 + Math.random() * 1  // 1.5-2.5秒下沉时间
    }
    
    particles.push(particle)
  }
  
  // 减少装饰粒子，避免干扰文字显示
  const decorCount = Math.floor(textPositions.length * 0.1)
  for (let i = 0; i < decorCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 80 + Math.random() * 100
    
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.6,
      color: colors[Math.floor(Math.random() * 3)],
      size: 1.5 + Math.random() * 1,
      opacity: 1,
      friction: 0.98,
      trail: [{ x: centerX, y: centerY, opacity: 1 }]
    })
  }
  
  return particles
}

/**
 * 更新文字烟花粒子
 * 文字粒子有特殊的运动规律：飞向目标位置 → 停留显示 → 缓慢下沉消失
 */
export function updateTextParticle(particle: Particle, dt: number = 0.016): void {
  if (!particle.trail) {
    particle.trail = []
  }
  
  // 记录轨迹（文字粒子到达目标后减少轨迹）
  if (!particle.hasReachedTarget) {
    particle.trail.unshift({ x: particle.x, y: particle.y, opacity: particle.opacity })
    if (particle.trail.length > 8) {
      particle.trail.pop()
    }
  } else {
    // 到达目标后，逐渐清除轨迹
    if (particle.trail.length > 0) {
      particle.trail.pop()
    }
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
    
    if (!particle.hasReachedTarget && distance > 3) {
      // 阶段1：还没到目标，继续移动
      particle.vx *= particle.friction
      particle.vy *= particle.friction
      particle.x += particle.vx * dt
      particle.y += particle.vy * dt
    } else if (!particle.hasReachedTarget) {
      // 刚到达目标，标记并开始计时
      particle.hasReachedTarget = true
      particle.sinkStartTime = particle.life  // 记录到达时的生命值
      particle.x = particle.targetX
      particle.y = particle.targetY
      particle.vx = 0
      particle.vy = 0
    } else {
      // 阶段2：到达目标后，先停留显示，然后缓慢下沉消失
      const timeAtTarget = (particle.sinkStartTime || 2.5) - particle.life
      const sinkDuration = particle.sinkDuration || 2
      
      if (timeAtTarget < 0.8) {
        // 前0.8秒：停留不动，保持高亮
        particle.life -= dt * 0.3
      } else if (timeAtTarget < sinkDuration) {
        // 之后：开始缓慢下沉
        particle.vy = 15 + (timeAtTarget - 0.8) * 10  // 逐渐加速下沉
        particle.y += particle.vy * dt
        particle.life -= dt * 0.5
      } else {
        // 下沉结束，快速消失
        particle.life -= dt * 1.5
      }
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
  
  // 透明度计算：文字粒子在显示阶段保持高亮
  if (particle.hasReachedTarget) {
    const timeAtTarget = (particle.sinkStartTime || 2.5) - particle.life
    if (timeAtTarget < 0.8) {
      // 显示阶段保持高亮
      particle.opacity = Math.min(1, particle.opacity + dt * 2)
    } else {
      // 下沉阶段逐渐消失
      particle.opacity = Math.max(0, particle.life / 1.5)
    }
  } else {
    particle.opacity = Math.max(0, Math.pow(particle.life, 0.6))
  }
  
  particle.size *= 0.9995
}

/**
 * 获取文字烟花显示的推荐配置
 * 文字显示在《烟火漫游》标题上方，居中对齐
 */
export function getTextFireworkConfig(
  text: string,
  canvasWidth: number,
  canvasHeight: number
): TextParticleConfig {
  // 检测是否是多行文字（包含换行符）
  const lines = text.split('\n')
  const lineCount = lines.length
  const maxLineLength = Math.max(...lines.map(l => l.length))
  
  // 根据屏幕宽度和文字长度动态计算字体大小
  // 基准：1920px宽度时，4个字用120px
  const baseWidth = 1920
  const baseFontSize = 120
  const scaleFactor = canvasWidth / baseWidth
  
  let fontSize = Math.floor(baseFontSize * scaleFactor)
  
  // 根据文字长度调整
  if (maxLineLength > 8) {
    fontSize = Math.floor(fontSize * 0.6)
  } else if (maxLineLength > 6) {
    fontSize = Math.floor(fontSize * 0.75)
  } else if (maxLineLength > 4) {
    fontSize = Math.floor(fontSize * 0.9)
  }
  
  // 限制字体大小范围
  fontSize = Math.max(40, Math.min(150, fontSize))
  
  // 确保文字不超出屏幕宽度
  const maxWidth = canvasWidth * 0.85
  const estimatedWidth = maxLineLength * fontSize * 0.9
  if (estimatedWidth > maxWidth) {
    fontSize = Math.floor(maxWidth / (maxLineLength * 0.9))
  }
  
  // 计算Y位置：在标题上方
  // 标题大约在屏幕中下部（约55%位置），文字烟花显示在其上方
  // 单行文字：标题上方约 20% 位置
  // 双行文字：标题上方约 25% 位置（需要更多空间）
  const titleY = canvasHeight * 0.55  // 标题大约位置
  const textHeight = fontSize * lineCount * 1.3
  const margin = canvasHeight * 0.08  // 与标题的间距
  
  // 文字中心Y = 标题位置 - 间距 - 文字高度的一半
  const centerY = titleY - margin - textHeight / 2
  
  // 确保不会太靠近顶部
  const finalCenterY = Math.max(canvasHeight * 0.2, Math.min(centerY, canvasHeight * 0.35))
  
  return {
    text,
    centerX: canvasWidth / 2,  // 水平居中
    centerY: finalCenterY,
    fontSize,
    color: '#FFD700',  // 金色
    particleDensity: 8  // 【增大间距】让文字更清晰可读
  }
}

