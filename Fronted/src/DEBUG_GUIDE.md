// ============================================================================
// 烟花系统 - 硬编码检查与调试指南
// ============================================================================

/**
 * 节日效果检查点
 * 
 * 文件位置: src/utils/holidaySystem.ts
 * 
 * 硬编码位置1: 劳动节检查
 * ├─ 路径: detectHoliday() 函数
 * ├─ 代码: if (month === 5 && day === 1) { ... }
 * └─ 测试: 将系统日期改为5月1日，应显示红黄渐变烟花
 * 
 * 硬编码位置2: 国庆节检查
 * ├─ 路径: detectHoliday() 函数
 * ├─ 代码: if (month === 10 && day === 1) { ... }
 * └─ 测试: 将系统日期改为10月1日，应显示金色烟花
 * 
 * 硬编码位置3: 农历节日检查
 * ├─ 路径: detectHoliday() 函数内调用 detectChineseHolidayByLunar(date)
 * ├─ 文件: src/utils/lunarCalendar.ts
 * ├─ 代码: 在 detectChineseHolidayByLunar() 中的 lunarHolidayMap
 * └─ 节日列表:
 *    - '1_1': 春节 → 正月初一
 *    - '1_15': 元宵 → 正月十五
 *    - '5_5': 端午 → 五月初五
 *    - '7_7': 七夕 → 七月初七
 *    - '8_15': 中秋 → 八月十五
 *
 * 修改建议: 在 lunarCalendar.ts 中添加新节日，修改对应的农历日期即可
 */

/**
 * 文字烟花效果检查点
 * 
 * 文件位置: src/utils/textFireworks.ts
 * 
 * 硬编码位置1: 文字库
 * ├─ 路径: FIREWORK_TEXTS 数组
 * ├─ 当前文字: '烟火漫游', '城市烟火', '人间烟火' 等
 * └─ 修改: 直接编辑数组内容，或调用 addCustomText() 添加新文字
 * 
 * 硬编码位置2: 文字显示概率
 * ├─ 路径: src/utils/fireworksSequence.ts - generateFireworkSequence()
 * ├─ 代码: 
 * │   const showText = holiday ? Math.random() < 0.8 : Math.random() < 0.3
 * │   // 节日时80%显示文字，平时30%显示
 * └─ 修改: 改变 0.8 和 0.3 的值来调整概率
 * 
 * 硬编码位置3: 文字显示时机
 * ├─ 路径: src/utils/fireworksSequence.ts - generateFireworkSequence()
 * ├─ 代码:
 * │   if (isOpeningText) {
 * │     textFireworkIndex = 2 + Math.floor(Math.random() * 2)  // 2-3
 * │   } else {
 * │     textFireworkIndex = 8 + Math.floor(Math.random() * 5)  // 8-12
 * │   }
 * └─ 修改: 改变索引范围来改变文字出现时机
 * 
 * 硬编码位置4: 文字大小和布局
 * ├─ 路径: src/utils/textParticleGenerator.ts - getTextFireworkConfig()
 * ├─ 代码:
 * │   centerX: canvasWidth / 2        // 水平中心
 * │   centerY: canvasHeight * 0.4     // 垂直位置（40%处）
 * │   fontSize: 80 (根据文字长度调整) // 字体大小
 * └─ 修改: 改变这些值来调整文字位置和大小
 * 
 * 硬编码位置5: 文字粒子颜色
 * ├─ 路径: src/utils/textParticleGenerator.ts - createTextFireworkParticles()
 * ├─ 代码:
 * │   const colors = [
 * │     color,      // 主颜色（默认金色）
 * │     '#FFD700',  // 金色
 * │     '#FFA500',  // 橙色
 * │     '#FF6347',  // 番茄红
 * │     '#FFFFFF'   // 白色高光
 * │   ]
 * └─ 修改: 改变颜色数组来调整文字烟花的配色
 */

/**
 * 烟花爆炸效果检查点
 * 
 * 文件位置: src/utils/canvasRenderer.ts - drawParticle()
 * 
 * 硬编码位置1: 轨迹线条宽度
 * ├─ 路径: drawParticle() 函数
 * ├─ 代码: ctx.lineWidth = Math.max(1, size * 0.8)
 * └─ 修改: 改变 0.8 来调整线条粗细
 * 
 * 硬编码位置2: 轨迹长度
 * ├─ 路径: src/utils/fireworksEngine.ts
 * ├─ 代码: const MAX_TRAIL_LENGTH = 12
 * └─ 修改: 改变值来调整轨迹长度（越大线条越长）
 * 
 * 硬编码位置3: 光晕大小
 * ├─ 路径: drawParticle() 函数
 * ├─ 代码: const glowSize = size * 3
 * └─ 修改: 改变倍数来调整光晕大小
 */

/**
 * 烟花序列时间控制
 * 
 * 文件位置: src/utils/fireworksSequence.ts - generateFireworks()
 * 
 * 硬编码点:
 * ├─ 开场间隔: 1500-2000ms (改变 800 和 500)
 * ├─ 过渡间隔: 800-1200ms (改变 600 和 400)
 * ├─ 高潮间隔: 300-600ms (改变 300 和 300)
 * └─ 结尾间隔: 100-300ms (改变 100 和 200)
 * 
 * 修改方式: 
 * currentTime += firework.launchDuration + X + Math.random() * Y
 * // 改变 X 和 Y 的值
 */

/**
 * UI动画检查点
 * 
 * 文件位置: src/components/FireworksLanding/index.tsx
 * 
 * 硬编码位置1: 元素依次出现时机
 * ├─ 花瓣装饰: setTimeout(() => setShowDecoration(true), 1000)
 * ├─ 主标题: setTimeout(() => setShowTitle(true), 2500)
 * ├─ 副标题: setTimeout(() => setShowSubtitle(true), 4500)
 * ├─ 按钮: setTimeout(() => { setShowButton(true); setCanInteract(true) }, 6000)
 * └─ 提示: setTimeout(() => setShowHint(true), 7500)
 * 
 * 修改: 直接改变时间毫秒数
 * 
 * 硬编码位置2: 加载文字
 * ├─ 路径: 底部提示显示
 * ├─ 代码: {canInteract ? '按 Enter 或点击按钮进入' : '系统加载中...'}
 * └─ 修改: 直接改变字符串
 */

/**
 * 快速调试技巧
 * 
 * 方法1: 修改系统日期测试节日
 * └─ 在 detectHoliday(date) 调用时传入特定日期
 * 
 * 方法2: 强制显示特定文字
 * └─ 在 generateFireworkSequence() 中，修改 displayText = '你的文字'
 * 
 * 方法3: 改变文字出现概率
 * └─ 修改 const showText = true 直接显示
 * 
 * 方法4: 调整烟花间隔
 * └─ 修改 generateFireworks() 中的时间常数
 * 
 * 方法5: 查看节日信息
 * └─ 在浏览器控制台：
 *    import { detectHoliday } from '@/utils/holidaySystem'
 *    console.log(detectHoliday())
 */

