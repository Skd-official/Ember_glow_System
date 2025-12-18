// ============================================================================
// 烟花系统类型定义 - 真实烟花效果
// ============================================================================

/**
 * 烟花类型枚举 - 真实烟花品种（已扩展）
 * - bloom: 经典绽放型（球形爆炸）
 * - ring: 环形扩展（双环）
 * - chrysanthemum: 菊花型（长尾下垂）
 * - willow: 垂柳型（下垂拖尾）
 * - peony: 牡丹型（大而圆润）
 * - palm: 棕榈型（宽大散开）
 * - crossette: 十字型（交叉爆炸）
 * - star: 星形型（五星爆炸）
 * - zongzi: 粽子型（端午专用，不规则散开）
 * - text: 文字烟花（显示文字）
 */
export type FireworkType = 'bloom' | 'ring' | 'chrysanthemum' | 'willow' | 'peony' | 'palm' | 'crossette' | 'star' | 'zongzi' | 'text'

/**
 * 粒子历史轨迹点
 */
export interface TrailPoint {
  x: number
  y: number
  opacity: number
}

/**
 * 烟花粒子对象
 */
export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
  size: number
  opacity: number
  friction: number
  // 轨迹历史 - 用于绘制线条效果
  trail?: TrailPoint[]
  // 是否为文字粒子（固定位置）
  isTextParticle?: boolean
  targetX?: number
  targetY?: number
}

/**
 * 烟花对象配置
 */
export interface Firework {
  id: string
  type: FireworkType

  // 时间控制
  startTime: number
  launchDuration: number
  explosionTime: number
  displayDuration: number

  // 位置
  x: number                      // 爆炸点水平位置
  y: number                      // 爆炸点垂直位置
  launchHeight: number           // 升空距离
  startY?: number                // 起始Y位置（屏幕外）

  // 爆炸参数
  explosionForce: number
  particleCount: number
  colors: string[]
  particles: Particle[]

  // 升空阶段
  currentLaunchY?: number        // 当前升空位置
  hasExploded?: boolean          // 是否已爆炸

  // 文字烟花
  displayText?: string
  textSize?: number
  textFont?: string

  // 节假日
  holiday?: {
    name: string
    wish: string
    effectType: string
  }

  isFinished: boolean
}

/**
 * 烟花序列配置
 * 管理整个烟花序列的生成和参数
 */
export interface FireworkSequence {
  totalFireworks: number         // 总烟花数
  textFireworkIndex: number      // 文字烟花的索引 (-1表示无)
  displayText?: string           // 要显示的文字
  holiday: {
    detected: boolean
    name?: string
    effectType?: string
  }
}

/**
 * Canvas 上下文扩展类型
 */
export interface FireworksCanvasContext {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  dpr: number  // 设备像素比
}

/**
 * 节假日信息
 */
export interface Holiday {
  name: string
  wishes: string[]
  effectType: string  // 可以是任意效果类型
  isLunar?: boolean   // 是否为农历节假日
}

