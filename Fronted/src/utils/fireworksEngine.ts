// ============================================================================
// 烟花引擎 - 真实物理烟花系统
// 特性：从屏幕外起飞、径向爆炸、多彩随机颜色、60fps流畅、起承转合节奏
// ============================================================================

import type { Firework, Particle, FireworkType } from '@/types'

// 丰富的烟花颜色库 - 每朵烟花随机选取
const FIREWORK_COLORS = [
  // 红色系
  '#FF0000', '#FF3333', '#FF6666', '#DC143C', '#B22222', '#FF4500',
  // 金色系
  '#FFD700', '#FFA500', '#FFAE42', '#F5DEB3', '#FFE4B5',
  // 绿色系
  '#00FF00', '#32CD32', '#7CFC00', '#00FA9A', '#98FB98', '#90EE90',
  // 蓝色系
  '#00BFFF', '#1E90FF', '#4169E1', '#0000FF', '#00CED1', '#87CEEB',
  // 紫色系
  '#9400D3', '#8A2BE2', '#BA55D3', '#EE82EE', '#FF00FF', '#DA70D6',
  // 粉色系
  '#FF1493', '#FF69B4', '#FFB6C1', '#DB7093',
  // 青色系
  '#00FFFF', '#40E0D0', '#48D1CC', '#7FFFD4',
  // 白色系（用于核心和亮点）
  '#FFFFFF', '#FFFACD', '#F0FFFF'
]

// 节日烟花的专属颜色库
const HOLIDAY_COLOR_SETS: Record<string, string[]> = {
  'red_fireworks': ['#FF0000', '#DC143C', '#B22222', '#FF4500', '#FFFFFF'],  // 春节、除夕
  'golden_lantern': ['#FFD700', '#FFA500', '#FF8C00', '#FFAE42', '#FFFFFF'],  // 元宵
  'dragon_red': ['#FF6347', '#DC143C', '#8B0000', '#FF4500', '#FFFFFF'],      // 端午
  'magenta_romance': ['#FF1493', '#FF69B4', '#DDA0DD', '#EE82EE', '#FFFFFF'], // 七夕
  'silver_moon': ['#E0E6FF', '#B0C4DE', '#87CEEB', '#B0E0E6', '#FFFFFF']      // 中秋
}

/**
 * 获取随机烟花颜色组合
 * 每朵烟花的颜色完全随机
 */
export function getRandomFireworkColors(): string[] {
  const colorCount = 2 + Math.floor(Math.random() * 3) // 2-4种颜色
  const colors: string[] = []
  const availableColors = [...FIREWORK_COLORS]

  for (let i = 0; i < colorCount; i++) {
    const idx = Math.floor(Math.random() * availableColors.length)
    colors.push(availableColors[idx])
    availableColors.splice(idx, 1)
  }

  // 添加白色作为核心亮色
  if (Math.random() > 0.3) {
    colors.unshift('#FFFFFF')
  }

  return colors
}

/**
 * 创建单个粒子
 */
function createParticle(
  x: number,
  y: number,
  vx: number,
  vy: number,
  color: string,
  size: number = 4,
  life: number = 1
): Particle {
  return {
    x,
    y,
    vx,
    vy,
    life,
    color,
    size,
    opacity: 1,
    friction: 0.985,  // 更真实的空气阻力
    trail: [{ x, y, opacity: 1 }]  // 初始化轨迹
  }
}

// 轨迹最大长度
const MAX_TRAIL_LENGTH = 12

/**
 * 更新粒子的物理状态 - 真实物理模拟
 */
export function updateParticle(particle: Particle, dt: number = 0.016): void {
  // 记录当前位置到轨迹
  if (!particle.trail) {
    particle.trail = []
  }

  // 添加当前位置到轨迹头部
  particle.trail.unshift({ x: particle.x, y: particle.y, opacity: particle.opacity })

  // 限制轨迹长度
  if (particle.trail.length > MAX_TRAIL_LENGTH) {
    particle.trail.pop()
  }

  // 更新轨迹点的透明度（逐渐消失）
  for (let i = 0; i < particle.trail.length; i++) {
    particle.trail[i].opacity = particle.opacity * (1 - i / particle.trail.length) * 0.8
  }

  // 真实重力加速度（调整为视觉效果）
  particle.vy += 120 * dt  // 重力

  // 空气阻力
  particle.vx *= particle.friction
  particle.vy *= particle.friction

  // 更新位置
  particle.x += particle.vx * dt
  particle.y += particle.vy * dt

  // 生命衰减
  particle.life -= dt * 0.4

  // 透明度随生命值非线性衰减（更自然的消散效果）
  particle.opacity = Math.max(0, Math.pow(particle.life, 0.7))

  // 粒子尺寸随生命值略微缩小
  particle.size *= 0.998
}

// ============================================================================
// 真实烟花爆炸粒子生成 - 径向爆炸效果
// ============================================================================

/**
 * 创建真实径向爆炸粒子
 * 模拟真实烟花的球形爆炸效果
 */
export function createExplosionParticles(
  x: number,
  y: number,
  count: number,
  force: number = 350,
  colors: string[]
): Particle[] {
  const particles: Particle[] = []

  // 多层爆炸，模拟真实烟花的层次感
  const layers = 3
  for (let layer = 0; layer < layers; layer++) {
    const layerCount = Math.floor(count / layers)
    const layerForce = force * (1 - layer * 0.15)  // 外层速度略慢
    const layerDelay = layer * 0.1  // 层间延迟

    for (let i = 0; i < layerCount; i++) {
      // 均匀的角度分布 + 微小随机偏移
      const baseAngle = (i / layerCount) * Math.PI * 2
      const angle = baseAngle + (Math.random() - 0.5) * 0.3

      // 速度随机变化，产生自然的不规则边缘
      const speedVariation = 0.7 + Math.random() * 0.6
      const speed = layerForce * speedVariation

      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed

      // 随机选择颜色
      const color = colors[Math.floor(Math.random() * colors.length)]

      // 粒子大小随层次变化
      const size = 2.5 + Math.random() * 2.5 - layer * 0.5

      // 生命值略有变化
      const life = 1 - layerDelay + (Math.random() - 0.5) * 0.2

      const particle = createParticle(x, y, vx, vy, color, Math.max(1.5, size), life)
      particles.push(particle)
    }
  }

  // 添加核心亮点粒子
  for (let i = 0; i < 15; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = force * 0.3 * Math.random()
    const particle = createParticle(
      x, y,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      '#FFFFFF',
      1.5 + Math.random() * 2,
      0.8
    )
    particles.push(particle)
  }

  return particles
}

/**
 * 根据烟花类型生成对应的粒子
 */
export function generateFireworkParticles(
  type: FireworkType,
  x: number,
  y: number,
  force: number,
  colors: string[],
  particleCount: number
): Particle[] {
  switch (type) {
    case 'bloom':
      return createBloomParticles(x, y, particleCount, force, colors)
    case 'ring':
      return createRingParticles(x, y, particleCount, force, colors)
    case 'chrysanthemum':
      return createChrysanthemumParticles(x, y, particleCount, force, colors)
    case 'willow':
      return createWillowParticles(x, y, particleCount, force, colors)
    case 'peony':
      return createPeonyParticles(x, y, particleCount, force, colors)
    case 'palm':
      return createPalmParticles(x, y, particleCount, force, colors)
    case 'crossette':
      return createCrossetteParticles(x, y, particleCount, force, colors)
    case 'star':
      return createStarParticles(x, y, particleCount, force, colors)
    case 'zongzi':
      return createZongziParticles(x, y, particleCount, force, colors)
    case 'text':
      return createExplosionParticles(x, y, particleCount, force, colors)
    default:
      return createExplosionParticles(x, y, particleCount, force, colors)
  }
}

// ============================================================================
// 各类型真实烟花粒子生成
// ============================================================================

/**
 * 经典绽放型 - 球形均匀爆炸
 */
function createBloomParticles(
  x: number, y: number, count: number, force: number, colors: string[]
): Particle[] {
  return createExplosionParticles(x, y, count, force, colors)
}

/**
 * 环形烟花 - 双环扩散
 */
function createRingParticles(
  x: number, y: number, count: number, force: number, colors: string[]
): Particle[] {
  const particles: Particle[] = []

  // 内环
  for (let i = 0; i < count * 0.4; i++) {
    const angle = (i / (count * 0.4)) * Math.PI * 2
    const speed = force * 0.6
    const color = colors[i % colors.length]
    particles.push(createParticle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 3))
  }

  // 外环
  for (let i = 0; i < count * 0.6; i++) {
    const angle = (i / (count * 0.6)) * Math.PI * 2
    const speed = force
    const color = colors[i % colors.length]
    particles.push(createParticle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 2.5))
  }

  return particles
}

/**
 * 菊花型烟花 - 长尾下垂效果
 */
function createChrysanthemumParticles(
  x: number, y: number, count: number, force: number, colors: string[]
): Particle[] {
  const particles: Particle[] = []

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const speed = force * (0.8 + Math.random() * 0.4)
    const color = colors[Math.floor(Math.random() * colors.length)]

    // 菊花型粒子有更长的生命和更慢的消散
    const particle = createParticle(
      x, y,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed - 30,  // 略向上偏移
      color,
      2 + Math.random() * 2,
      1.2  // 更长生命
    )
    particle.friction = 0.975  // 更大阻力，形成下垂效果
    particles.push(particle)
  }

  return particles
}

/**
 * 垂柳型烟花 - 下垂拖尾效果
 */
function createWillowParticles(
  x: number, y: number, count: number, force: number, colors: string[]
): Particle[] {
  const particles: Particle[] = []

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const speed = force * (0.5 + Math.random() * 0.5)
    const color = colors[Math.floor(Math.random() * colors.length)]

    const particle = createParticle(
      x, y,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      color,
      1.5 + Math.random() * 1.5,
      1.5  // 更长生命形成拖尾
    )
    particle.friction = 0.96  // 高阻力
    particles.push(particle)
  }

  return particles
}

/**
 * 牡丹型烟花 - 大而圆润
 */
function createPeonyParticles(
  x: number, y: number, count: number, force: number, colors: string[]
): Particle[] {
  const particles: Particle[] = []

  // 密集的核心
  for (let i = 0; i < count * 0.3; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = force * 0.4 * Math.random()
    const color = colors[0] || '#FFFFFF'
    particles.push(createParticle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 4))
  }

  // 外层花瓣
  for (let i = 0; i < count * 0.7; i++) {
    const angle = (i / (count * 0.7)) * Math.PI * 2 + (Math.random() - 0.5) * 0.2
    const speed = force * (0.7 + Math.random() * 0.3)
    const color = colors[Math.floor(Math.random() * colors.length)]
    particles.push(createParticle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 3 + Math.random() * 2))
  }

  return particles
}

/**
 * 棕榈型烟花 - 宽大散开，粒子密集
 */
function createPalmParticles(
  x: number, y: number, count: number, force: number, colors: string[]
): Particle[] {
  const particles: Particle[] = []

  // 多个方向的密集发射
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const speed = force * (0.6 + Math.random() * 0.7)
    const color = colors[Math.floor(Math.random() * colors.length)]
    const size = 2 + Math.random() * 3
    particles.push(
      createParticle(
        x, y,
        Math.cos(angle) * speed + (Math.random() - 0.5) * 50,
        Math.sin(angle) * speed + (Math.random() - 0.5) * 50,
        color,
        size,
        1 + Math.random() * 0.5
      )
    )
  }

  return particles
}

/**
 * 十字型烟花 - 十字方向爆炸
 */
function createCrossetteParticles(
  x: number, y: number, count: number, force: number, colors: string[]
): Particle[] {
  const particles: Particle[] = []

  // 四个主方向 + 四个斜方向（十字）
  const directions = [
    { angle: 0 }, { angle: Math.PI / 2 }, { angle: Math.PI }, { angle: Math.PI * 3 / 2 },
    { angle: Math.PI / 4 }, { angle: Math.PI * 3 / 4 }, { angle: Math.PI * 5 / 4 }, { angle: Math.PI * 7 / 4 }
  ]

  const particlesPerDirection = Math.floor(count / 8)
  for (const dir of directions) {
    for (let i = 0; i < particlesPerDirection; i++) {
      const angleVariation = (Math.random() - 0.5) * 0.4
      const angle = dir.angle + angleVariation
      const speed = force * (0.8 + Math.random() * 0.4)
      const color = colors[Math.floor(Math.random() * colors.length)]
      particles.push(
        createParticle(
          x, y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          color,
          2.5 + Math.random() * 2
        )
      )
    }
  }

  return particles
}

/**
 * 星形烟花 - 五星爆炸
 */
function createStarParticles(
  x: number, y: number, count: number, force: number, colors: string[]
): Particle[] {
  const particles: Particle[] = []

  // 五个方向形成五星
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5  // 72度间隔
    const particlesPerBranch = Math.floor(count / 5)

    for (let j = 0; j < particlesPerBranch; j++) {
      const angleVar = (Math.random() - 0.5) * 0.5
      const speedVar = 0.7 + Math.random() * 0.6
      const particleAngle = angle + angleVar
      const speed = force * speedVar
      const color = colors[Math.floor(Math.random() * colors.length)]

      particles.push(
        createParticle(
          x, y,
          Math.cos(particleAngle) * speed,
          Math.sin(particleAngle) * speed,
          color,
          2 + Math.random() * 2.5
        )
      )
    }
  }

  return particles
}

/**
 * 粽子型烟花 - 端午专用，不规则散开
 */
function createZongziParticles(
  x: number, y: number, count: number, force: number, colors: string[]
): Particle[] {
  const particles: Particle[] = []

  // 模拟粽子形状 - 中心密集，周围不规则散开
  const coreCount = Math.floor(count * 0.4)
  const outerCount = count - coreCount

  // 中心核心（密集）
  for (let i = 0; i < coreCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = force * (0.3 + Math.random() * 0.4)
    const color = colors[Math.floor(Math.random() * colors.length)]
    particles.push(
      createParticle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        color,
        3 + Math.random() * 2,
        1.2
      )
    )
  }

  // 周围不规则散开
  for (let i = 0; i < outerCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = force * (0.6 + Math.random() * 0.5)
    const color = colors[Math.floor(Math.random() * colors.length)]
    particles.push(
      createParticle(
        x, y,
        Math.cos(angle) * speed + (Math.random() - 0.5) * 100,
        Math.sin(angle) * speed + (Math.random() - 0.5) * 100,
        color,
        2 + Math.random() * 2,
        1 + Math.random() * 0.3
      )
    )
  }

  return particles
}
export function createFirework(
  id: string,
  startTime: number,
  canvasWidth: number,
  canvasHeight: number,
  _seed: number = Date.now(),
  isTextFirework: boolean = false,           // 新增：是否为文字烟花
  isHolidayFirework: boolean = false,        // 新增：是否为节日烟花
  holidayEffectType?: string,                // 新增：节日效果类型（用于配色）
  maxTextWidth?: number                      // 新增：最大文字宽度（用于边界检查）
): Firework {
  // 文字烟花和节日烟花的样式特殊化
  let type: FireworkType
  let explosionForce: number
  let particleCount: number
  let specialColors: string[] | undefined = undefined

  if (isHolidayFirework && holidayEffectType) {
    // 节日烟花：使用不同的烟花类型组合
    let holidayTypes: FireworkType[] = ['peony', 'palm', 'crossette', 'bloom', 'ring']

    // 端午节特殊处理：使用粽子形
    if (holidayEffectType === 'dragon_red') {
      holidayTypes = ['zongzi', 'zongzi', 'zongzi', 'peony', 'palm']  // 80%粽子形
    }

    type = holidayTypes[Math.floor(Math.random() * holidayTypes.length)]
    explosionForce = 320 + Math.random() * 100
    particleCount = 100 + Math.floor(Math.random() * 50)
    specialColors = HOLIDAY_COLOR_SETS[holidayEffectType] || FIREWORK_COLORS
  } else if (isTextFirework) {
    // 文字烟花：使用绽放型或环形，金色系
    type = Math.random() > 0.5 ? 'bloom' : 'ring'
    explosionForce = 300 + Math.random() * 80
    particleCount = 90 + Math.floor(Math.random() * 40)
    specialColors = ['#FFD700', '#FFA500', '#FFFF00', '#FF8C00', '#FFFFFF']
  } else {
    // 普通烟花：所有类型随机组合（增加星形）
    const types: FireworkType[] = ['bloom', 'ring', 'chrysanthemum', 'willow', 'peony', 'palm', 'crossette', 'star']
    type = types[Math.floor(Math.random() * types.length)]
    explosionForce = 280 + Math.random() * 120
    particleCount = 80 + Math.floor(Math.random() * 40)
  }

  // 水平位置：在屏幕宽度15%-85%范围内随机
  // 如果是文字烟花，需要预留文字宽度的空间
  let minX = canvasWidth * 0.15
  let maxX = canvasWidth * 0.85

  if (isTextFirework && maxTextWidth) {
    // 文字烟花：预留文字宽度空间，确保文字不超出屏幕
    // 一行最多9个字，所以预留距离 = 一行字的宽度
    const padding = maxTextWidth / 2  // 左右各预留一半的宽度
    minX = Math.max(canvasWidth * 0.05, padding)
    maxX = Math.min(canvasWidth * 0.95, canvasWidth - padding)
  }

  const x = minX + Math.random() * (maxX - minX)

  // 爆炸高度：屏幕高度的15%-45%处（从顶部算，之前是20%-55%）
  // 改为15%-45%使烟花飞得更高
  const explosionY = canvasHeight * 0.15 + Math.random() * canvasHeight * 0.3

  // 起始位置：屏幕底部外侧（屏幕高度+额外距离）
  const startY = canvasHeight + 100 + Math.random() * 50

  // 升空时长：根据距离计算，保证流畅的上升速度
  const distance = startY - explosionY
  const launchDuration = 800 + Math.random() * 400  // 0.8-1.2秒

  // 显示时长
  const displayDuration = 2500 + Math.random() * 1500

  // 随机颜色组合（文字烟花使用特殊颜色）
  const colors = specialColors || getRandomFireworkColors()

  // 构建 holiday 对象（如果是节日烟花）
  const holiday = isHolidayFirework && holidayEffectType ? {
    name: '节日',
    wish: '欢庆节日',
    effectType: holidayEffectType
  } : undefined

  return {
    id,
    type,
    startTime,
    launchDuration,
    explosionTime: startTime + launchDuration,
    displayDuration,
    x,
    y: explosionY,
    launchHeight: distance,
    explosionForce,
    particleCount,
    colors,
    particles: [],
    isFinished: false,
    // 新增：起始位置用于绘制升空轨迹
    startY,
    // 新增：节日信息
    holiday,
    // 新增：是否为节日文字烟花（用于区分特效）
    isHolidayText: isHolidayFirework && isTextFirework
  } as Firework & { startY: number }
}

