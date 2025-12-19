// 节日文字特效配置系统
// 为每个节日定义独特的文字颜色、光晕颜色和动画效果

export interface HolidayTextConfig {
  name: string           // 节日名称
  textColor: string      // 文字颜色
  glowColor: string      // 光晕颜色
  effectType: string     // 特效类型
}

/**
 * 节日文字配置对象
 * 每个配置包含：
 * - textColor: 文字的主要颜色
 * - glowColor: 文字外部的光晕颜色
 * - effectType: 对应的动画特效类型
 */
export const HOLIDAY_TEXT_CONFIGS: Record<string, HolidayTextConfig> = {
  // 春节 - 红色爆竹快速旋转
  red_fireworks: {
    name: '春节',
    textColor: '#FF0000',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    effectType: 'firecrackers'
  },

  // 元宵 - 金黄色灯笼缓慢环绕
  golden_lantern: {
    name: '元宵',
    textColor: '#FFD700',
    glowColor: 'rgba(255, 140, 0, 0.6)',
    effectType: 'lanterns'
  },

  // 端午 - 绿色粽子上下浮动
  dragon_red: {
    name: '端午',
    textColor: '#228B22',
    glowColor: 'rgba(144, 238, 144, 0.6)',
    effectType: 'zongzi_floating'
  },

  // 七夕 - 紫红色星星飘落
  magenta_romance: {
    name: '七夕',
    textColor: '#DA70D6',
    glowColor: 'rgba(255, 192, 203, 0.6)',
    effectType: 'starfall'
  },

  // 中秋 - 蓝色月光逐渐扩散
  silver_moon: {
    name: '中秋',
    textColor: '#4169E1',
    glowColor: 'rgba(240, 248, 255, 0.6)',
    effectType: 'moonlight'
  },

  // 除夕 - 深红色爆竹快速旋转+闪烁
  chinese_new_year_eve: {
    name: '除夕',
    textColor: '#DC143C',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    effectType: 'firecrackers'
  },

  // 劳动节 - 红黄交替闪烁
  labor_day: {
    name: '劳动节',
    textColor: '#FF6347',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    effectType: 'labor_hammer'
  },

  // 国庆 - 红黄国旗展开
  national_day: {
    name: '国庆',
    textColor: '#FF0000',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    effectType: 'flag_spread'
  }
}

/**
 * 获取指定特效类型的节日配置
 * @param effectType - 特效类型 (如 'red_fireworks', 'golden_lantern' 等)
 * @returns 节日配置对象，如果不存在返回默认配置
 */
export function getHolidayTextConfig(effectType: string): HolidayTextConfig {
  // 如果配置存在，直接返回
  if (HOLIDAY_TEXT_CONFIGS[effectType]) {
    return HOLIDAY_TEXT_CONFIGS[effectType]
  }

  // 如果effectType是特效名称（如'firecrackers'），查找对应的配置
  const config = Object.values(HOLIDAY_TEXT_CONFIGS).find(
    c => c.effectType === effectType
  )

  if (config) {
    return config
  }

  // 如果都没找到，返回默认配置（春节红色）
  return {
    name: '节日',
    textColor: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    effectType: 'firecrackers'
  }
}

/**
 * 获取所有节日配置列表
 * 用于初始化或调试
 */
export function getAllHolidayConfigs(): HolidayTextConfig[] {
  return Object.values(HOLIDAY_TEXT_CONFIGS)
}