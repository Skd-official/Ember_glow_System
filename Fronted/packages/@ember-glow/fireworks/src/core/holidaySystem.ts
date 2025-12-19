// ============================================================================
// 节假日检测与祝福词库系统（更新版）
// ============================================================================

import type { Holiday } from '@/types'
import { detectChineseHolidayByLunar } from './lunarCalendar'

/**
 * 测试用：硬编码测试日期（调试时使用）
 * 注释掉即为关闭，使用实际系统日期
 */
const TEST_DATE: Date | null = null  // 关闭测试日期，使用系统日期
 //const TEST_DATE = new Date('2026-06-19')  // 端午节测试
 //const TEST_DATE = new Date('2026-10-01')  // 国庆测试
 //const TEST_DATE = new Date('2026-05-01')  // 劳动节测试
//const TEST_DATE = new Date('2026-02-16')//除夕测试
//const TEST_DATE = new Date('2026-02-17')//春节测试
//const TEST_DATE = new Date('2026-08-19')//七夕测试
//const TEST_DATE = new Date('2026-03-03')//元宵测试
//const TEST_DATE = new Date('2026-09-25')//中秋节测试
/**
 * 节假日配置数据库（阳历节假日）
 */
const HOLIDAYS_DATABASE: Record<string, Holiday> = {
  '5-1': {
    name: '劳动节',
    wishes: ['劳动最光荣', '劳动节快乐', '五一假期快乐'],
    effectType: 'labor_day',
  },
  '10-1': {
    name: '国庆节',
    wishes: ['国庆快乐', '祖国万岁', '欢度国庆', '举国欢庆'],
    effectType: 'national_day',
  },
}

/**
 * 检测当前日期是否为节假日（农历优先）
 *
 * 新流程：
 * 1. 首先检查阳历节假日（劳动节、国庆）
 * 2. 然后检查农历节假日（精确到一天）
 *
 * @param date 检测的日期对象 (默认为当前日期，可用 TEST_DATE 覆盖)
 * @returns 如果是节假日，返回 Holiday 对象；否则返回 null
 */
export function detectHoliday(date: Date = new Date()): Holiday | null {
  // 支持测试日期调试
  const targetDate = TEST_DATE || date

  // 检查阳历节假日
  const month = targetDate.getMonth() + 1
  const day = targetDate.getDate()

  console.log(`[Holiday Debug] 检查阳历: ${month}月${day}日`)

  // 劳动节 - 红黄渐变（红色是共产主义旗帜，黄色是镰刀锤子）
  if (month === 5 && day === 1) {
    console.log('[Holiday Debug] ✅ 检测到劳动节！')
    return {
      name: '劳动节',
      wishes: [
        '光荣属于劳动者，\n幸福在于奋斗者',
        '向所有劳动者致敬，\n你们的双手创造未来',
        '英特纳雄耐尔一定会实现！',
        '劳动最光荣，奋斗最美丽'
      ],
      effectType: 'labor_day',
      isLunar: false
    }
  }

  // 国庆节
  if (month === 10 && day === 1) {
    console.log('[Holiday Debug] ✅ 检测到国庆节！')
    return {
      name: '国庆节',
      wishes: [
        '祖国生日快乐，\n繁荣昌盛永驻',
        '山河壮丽，人心齐整',
        '国庆佳节，万象更新',
        '与祖国同行，为国家贡献'
      ],
      effectType: 'national_day',
      isLunar: false
    }
  }

  // 检查农历节假日
  console.log('[Holiday Debug] 检查农历节假日...')
  const lunarHoliday = detectChineseHolidayByLunar(targetDate)

  if (lunarHoliday) {
    console.log(`[Holiday Debug] ✅ 检测到农历节日: ${lunarHoliday.name}`)
    return {
      name: lunarHoliday.name,
      wishes: lunarHoliday.wishes,
      effectType: lunarHoliday.effectType,
      isLunar: true
    }
  }

  console.log('[Holiday Debug] ❌ 未检测到节假日')
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
 */
export function getHolidayColorScheme(effectType: string): string[] {
  switch (effectType) {
    case 'labor_day':
      return ['#FF0000', '#FF6347', '#FFD700', '#FFA500']
    case 'national_day':
      return ['#FF0000', '#FFDE00', '#FF0000', '#FFDE00']
    case 'red_fireworks':
      return ['#FF6347', '#DC143C', '#FF1493', '#FF69B4']
    case 'golden_lantern':
      return ['#FFD700', '#FFA500', '#FF8C00', '#FFB347']
    case 'dragon_red':
      return ['#FF6347', '#DC143C', '#8B0000', '#FF4500']
    case 'magenta_romance':
      return ['#FF1493', '#FF69B4', '#DDA0DD', '#EE82EE']
    case 'silver_moon':
      return ['#E0E6FF', '#B0C4DE', '#87CEEB', '#B0E0E6']
    default:
      return ['#FFD700', '#FFA500', '#FF6347', '#FF0000']
  }
}

