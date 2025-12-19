// ============================================================================
// 文字烟花系统 - 配置与生成
// ============================================================================

/**
 * 可配置的文字库
 * 
 * 在这里添加更多文字，系统会随机从中选择一个进行显示
 * 注意：文字过长会显示不全，建议保持 2-6 个字符
 * 
 * 你可以根据需要自由修改这个列表
 */
export const FIREWORK_TEXTS: string[] = [
  // 核心品牌
  '烟火漫游',
  '城市烟火',
  '烟火气息',
  
  // 诗意表达
  '漫步人间',
  '人间烟火',
  '烟火情诗',
  '烟火梦想',
  
  // 体验相关
  '探索发现',
  '诗意生活',
  '慢生活',
  '烟火故事',
  
  // 地理相关
  '城市漫游',
  '街道漫步',
  '烟火街区',
  '城市角落',
  
  // 时间相关
  '时光漫游',
  '烟火年华',
  '四时之美',
  
  // 感受相关
  '心之所向',
  '烟火记忆',
  '烟火传奇',
  '烟火梦乡'
]

/**
 * 将文本按 \n 分割成多行，每行最多 maxChars 个字符
 * 用于文字烟花的多行显示
 *
 * @param text 文本（可能包含 \n）
 * @param maxChars 每行最多字符数（默认9）
 * @returns 行数组
 */
export function formatTextWithLineBreaks(text: string, maxChars: number = 9): string[] {
  // 首先按 \n 分割
  const paragraphs = text.split('\n')

  const lines: string[] = []
  for (const para of paragraphs) {
    // 每个段落再按 maxChars 分割
    for (let i = 0; i < para.length; i += maxChars) {
      lines.push(para.substring(i, i + maxChars))
    }
  }

  return lines
}

/**
 * 计算最长祝福词分行后单行的最大宽度
 * 用于文字烟花位置边界检查
 *
 * @param wishes 祝福词数组
 * @param fontSize 字体大小
 * @param maxChars 每行最多字符数
 * @returns 最大单行宽度（像素）
 */
export function calculateMaxTextLineWidth(
  wishes: string[],
  fontSize: number = 52,
  maxChars: number = 9
): number {
  let maxLineLength = 0

  for (const wish of wishes) {
    const lines = formatTextWithLineBreaks(wish, maxChars)
    for (const line of lines) {
      if (line.length > maxLineLength) {
        maxLineLength = line.length
      }
    }
  }

  // 估算宽度：每个中文字符宽度 ≈ 字体大小 * 0.85
  return maxLineLength * fontSize * 0.85
}

/**
 * 随机选择一个文字
 *
 * @param seed 随机数种子 (可选，用于确保可复现性)
 * @returns 选中的文字
 */
export function getRandomText(seed?: number): string {
  let randomIndex: number

  if (seed !== undefined) {
    // 使用种子生成伪随机数，确保可复现
    randomIndex = seed % FIREWORK_TEXTS.length
  } else {
    // 使用真随机
    randomIndex = Math.floor(Math.random() * FIREWORK_TEXTS.length)
  }

  return FIREWORK_TEXTS[randomIndex]
}

/**
 * 获取所有可用的文字
 */
export function getAllTexts(): string[] {
  return [...FIREWORK_TEXTS]
}

/**
 * 添加自定义文字到文字库
 * 
 * @param text 要添加的文字
 * @param position 插入位置 (默认添加到末尾)
 */
export function addCustomText(text: string, position?: number): void {
  if (position !== undefined && position >= 0 && position <= FIREWORK_TEXTS.length) {
    FIREWORK_TEXTS.splice(position, 0, text)
  } else {
    FIREWORK_TEXTS.push(text)
  }
}

/**
 * 移除指定文字
 * 
 * @param text 要移除的文字
 */
export function removeText(text: string): boolean {
  const index = FIREWORK_TEXTS.indexOf(text)
  if (index > -1) {
    FIREWORK_TEXTS.splice(index, 1)
    return true
  }
  return false
}

/**
 * 清空文字库并重置为默认
 */
export function resetTexts(): void {
  FIREWORK_TEXTS.length = 0
  FIREWORK_TEXTS.push(
    '烟火漫游',
    '城市烟火',
    '烟火气息',
    '漫步人间',
    '人间烟火',
    '诗意生活'
  )
}

/**
 * 获取指定文字对应的字体和大小建议
 * 根据文字长度动态调整大小，避免显示不全
 * 
 * @param text 文字
 * @returns 字体配置对象
 */
export function getTextMetrics(text: string): {
  size: number
  font: string
  letterSpacing: number
} {
  const length = text.length
  
  // 根据文字长度动态调整大小
  let size = 80
  let letterSpacing = 20

  if (length >= 6) {
    size = 50
    letterSpacing = 10
  } else if (length > 4) {
    size = 60
    letterSpacing = 15
  }

  return {
    size,
    font: `bold ${size}px '方正楷体', '宋体', serif`,
    letterSpacing
  }
}

/**
 * 计算文字显示的起始 X 坐标 (用于居中)
 * 
 * @param text 文字
 * @param canvasWidth Canvas 宽度
 * @param fontSize 字体大小
 * @returns 起始 X 坐标
 */
export function calculateTextStartX(
  text: string,
  canvasWidth: number,
  fontSize: number
): number {
  // 粗略估计：每个字符宽度 ≈ 字体大小 * 0.6
  const estimatedWidth = text.length * fontSize * 0.6
  return canvasWidth / 2 - estimatedWidth / 2
}

/**
 * 文字淡入淡出动画的透明度计算
 * 
 * @param progress 进度 (0-1)
 * @param fadeinDuration 淡入阶段比例 (0-1)
 * @param fadeoutDuration 淡出阶段比例 (0-1)
 * @returns 透明度 (0-1)
 */
export function calculateTextOpacity(
  progress: number,
  fadeinDuration: number = 0.2,
  fadeoutDuration: number = 0.3
): number {
  if (progress < fadeinDuration) {
    // 淡入阶段
    return progress / fadeinDuration
  } else if (progress > 1 - fadeoutDuration) {
    // 淡出阶段
    return (1 - progress) / fadeoutDuration
  } else {
    // 完整显示阶段
    return 1
  }
}

/**
 * 生成文字烟花的显示配置
 * 
 * @param text 要显示的文字
 * @param canvasWidth Canvas 宽度
 * @param canvasHeight Canvas 高度
 * @returns 完整的显示配置
 */
export function generateTextFireworkConfig(
  text: string,
  canvasWidth: number,
  canvasHeight: number
): {
  text: string
  x: number
  y: number
  size: number
  font: string
  color: string
  shadowColor: string
} {
  const metrics = getTextMetrics(text)
  
  return {
    text,
    x: calculateTextStartX(text, canvasWidth, metrics.size),
    y: canvasHeight / 2 + metrics.size / 3,  // 垂直居中偏下
    size: metrics.size,
    font: metrics.font,
    color: '#FDB927',  // 金黄色
    shadowColor: 'rgba(139, 46, 31, 0.6)'  // 深红半透明
  }
}

