// ============================================================================
// 烟花序列系统 - 实现起承转合的节奏控制
// 特性：开始(一朵一朵) → 高潮(重叠爆炸) → 结尾(多朵齐放)
// 支持：文字烟花、节日祝福
// ============================================================================

import type { Firework, FireworkSequence } from '@/types'
import { createFirework, generateFireworkParticles, updateParticle } from './fireworksEngine'
import { detectHoliday, getRandomWish } from './holidaySystem'
import { getRandomText } from './textFireworks'
import { createTextFireworkParticles, updateTextParticle, getTextFireworkConfig } from './textParticleGenerator'

/**
 * 烟花表演阶段
 */
type PerformancePhase = 'opening' | 'building' | 'climax' | 'finale'

/**
 * 生成起承转合的烟花序列配置
 */
export function generateFireworkSequence(
  canvasWidth: number,
  canvasHeight: number,
  startTime: number = 0,
  _seed: number = Date.now()
): FireworkSequence {
  const holiday = detectHoliday()

  // 起承转合的烟花数量分配
  const totalFireworks = 16 + Math.floor(Math.random() * 6)  // 16-21朵

  // 决定是否显示文字烟花
  // 节日时80%概率显示，平时30%概率显示
  const showText = holiday ? Math.random() < 0.8 : Math.random() < 0.3

  // 文字烟花位置：开场后第2-3朵，或高潮期间
  let textFireworkIndex = -1
  let displayText: string | undefined = undefined

  if (showText) {
    // 随机选择在开场(索引2-3)或高潮期间(索引8-12)显示
    const isOpeningText = Math.random() < 0.4
    if (isOpeningText) {
      textFireworkIndex = 2 + Math.floor(Math.random() * 2)  // 2-3
    } else {
      textFireworkIndex = 8 + Math.floor(Math.random() * 5)  // 8-12
    }

    // 选择显示的文字
    if (holiday) {
      displayText = getRandomWish(holiday)
    } else {
      displayText = getRandomText()
    }
  }

  return {
    totalFireworks,
    textFireworkIndex,
    displayText,
    holiday: {
      detected: holiday !== null,
      name: holiday?.name,
      effectType: holiday?.effectType
    }
  }
}

/**
 * 生成起承转合节奏的烟花列表
 */
export function generateFireworks(
  sequence: FireworkSequence,
  canvasWidth: number,
  canvasHeight: number,
  startTime: number = 0
): Firework[] {
  const fireworks: Firework[] = []
  const total = sequence.totalFireworks

  // 阶段划分
  const openingCount = 3 + Math.floor(Math.random() * 2)    // 3-4朵
  const buildingCount = 4 + Math.floor(Math.random() * 2)   // 4-5朵
  const climaxCount = 5 + Math.floor(Math.random() * 2)     // 5-6朵
  const finaleCount = total - openingCount - buildingCount - climaxCount  // 剩余

  let currentTime = startTime
  let index = 0

  // ============ 开场阶段：一朵一朵，间隔较长 ============
  for (let i = 0; i < openingCount; i++) {
    const firework = createFirework(`fw-${index}`, currentTime, canvasWidth, canvasHeight)

    // 检查是否是文字烟花
    if (index === sequence.textFireworkIndex && sequence.displayText) {
      firework.type = 'text'
      firework.displayText = sequence.displayText
    }

    fireworks.push(firework)
    index++
    // 等待当前烟花爆炸后再发射下一朵（间隔1.5-2秒）
    currentTime += firework.launchDuration + 800 + Math.random() * 500
  }

  // ============ 过渡阶段：开始重叠，间隔缩短 ============
  for (let i = 0; i < buildingCount; i++) {
    const firework = createFirework(`fw-${index}`, currentTime, canvasWidth, canvasHeight)

    if (index === sequence.textFireworkIndex && sequence.displayText) {
      firework.type = 'text'
      firework.displayText = sequence.displayText
    }

    fireworks.push(firework)
    index++
    // 前一朵还在爆炸时就发射下一朵（间隔0.8-1.2秒）
    currentTime += 600 + Math.random() * 400
  }

  // ============ 高潮阶段：密集重叠，多朵同时在空中 ============
  for (let i = 0; i < climaxCount; i++) {
    const firework = createFirework(`fw-${index}`, currentTime, canvasWidth, canvasHeight)

    if (index === sequence.textFireworkIndex && sequence.displayText) {
      firework.type = 'text'
      firework.displayText = sequence.displayText
    }

    fireworks.push(firework)
    index++
    // 非常短的间隔（0.3-0.6秒）
    currentTime += 300 + Math.random() * 300
  }

  // ============ 结尾阶段：多朵几乎同时发射 ============
  const finaleStartTime = currentTime + 500  // 稍微等待一下
  for (let i = 0; i < finaleCount; i++) {
    // 结尾烟花在很短的时间窗口内发射（0.1-0.3秒间隔）
    const firework = createFirework(
      `fw-${index}`,
      finaleStartTime + i * (100 + Math.random() * 200),
      canvasWidth,
      canvasHeight
    )

    if (index === sequence.textFireworkIndex && sequence.displayText) {
      firework.type = 'text'
      firework.displayText = sequence.displayText
    }

    fireworks.push(firework)
    index++
  }

  return fireworks
}

// 存储 canvas 尺寸供文字烟花使用
let _canvasWidth = 0
let _canvasHeight = 0

/**
 * 设置画布尺寸（供文字烟花使用）
 */
export function setCanvasSize(width: number, height: number): void {
  _canvasWidth = width
  _canvasHeight = height
}

/**
 * 更新烟花状态 - 支持从屏幕外升空和文字烟花
 */
export function updateFireworks(fireworks: Firework[], currentTime: number): void {
  const dt = 0.016  // 约60fps

  for (const firework of fireworks) {
    if (firework.isFinished) continue

    const elapsed = currentTime - firework.startTime

    // 还未开始
    if (elapsed < 0) continue

    // ============ 升空阶段 ============
    if (elapsed < firework.launchDuration && !firework.hasExploded) {
      // 计算升空进度 (0-1)
      const progress = elapsed / firework.launchDuration

      // 使用缓动函数让升空更自然（先快后慢）
      const easedProgress = 1 - Math.pow(1 - progress, 2)

      // 计算当前Y位置：从屏幕外 → 爆炸点
      const startY = firework.startY || (firework.y + firework.launchHeight)
      firework.currentLaunchY = startY - (startY - firework.y) * easedProgress
    }

    // ============ 爆炸时刻 ============
    else if (elapsed >= firework.launchDuration && !firework.hasExploded) {
      firework.hasExploded = true
      firework.currentLaunchY = undefined  // 清除升空位置

      // 根据烟花类型生成粒子
      if (firework.type === 'text' && firework.displayText) {
        // 文字烟花：生成文字形状的粒子
        const canvasW = _canvasWidth || window.innerWidth
        const canvasH = _canvasHeight || window.innerHeight
        const config = getTextFireworkConfig(
          firework.displayText,
          canvasW,
          canvasH
        )
        // 【重要】文字烟花固定在屏幕中心上方，不使用烟花的随机爆炸位置
        // 这样文字才能清晰显示在标题上方
        config.centerX = canvasW / 2  // 水平居中
        // centerY 已经在 getTextFireworkConfig 中计算好了（标题上方）

        firework.particles = createTextFireworkParticles(config)
      } else {
        // 普通烟花：生成爆炸粒子
        firework.particles = generateFireworkParticles(
          firework.type,
          firework.x,
          firework.y,
          firework.explosionForce,
          firework.colors,
          firework.particleCount
        )
      }
    }

    // ============ 爆炸后粒子运动 ============
    else if (firework.hasExploded) {
      // 更新所有粒子
      for (const particle of firework.particles) {
        if (firework.type === 'text' && particle.isTextParticle) {
          // 文字粒子使用特殊更新逻辑
          updateTextParticle(particle, dt)
        } else {
          updateParticle(particle, dt)
        }
      }

      // 移除已消散的粒子
      firework.particles = firework.particles.filter(p => p.life > 0 && p.opacity > 0.01)

      // 所有粒子消散后标记完成
      if (firework.particles.length === 0) {
        firework.isFinished = true
      }
    }
  }
}

/**
 * 检查烟花序列是否全部完成
 */
export function isSequenceFinished(fireworks: Firework[]): boolean {
  return fireworks.length > 0 && fireworks.every(f => f.isFinished)
}

/**
 * 获取烟花序列的总时长
 */
export function getSequenceDuration(fireworks: Firework[]): number {
  if (fireworks.length === 0) return 0

  let maxEndTime = 0
  for (const fw of fireworks) {
    const endTime = fw.startTime + fw.launchDuration + fw.displayDuration
    if (endTime > maxEndTime) maxEndTime = endTime
  }
  return maxEndTime
}

/**
 * 重置烟花序列
 */
export function resetFireworks(fireworks: Firework[]): void {
  for (const firework of fireworks) {
    firework.isFinished = false
    firework.hasExploded = false
    firework.currentLaunchY = undefined
    firework.particles = []
  }
}

/**
 * 获取活跃粒子数
 */
export function getActiveParticleCount(fireworks: Firework[]): number {
  return fireworks.reduce((sum, f) => sum + f.particles.length, 0)
}

