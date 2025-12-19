// ============================================================================
// 农历系统 - 农历和阳历相互转换
// 使用从 VB.NET 转换的农历算法（已验证 2024-2027 年）
// ============================================================================

/**
 * 农历数据表
 * 包含 1921-2040 年的农历信息
 * 每个数值编码了该年的月份天数和闰月信息
 */
const LUNAR_DATA: number[] = [
  2635, 333387, 1701, 1748, 267701, 694, 2391, 133423, 1175, 396438,
  3402, 3749, 331177, 1453, 694, 201326, 2350, 465197, 3221, 3402,
  400202, 2901, 1386, 267611, 605, 2349, 137515, 2709, 464533, 1738,
  2901, 330421, 1242, 2651, 199255, 1323, 529706, 3733, 1706, 398762,
  2741, 1206, 267438, 2647, 1318, 204070, 3477, 461653, 1386, 2413,
  330077, 1197, 2637, 268877, 3365, 531109, 2900, 2922, 398042, 2395,
  1179, 267415, 2635, 661067, 1701, 1748, 398772, 2742, 2391, 330031,
  1175, 1611, 200010, 3749, 527717, 1452, 2742, 332397, 2350, 3222,
  268949, 3402, 3493, 133973, 1386, 464219, 605, 2349, 334123, 2709,
  2890, 267946, 2773, 592565, 1210, 2651, 395863, 1323, 2707, 265877,
  1706, 2773, 133557, 1206, 398510, 2638, 3366, 335142, 3411, 1450,
  200042, 2413, 723293, 1197, 2637, 399947, 3365, 3410, 334676, 2906
]

/**
 * 阳历每月的累计天数
 */
const MONTH_ADD = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]

/**
 * 农历转换为阳历日期
 *
 * 算法来自 VB.NET，已通过 2024-2027 年数据验证
 *
 * @param gongLi 阳历日期
 * @returns 农历日期信息 { year, month, day, isLeapMonth }
 */
export function convertToLunar(gongLi: Date): {
  year: number
  month: number
  day: number
  isLeapMonth: boolean
} {
  const curYear = gongLi.getFullYear()
  const curMonth = gongLi.getMonth() + 1
  const curDay = gongLi.getDate()

  // 计算从基准时间（1921-2-8，农历正月初一）到现在的天数
  let theDate = (curYear - 1921) * 365 + Math.floor((curYear - 1921) / 4) + curDay + MONTH_ADD[curMonth - 1] - 38

  // 闰年调整
  if (curYear % 4 === 0 && curMonth > 2) {
    theDate += 1
  }

  console.log(`[Lunar Debug] 开始转换: 阳历=${curYear}年${curMonth}月${curDay}日 → 计算天数=${theDate}`)

  // 计算农历年月日
  let isEnd = 0
  let m = 0
  let isLeapMonth = false
  let k = 0
  let n = 0

  while (true) {
    // 判断该年是平年还是闰年
    k = LUNAR_DATA[m] < 4095 ? 11 : 12
    n = k

    console.log(`[Lunar Debug] 检查第${m}组数据 (${LUNAR_DATA[m]}): k=${k}, 需要处理 ${k + 1} 个月份`)

    while (true) {
      if (n < 0) break

      // 按位获取该月是否为大月(30天)还是小月(29天)
      let bit = LUNAR_DATA[m]
      for (let i = 0; i < n; i++) {
        bit = Math.floor(bit / 2)
      }
      bit = bit % 2

      const daysInMonth = 29 + bit

      if (theDate <= daysInMonth) {
        isEnd = 1
        console.log(`[Lunar Debug] 找到! 月=${k - n + 1}, 日=${theDate}, 月长=${daysInMonth}天`)
        break
      }

      theDate -= daysInMonth
      n -= 1
    }

    if (isEnd === 1) break
    m += 1
  }

  const lunarYear = 1921 + m
  const lunarMonth = k - n + 1
  const lunarDay = theDate

  console.log(`[Lunar Debug] 计算结果: ${lunarYear}年${lunarMonth}月${lunarDay}日 (m=${m}, k=${k}, n=${n})`)

  // 处理闰月逻辑
  let finalMonth = lunarMonth
  if (LUNAR_DATA[m] >= 4095) {
    const leapMonth = Math.floor(LUNAR_DATA[m] / 65536) + 1
    console.log(`[Lunar Debug] 该年有闰月: 闰月=${leapMonth}`)

    if (finalMonth === leapMonth) {
      isLeapMonth = true
      console.log(`[Lunar Debug] 这是闰月!`)
    } else if (finalMonth > leapMonth) {
      finalMonth -= 1
      console.log(`[Lunar Debug] 闰月后的月份，调整: ${lunarMonth} → ${finalMonth}`)
    }
  }

  console.log(`[Lunar Debug] 最终: ${lunarYear}年${finalMonth}月${lunarDay}日 ${isLeapMonth ? '(闰月)' : ''}`)

  return {
    year: lunarYear,
    month: finalMonth,
    day: lunarDay,
    isLeapMonth
  }
}

/**
 * 判断指定日期是否为中国传统节日（农历）
 *
 * @param date 检查的日期
 * @returns 节假日信息或 null
 */
export function detectChineseHolidayByLunar(date: Date): {
  name: string
  lunarDate: string
  wishes: string[]
  effectType: string
} | null {
  const lunar = convertToLunar(date)
  console.log(`[Lunar Debug] 阳历 ${date.toLocaleDateString()} 转换为农历: 年=${lunar.year} 月=${lunar.month} 日=${lunar.day} 闰=${lunar.isLeapMonth}`)

  // 农历节日判断
  const lunarHolidayMap: Record<string, {
    name: string
    lunarDate: string
    wishes: string[]
    effectType: string
  }> = {
    '1_1': {
      name: '春节',
      lunarDate: '正月初一',
      wishes: [
        '爆竹声中一岁除，\n春风送暖入屠苏',
        '千户万户曈曈日，\n总把新桃换旧符',
        '新春贺岁，诸事皆宜',
        '岁岁年年，福泽绵长'
      ],
      effectType: 'red_fireworks'
    },
    '1_15': {
      name: '元宵',
      lunarDate: '正月十五',
      wishes: [
        '月上柳梢头，\n人约黄昏后',
        '一年明月今宵圆，\n万里佳音此夜传',
        '灯火阑珊处，与君相逢',
        '圆圆满满，团团圆圆'
      ],
      effectType: 'golden_lantern'
    },
    '5_5': {
      name: '端午节',
      lunarDate: '五月初五',
      wishes: [
        '粽叶飘香，龙舟竞渡',
        '汨罗江畔，屈子逸魂',
        '楚辞思韵，端午安康',
        '艾草芬芳，祝福久长'
      ],
      effectType: 'dragon_red'
    },
    '7_7': {
      name: '七夕节',
      lunarDate: '七月初七',
      wishes: [
        '隔银河遥相望，\n一年一度相思长',
        '两情若是久长时，\n又岂在朝朝暮暮',
        '鹊桥仙，乌鹊喜相逢',
        '相思成灰，凝聚成爱'
      ],
      effectType: 'magenta_romance'
    },
    '8_15': {
      name: '中秋节',
      lunarDate: '八月十五',
      wishes: [
        '但愿人长久，\n千里共婵娟',
        '中庭地白树栖鸦，\n冷露无声湿桂花',
        '月圆人更圆，\n思念化作千般牵挂',
        '月到中秋分外圆，\n人有悲欢离合间'
      ],
      effectType: 'silver_moon'
    }
  }

  const key = `${lunar.month}_${lunar.day}`
  const holiday = lunarHolidayMap[key]

  if (holiday) {
    console.log(`[Lunar Debug] ✅ 匹配到节日: key=${key} => ${holiday.name}`)
    return holiday
  }

  // 检查除夕（农历十二月最后一天）
  const nextLunar = convertToLunar(new Date(date.getTime() + 24 * 60 * 60 * 1000))
  if (nextLunar.month === 1 && nextLunar.day === 1 && lunar.month === 12) {
    console.log('[Lunar Debug] ✅ 匹配到除夕（农历12月最后一天）')
    return {
      name: '除夕',
      lunarDate: '十二月最后一天',
      wishes: [
        '辞旧岁，迎新春',
        '除夕一夜，万象更新',
        '爆竹声声，旧岁已逝',
        '新年在即，百般期许'
      ],
      effectType: 'red_fireworks'
    }
  }

  console.log(`[Lunar Debug] ❌ 未匹配到任何节日 (key=${key})`)
  return null
}

