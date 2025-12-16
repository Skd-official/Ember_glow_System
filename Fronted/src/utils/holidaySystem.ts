// ============================================================================
// 节假日检测与祝福词库系统（更新版）
// ============================================================================

import type { Holiday } from '@/types'
import { detectChineseHolidayByLunar } from './lunarCalendar'

/**
 * 节假日配置数据库（仅包含阳历节假日）
 * 农历节假日通过 lunarCalendar.ts 独立处理
 *
 * 更新说明：
 * - 删除了清明节（不适合喜庆）
 * - 删除了圣诞、重阳（用户要求）
 * - 农历节假日（春节、元宵、端午、七夕、中秋、除夕）现在单独处理
 */
const HOLIDAYS_DATABASE: Record<string, Holiday> = {
  // 暂时为空，所有中国传统节假日都用农历计算
  // 保留这个结构以便未来扩展阳历节假日
}

/**
 * 烟花效果类型与配色映射
 */
const EFFECT_TYPE_COLORS: Record<string, string[]> = {
  // 农历节假日效果
  red_fireworks: ['#FF6347', '#DC143C', '#FF1493', '#FF69B4'],      // 春节红、除夕红
  golden_lantern: ['#FFD700', '#FFA500', '#FF8C00', '#FFB347'],     // 元宵金
  red_yellow_gradient: ['#FF0000', '#FF6347', '#FFD700', '#FFA500'], // 劳动节红黄渐变（镰刀锤子）
  dragon_red: ['#FF6347', '#DC143C', '#8B0000', '#FF4500'],         // 端午龙舟红
  magenta_romance: ['#FF1493', '#FF69B4', '#DDA0DD', '#EE82EE'],    // 七夕浪漫紫红
  silver_moon: ['#E0E6FF', '#B0C4DE', '#87CEEB', '#B0E0E6'],        // 中秋银蓝
  gold_fireworks: ['#FFD700', '#FFA500', '#FF8C00', '#FF6347'],     // 国庆金

  // 默认效果
  default: ['#FF6B35', '#FF8C42', '#FDB927', '#FFB347'],
}

/**
 * 检测当前日期是否为节假日（农历优先）
 *
 * 新流程：
 * 1. 首先检查阳历节假日（劳动节、国庆）
 * 2. 然后检查农历节假日（精确到一天）
 *
 * @param date 检测的日期对象 (默认为当前日期)
 * @returns 如果是节假日，返回 Holiday 对象；否则返回 null
 */
export function detectHoliday(date: Date = new Date()): Holiday | null {
  // 检查阳历节假日
  const month = date.getMonth() + 1
  const day = date.getDate()

  // 劳动节 - 红黄渐变（红色是共产主义旗帜，黄色是镰刀锤子）
  if (month === 5 && day === 1) {
    return {
      name: '劳动节',
      wishes: [
        '光荣属于劳动者，\n幸福在于奋斗者',
        '向所有劳动者致敬，\n你们的双手创造未来',
        '英特纳雄耐尔一定会实现！',
        '劳动最光荣，奋斗最美丽'
      ],
      effectType: 'red_yellow_gradient',
      isLunar: false
    }
  }

  // 国庆节
  if (month === 10 && day === 1) {
    return {
      name: '国庆节',
      wishes: [
        '祖国生日快乐，\n繁荣昌盛永驻',
        '山河壮丽，人心齐整',
        '国庆佳节，万象更新',
        '与祖国同行，为国家贡献'
      ],
      effectType: 'gold_fireworks',
      isLunar: false
    }
  }

  // 检查农历节假日
  const lunarHoliday = detectChineseHolidayByLunar(date)

  if (lunarHoliday) {
    return {
      name: lunarHoliday.name,
      wishes: lunarHoliday.wishes,
      effectType: lunarHoliday.effectType,
      isLunar: true
    }
  }

  return null
}

/**
 * 从祝福词库中随机选择一条
 *
 * @param holiday 节假日对象
 * @returns 随机祝福词
 */
export function getRandomWish(holiday: Holiday): string {
  const wishes = holiday.wishes
  return wishes[Math.floor(Math.random() * wishes.length)]
}

/**
 * 获取指定效果类型的配色
 *
 * @param effectType 效果类型
 * @returns 推荐的颜色数组
 */
export function getHolidayColorScheme(effectType: string): string[] {
  return EFFECT_TYPE_COLORS[effectType] || EFFECT_TYPE_COLORS.default
}

