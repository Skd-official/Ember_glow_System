<template>
  <div class="main-layout corner-decorations cloud-corner-tl cloud-corner-tr">
    <!-- 四角装饰元素 -->
    <div class="corner-tr"></div>
    <div class="corner-bl"></div>

    <!-- 顶部标题区 -->
    <header class="main-header">
      <div class="header-left">
        <div class="logo-container">
          <svg class="logo-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- 双层圆环 -->
            <circle cx="50" cy="50" r="45" fill="none" stroke="#8B2942" stroke-width="2"/>
            <circle cx="50" cy="50" r="38" fill="none" stroke="#8B2942" stroke-width="1.5"/>
            <!-- 十字方向标 -->
            <line x1="50" y1="15" x2="50" y2="25" stroke="#8B2942" stroke-width="2" stroke-linecap="round"/>
            <line x1="50" y1="75" x2="50" y2="85" stroke="#8B2942" stroke-width="2" stroke-linecap="round"/>
            <line x1="15" y1="50" x2="25" y2="50" stroke="#8B2942" stroke-width="2" stroke-linecap="round"/>
            <line x1="75" y1="50" x2="85" y2="50" stroke="#8B2942" stroke-width="2" stroke-linecap="round"/>
            <!-- 中心小圆 -->
            <circle cx="50" cy="50" r="4" fill="#8B2942"/>
          </svg>
          <span class="logo-text">烟火漫游</span>
        </div>
      </div>
      <div class="header-center">
        <div class="header-slogan-row">
          <p class="header-slogan">SUCH IS THE JOY OF OUR REUNION</p>
          <div class="date-display">
            <div class="date-details">
              <span class="date-main">{{ currentDateMain }}</span>
              <span class="date-secondary">{{ currentDateSecondary }}</span>
            </div>
            <div v-if="currentHoliday" class="holiday-badge">
              <span class="holiday-sparkle">✨</span>
              <span class="holiday-text">{{ currentHoliday }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="header-right">
        <el-button v-if="!userStore.isLoggedIn" text @click="showLogin = true">登录</el-button>
        <el-dropdown v-else>
          <el-avatar :size="32" class="cursor-pointer">{{ userStore.userInfo?.nickname?.[0] || 'U' }}</el-avatar>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item divided @click="userStore.logout()">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 功能标题卡片 -->
    <div class="function-card knot-decoration">
      <div class="step-indicators">
        <span
          v-for="(item, index) in navItems"
          :key="item.id"
          class="step"
          :class="{ active: appStore.currentFeature === item.id }"
          @click="navigateTo(item)"
          :title="item.label"
        >
          <span class="step-number">{{ index + 1 }}</span>
          <img :src="item.icon" :alt="item.label" class="step-icon-img">
        </span>
      </div>
      <h2 class="current-title">{{ featureConfig[appStore.currentFeature]?.title }}</h2>
    </div>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 左侧导航 -->
      <nav class="side-nav">
        <!-- 顶部中国结装饰 -->
        <div class="nav-knot-top"></div>
        <button
          v-for="item in navItems"
          :key="item.id"
          class="nav-item"
          :class="{ active: appStore.currentFeature === item.id }"
          @click="navigateTo(item)"
        >
          <img :src="item.icon" :alt="item.label" class="nav-icon">
          <span class="nav-text">{{ item.label }}</span>
        </button>
        <!-- 底部中国结装饰 -->
        <div class="nav-knot-bottom"></div>
      </nav>

      <!-- 中央内容区 -->
      <div class="content-area">
        <router-view />
      </div>

      <!-- 右侧信息面板 -->
      <aside class="info-panel">
        <div class="panel-header">
          <h3>{{ featureConfig[appStore.currentFeature]?.panelTitle }}</h3>
          <p>{{ featureConfig[appStore.currentFeature]?.panelSubtitle }}</p>
        </div>

        <!-- 金色分割线 -->
        <div class="divider-gold"></div>

        <div class="panel-content">
          <!-- 统计卡片 - 双边框 -->
          <div class="stats-card card-double-border-gold">
            <h4>全国烟火气指数</h4>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-value">87.5</span>
                <span class="stat-label">平均分</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">1,234</span>
                <span class="stat-label">高活力街区</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">美食/夜市</span>
                <span class="stat-label">典型业态</span>
              </div>
            </div>
          </div>

          <!-- 金色分割线 -->
          <div class="divider-gold"></div>

          <!-- 筛选器 - 双边框 -->
          <div class="filter-card card-double-border-gold">
            <h4>快速筛选</h4>
            <div class="filter-row">
              <label>城市</label>
              <el-select v-model="appStore.selectedCity" @change="onCityChange">
                <el-option
                  v-for="city in appStore.hotCities"
                  :key="city.name"
                  :label="`🔥 ${city.name} (${city.index})`"
                  :value="city.name"
                />
              </el-select>
            </div>
            <div class="filter-row">
              <label>偏好</label>
              <el-select v-model="preference">
                <el-option label="综合烟火气" value="mixed" />
                <el-option label="美食为主" value="food" />
                <el-option label="夜生活" value="nightlife" />
                <el-option label="文艺气息" value="culture" />
              </el-select>
            </div>
          </div>

          <!-- 金色分割线 -->
          <div class="divider-gold"></div>

          <!-- 时间控制 - 滑动条 -->
          <div class="time-card card-double-border-gold">
            <h4>时段选择</h4>
            <div class="time-slider-wrapper">
              <div class="time-icons">
                <span class="time-icon" :class="{ active: appStore.timeSlot === 0 }">🌅</span>
                <span class="time-icon" :class="{ active: appStore.timeSlot === 1 }">☀️</span>
                <span class="time-icon" :class="{ active: appStore.timeSlot === 2 }">🌇</span>
                <span class="time-icon" :class="{ active: appStore.timeSlot === 3 }">🌙</span>
              </div>
              <el-slider
                v-model="appStore.timeSlot"
                :min="0"
                :max="3"
                :show-tooltip="false"
                class="time-slider"
              />
              <div class="time-labels">
                <span :class="{ active: appStore.timeSlot === 0 }">清晨</span>
                <span :class="{ active: appStore.timeSlot === 1 }">白天</span>
                <span :class="{ active: appStore.timeSlot === 2 }">傍晚</span>
                <span :class="{ active: appStore.timeSlot === 3 }">深夜</span>
              </div>
            </div>
            <p class="time-display" :class="'time-slot-' + appStore.timeSlot">
              {{ currentTimeLabel }}
            </p>
          </div>
        </div>
      </aside>
    </main>

    <!-- 登录弹窗 -->
    <el-dialog v-model="showLogin" title="登录" width="400px">
      <LoginForm @success="showLogin = false" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import LoginForm from '@/components/LoginForm.vue'

// 导入图标
import mapIcon from '@/assets/icons/map.png'
import routeIcon from '@/assets/icons/route.png'
import footprintIcon from '@/assets/icons/footprint.png'
import travelogIcon from '@/assets/icons/travelog.png'
import communityIcon from '@/assets/icons/community.png'
import trendIcon from '@/assets/icons/trend.png'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const showLogin = ref(false)
const preference = ref('mixed')

// 日期和节日信息
const currentDateMain = computed(() => {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const date = String(today.getDate()).padStart(2, '0')
  return `${month}月${date}日`
})

const currentDateSecondary = computed(() => {
  const today = new Date()
  const year = today.getFullYear()
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekDay = weekDays[today.getDay()]

  // 农历转换（简化版，使用固定节点）
  const lunarDate = calculateLunarDate(today)

  return `${year}年 ${weekDay} • ${lunarDate}`
})

// 简化的农历计算
function calculateLunarDate(date) {
  // 这是一个简化实现，实际可使用专门的农历库
  // 这里返回一个估算的农历日期文本
  const month = date.getMonth() + 1
  const day = date.getDate()

  // 农历月份名称
  const lunarMonths = ['', '正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊']
  const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十']

  // 简单映射（实际应该使用完整的农历算法）
  const offsetDays = Math.floor((date - new Date(date.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24))
  const lunarDayIndex = (offsetDays + 29) % 30 // 近似农历日
  const lunarMonthIndex = Math.floor((offsetDays + 29) / 30) % 12 + 1

  return `农历${lunarMonths[lunarMonthIndex]}月${lunarDays[lunarDayIndex]}`
}

const currentHoliday = computed(() => {
  const today = new Date()
  const month = today.getMonth() + 1
  const date = today.getDate()

  // 中国主要节假日和纪念日
  const holidays = {
    '1-1': '🎆 元旦',
    '2-14': '💕 情人节',
    '3-8': '👩 妇女节',
    '4-4': '🌸 清明节',
    '5-1': '🎉 劳动节',
    '6-1': '🎈 儿童节',
    '8-15': '🌙 中秋节前',
    '9-10': '🎓 教师节',
    '10-1': '🎊 国庆节',
    '10-31': '🎃 万圣节',
    '12-25': '🎄 圣诞节',
    '12-31': '✨ 元旦前夜'
  }

  const key = `${month}-${date}`
  return holidays[key] || null
})

const navItems = [
  { id: 'map', label: '烟火地图', icon: mapIcon, path: '/main/map' },
  { id: 'route', label: '路线规划', icon: routeIcon, path: '/main/route' },
  { id: 'footprint', label: '探索足迹', icon: footprintIcon, path: '/main/footprint' },
  { id: 'travelog', label: 'AI游记', icon: travelogIcon, path: '/main/travelog' },
  { id: 'community', label: '社区广场', icon: communityIcon, path: '/main/community' },
  { id: 'trend', label: '趋势对比', icon: trendIcon, path: '/main/trend' }
]

const featureConfig = {
  map: { title: '烟火地图', panelTitle: '城市烟火气地图', panelSubtitle: '在全国尺度上观察城市的烟火气分布' },
  route: { title: '路线规划', panelTitle: '智能探索路线规划', panelSubtitle: '基于时间、预算与偏好生成路线' },
  footprint: { title: '探索足迹', panelTitle: '探索打卡与足迹地图', panelSubtitle: '记录每一次真实的到访' },
  travelog: { title: 'AI游记', panelTitle: 'AI 游记生成', panelSubtitle: '把足迹织成一篇有温度的游记' },
  community: { title: '社区广场', panelTitle: '探索社区与灵感广场', panelSubtitle: '看看别人的烟火路线' },
  trend: { title: '趋势对比', panelTitle: '夜光与烟火气趋势对比', panelSubtitle: '感受城市的亮起与熄灭' }
}

// 时段图标
const timeIcons = ['🌅', '☀️', '🌇', '🌙']
const timeMarks = { 0: '清晨', 1: '白天', 2: '傍晚', 3: '深夜' }

const currentTimeLabel = computed(() => {
  const config = appStore.timeConfig[appStore.timeSlot]
  return `${config.label} ${config.range}`
})

function formatTime(val) {
  return appStore.timeConfig[val]?.label
}

function navigateTo(item) {
  appStore.setFeature(item.id)
  router.push(item.path)
}

function onCityChange(cityName) {
  // 触发地图飞行
  const city = appStore.hotCities.find(c => c.name === cityName)
  if (city && appStore.cesiumViewer) {
    appStore.cesiumViewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(city.lon, city.lat, 200000),
      duration: 1.5
    })
  }
}
</script>

<style scoped>
.main-layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  position: relative;
  /* 添加淡淡的纹理背景 */
  background-image:
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 20px,
      rgba(201, 169, 98, 0.02) 20px,
      rgba(201, 169, 98, 0.02) 40px
    );
}

/* 四角装饰 */
.main-layout > .corner-tr {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 50px;
  height: 50px;
  border-top: 3px solid var(--color-primary);
  border-right: 3px solid var(--color-primary);
  opacity: 0.2;
  pointer-events: none;
  z-index: 100;
}

.main-layout > .corner-bl {
  position: absolute;
  bottom: 8px;
  left: 8px;
  width: 50px;
  height: 50px;
  border-bottom: 3px solid var(--color-primary);
  border-left: 3px solid var(--color-primary);
  opacity: 0.2;
  pointer-events: none;
  z-index: 100;
}

/* ===== 顶部标题栏 - 精简版 ===== */
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  background: linear-gradient(180deg, var(--color-cream-light) 0%, var(--color-cream) 100%);
  border-bottom: 2px solid var(--color-primary);
  position: relative;
}

/* 金色装饰线 */
.main-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
}

.logo-text {
  font-family: var(--font-display);
  font-size: 22px;
  color: var(--color-primary);
  text-shadow: 1px 1px 0 var(--color-gold-light);
  letter-spacing: 2px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 8px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(139, 41, 66, 0.2));
  transition: all 0.3s;
}

.logo-container:hover .logo-icon {
  transform: rotate(15deg);
  filter: drop-shadow(0 3px 8px rgba(139, 41, 66, 0.3));
}

.header-slogan {
  font-family: var(--font-english);
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--color-gold-dark);
  text-transform: uppercase;
  margin: 0;
}

/* 英文和日期同行布局 */
.header-slogan-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 0;
}

/* 日期和节日提示 - 紧凑行内布局 */
.date-time-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 6px;
}

.date-display {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.08) 0%, rgba(255, 255, 255, 0) 100%);
  border-radius: 4px;
  border-left: 3px solid var(--color-gold);
  white-space: nowrap;
}

.date-details {
  display: flex;
  flex-direction: column;
  gap: 1px;
  line-height: 1;
}

/* 鎏金字体效果 - 高级感 */
.date-main {
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary);
  background: linear-gradient(
    135deg,
    #D4AF37 0%,
    #C9A962 50%,
    #B8860B 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow:
    0 2px 4px rgba(212, 165, 116, 0.3),
    0 0 8px rgba(212, 165, 116, 0.2);
  filter: drop-shadow(0 2px 4px rgba(212, 165, 116, 0.2));
  letter-spacing: 0.5px;
}

.date-secondary {
  font-family: var(--font-english);
  font-size: 9px;
  color: var(--color-brown);
  letter-spacing: 0.3px;
  opacity: 0.8;
}

.holiday-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.95) 0%, rgba(201, 169, 98, 0.9) 100%);
  border-radius: 14px;
  border: 1px solid var(--color-gold);
  box-shadow:
    0 2px 8px rgba(212, 165, 116, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
  white-space: nowrap;
  flex-shrink: 0;
}

.holiday-sparkle {
  font-size: 11px;
  animation: twinkle 2s ease-in-out infinite;
}

.holiday-text {
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: 11px;
  color: var(--color-primary-dark);
  font-weight: 600;
  letter-spacing: 0.5px;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

/* ===== 功能卡片 - 精简版 + 祥云纹 ===== */
.function-card {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  padding: 12px 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  overflow: hidden;
}

/* 同心圆祥云纹 - 左侧 (更丰富连贯的纹路) */
.function-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 350px;
  height: 80px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 350 80' fill='none' stroke='%23C9A962' stroke-width='1.2'%3E%3C!-- 第一组大云头 --%3E%3Ccircle cx='40' cy='40' r='28' stroke-dasharray='0 44 132'/%3E%3Ccircle cx='40' cy='40' r='21' stroke-dasharray='0 33 99'/%3E%3Ccircle cx='40' cy='40' r='14' stroke-dasharray='0 22 66'/%3E%3Ccircle cx='40' cy='40' r='7' stroke-dasharray='0 11 33'/%3E%3C!-- 第二组中云头 --%3E%3Ccircle cx='85' cy='30' r='22' stroke-dasharray='0 35 104'/%3E%3Ccircle cx='85' cy='30' r='15' stroke-dasharray='0 24 71'/%3E%3Ccircle cx='85' cy='30' r='8' stroke-dasharray='0 13 38'/%3E%3Ccircle cx='85' cy='30' r='4' stroke-dasharray='0 6 19'/%3E%3C!-- 第三组小云头 --%3E%3Ccircle cx='125' cy='38' r='16' stroke-dasharray='0 25 75'/%3E%3Ccircle cx='125' cy='38' r='10' stroke-dasharray='0 16 47'/%3E%3Ccircle cx='125' cy='38' r='5' stroke-dasharray='0 8 24'/%3E%3C!-- 连接波浪纹 --%3E%3Cpath d='M68,40 Q76,35 85,30' stroke-width='1'/%3E%3Cpath d='M107,30 Q115,34 125,38' stroke-width='1'/%3E%3C!-- 云尾飘带 --%3E%3Cpath d='M40,58 Q70,65 110,62 Q160,58 220,54 Q280,50 330,48' stroke-width='2'/%3E%3Cpath d='M68,48 Q100,56 150,54 Q210,50 280,46 Q320,44 350,42' stroke-width='1.5'/%3E%3Cpath d='M107,36 Q150,44 200,42 Q260,38 320,35 Q340,34 350,33' stroke-width='1'/%3E%3C!-- 装饰小涡纹 --%3E%3Ccircle cx='165' cy='48' r='6' stroke-dasharray='0 9 28'/%3E%3Ccircle cx='165' cy='48' r='3' stroke-dasharray='0 5 14'/%3E%3Ccircle cx='210' cy='44' r='4' stroke-dasharray='0 6 19'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.3;
  pointer-events: none;
}

/* 同心圆祥云纹 - 右侧 */
.function-card::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%) scaleX(-1);
  width: 350px;
  height: 80px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 350 80' fill='none' stroke='%23C9A962' stroke-width='1.2'%3E%3C!-- 第一组大云头 --%3E%3Ccircle cx='40' cy='40' r='28' stroke-dasharray='0 44 132'/%3E%3Ccircle cx='40' cy='40' r='21' stroke-dasharray='0 33 99'/%3E%3Ccircle cx='40' cy='40' r='14' stroke-dasharray='0 22 66'/%3E%3Ccircle cx='40' cy='40' r='7' stroke-dasharray='0 11 33'/%3E%3C!-- 第二组中云头 --%3E%3Ccircle cx='85' cy='30' r='22' stroke-dasharray='0 35 104'/%3E%3Ccircle cx='85' cy='30' r='15' stroke-dasharray='0 24 71'/%3E%3Ccircle cx='85' cy='30' r='8' stroke-dasharray='0 13 38'/%3E%3Ccircle cx='85' cy='30' r='4' stroke-dasharray='0 6 19'/%3E%3C!-- 第三组小云头 --%3E%3Ccircle cx='125' cy='38' r='16' stroke-dasharray='0 25 75'/%3E%3Ccircle cx='125' cy='38' r='10' stroke-dasharray='0 16 47'/%3E%3Ccircle cx='125' cy='38' r='5' stroke-dasharray='0 8 24'/%3E%3C!-- 连接波浪纹 --%3E%3Cpath d='M68,40 Q76,35 85,30' stroke-width='1'/%3E%3Cpath d='M107,30 Q115,34 125,38' stroke-width='1'/%3E%3C!-- 云尾飘带 --%3E%3Cpath d='M40,58 Q70,65 110,62 Q160,58 220,54 Q280,50 330,48' stroke-width='2'/%3E%3Cpath d='M68,48 Q100,56 150,54 Q210,50 280,46 Q320,44 350,42' stroke-width='1.5'/%3E%3Cpath d='M107,36 Q150,44 200,42 Q260,38 320,35 Q340,34 350,33' stroke-width='1'/%3E%3C!-- 装饰小涡纹 --%3E%3Ccircle cx='165' cy='48' r='6' stroke-dasharray='0 9 28'/%3E%3Ccircle cx='165' cy='48' r='3' stroke-dasharray='0 5 14'/%3E%3Ccircle cx='210' cy='44' r='4' stroke-dasharray='0 6 19'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.3;
  pointer-events: none;
}

.step-indicators {
  display: flex;
  gap: 10px;
  position: relative;
  z-index: 1;
  align-items: center;
}

.step {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
  border: 2.5px solid var(--color-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/* 步骤背景光晕 */
.step::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201, 169, 98, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.step:hover::before {
  opacity: 1;
}

.step:hover {
  transform: scale(1.15);
  box-shadow: 0 0 16px rgba(201, 169, 98, 0.5);
}

.step-number {
  font-family: var(--font-english);
  font-size: 14px;
  font-weight: 700;
  color: var(--color-cream);
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.step-icon {
  position: absolute;
  font-size: 18px;
  opacity: 0;
  transition: all 0.3s;
}

.step-icon-img {
  width: 18px;
  height: 18px;
  object-fit: contain;
  position: absolute;
  opacity: 0;
  transition: all 0.3s;
}

.step.active {
  background: linear-gradient(135deg, var(--color-gold) 0%, #D4A548 100%);
  color: var(--color-primary-dark);
  box-shadow:
    0 0 20px rgba(201, 169, 98, 0.7),
    inset 0 2px 4px rgba(255,255,255,0.3);
  transform: scale(1.2);
}

.step.active::after {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid var(--color-gold);
  animation: pulseRing 2s ease-out infinite;
}

@keyframes pulseRing {
  0% {
    transform: scale(0.9);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.35);
    opacity: 0;
  }
}

/* 激活状态时显示图标 */
.step.active .step-icon {
  opacity: 1;
  animation: iconPop 0.4s ease-out;
}

.step.active .step-icon-img {
  opacity: 1;
  animation: iconPop 0.4s ease-out;
}

@keyframes iconPop {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}

.step.active .step-number {
  opacity: 0;
  transform: scale(0);
}

.current-title {
  font-family: var(--font-display);
  font-size: 24px;
  color: var(--color-cream);
  margin: 0;
  position: relative;
  z-index: 1;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
}

/* ===== 主内容区 ===== */
.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ===== 左侧导航 - 米色中国风 ===== */
.side-nav {
  width: 110px;
  background: linear-gradient(180deg, var(--color-cream) 0%, var(--color-cream-dark) 100%);
  border-right: 3px solid var(--color-primary);
  padding: 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}

/* 导航右侧金色装饰线 */
.side-nav::after {
  content: '';
  position: absolute;
  top: 0;
  right: -1px;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent, var(--color-gold), transparent);
}

/* 导航顶部中国结装饰 */
.nav-knot-top,
.nav-knot-bottom {
  width: 40px;
  height: 40px;
  margin: 10px auto;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60' fill='%238B2942'%3E%3Ccircle cx='30' cy='30' r='25' fill='none' stroke='%238B2942' stroke-width='2'/%3E%3Ccircle cx='30' cy='30' r='20' fill='none' stroke='%238B2942' stroke-width='1.5'/%3E%3Cpath d='M20,30 L25,30 L25,25 L35,25 L35,35 L25,35 L25,30' fill='none' stroke='%238B2942' stroke-width='2'/%3E%3Cpath d='M35,30 L40,30' fill='none' stroke='%238B2942' stroke-width='2'/%3E%3Cpath d='M30,20 L30,25' fill='none' stroke='%238B2942' stroke-width='2'/%3E%3Cpath d='M30,35 L30,40' fill='none' stroke='%238B2942' stroke-width='2'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.5;
}

.nav-knot-bottom {
  margin-top: auto;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--color-brown);
  position: relative;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

/* 悬停时金色光晕背景 */
.nav-item::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 6px;
  background: linear-gradient(135deg, rgba(201, 169, 98, 0.15), transparent);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
}

.nav-item:hover {
  background: rgba(139, 41, 66, 0.08);
  color: var(--color-primary);
  transform: scale(1.05);
  box-shadow:
    0 4px 12px rgba(0,0,0,0.15),
    0 0 20px rgba(201, 169, 98, 0.3);
}

.nav-item:hover::before {
  opacity: 1;
  animation: glowPulse 1.5s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.nav-item.active {
  background: var(--color-primary);
  color: var(--color-cream);
  border: 2px solid var(--color-gold);
  box-shadow:
    0 4px 12px rgba(139, 41, 66, 0.4),
    0 0 15px rgba(201, 169, 98, 0.25);
  transform: scale(1.02);
}

.nav-item.active:hover {
  transform: scale(1.05);
  box-shadow:
    0 6px 16px rgba(139, 41, 66, 0.5),
    0 0 25px rgba(201, 169, 98, 0.4);
}

/* 激活状态左侧金色指示条 */
.nav-item.active::after {
  content: '';
  position: absolute;
  left: -2px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 70%;
  background: var(--color-gold);
  border-radius: 0 2px 2px 0;
}

.nav-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  margin-bottom: 6px;
  transition: filter 0.3s, transform 0.3s;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.15));
}

.nav-item:hover .nav-icon {
  transform: scale(1.15);
  filter: drop-shadow(0 2px 6px rgba(139, 41, 66, 0.3));
}

.nav-item.active .nav-icon {
  filter: drop-shadow(0 2px 8px rgba(201, 169, 98, 0.4));
}

.nav-text {
  font-family: var(--font-heading);
  font-size: 13px;
  letter-spacing: 1px;
  font-weight: 500;
}

.content-area {
  flex: 1;
  overflow: hidden;
}

/* ===== 右侧信息面板 ===== */
.info-panel {
  width: 320px;
  background: var(--color-cream);
  border-left: 3px solid var(--color-primary);
  padding: 20px;
  overflow-y: auto;
  position: relative;
}

/* 左侧金色装饰线 */
.info-panel::after {
  content: '';
  position: absolute;
  top: 0;
  left: -1px;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent, var(--color-gold), transparent);
  z-index: 1;
}

/* 面板顶部装饰 - 移除突出 */
.info-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 10%, var(--color-gold) 30%, var(--color-gold) 70%, transparent 90%);
}

/* 面板内容区 */
.panel-content {
  position: relative;
}

/* 同心圆祥云装饰 - 更丰富连贯 */
.panel-content::after {
  content: '';
  position: absolute;
  bottom: -5px;
  right: -15px;
  width: 200px;
  height: 100px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100' fill='none' stroke='%238B2942' stroke-width='1'%3E%3C!-- 主云头 --%3E%3Ccircle cx='45' cy='55' r='28' stroke-dasharray='0 44 132'/%3E%3Ccircle cx='45' cy='55' r='20' stroke-dasharray='0 31 94'/%3E%3Ccircle cx='45' cy='55' r='13' stroke-dasharray='0 20 61'/%3E%3Ccircle cx='45' cy='55' r='6' stroke-dasharray='0 9 28'/%3E%3C!-- 次云头 --%3E%3Ccircle cx='90' cy='42' r='22' stroke-dasharray='0 35 104'/%3E%3Ccircle cx='90' cy='42' r='15' stroke-dasharray='0 24 71'/%3E%3Ccircle cx='90' cy='42' r='8' stroke-dasharray='0 13 38'/%3E%3Ccircle cx='90' cy='42' r='4' stroke-dasharray='0 6 19'/%3E%3C!-- 小云头 --%3E%3Ccircle cx='125' cy='50' r='14' stroke-dasharray='0 22 66'/%3E%3Ccircle cx='125' cy='50' r='8' stroke-dasharray='0 13 38'/%3E%3Ccircle cx='125' cy='50' r='4' stroke-dasharray='0 6 19'/%3E%3C!-- 连接线 --%3E%3Cpath d='M73,55 Q82,48 90,42' stroke-width='0.8'/%3E%3Cpath d='M112,42 Q118,46 125,50' stroke-width='0.8'/%3E%3C!-- 飘带 --%3E%3Cpath d='M45,75 Q70,82 110,78 Q150,74 180,70' stroke-width='1.5'/%3E%3Cpath d='M73,60 Q100,68 140,65 Q170,62 195,58' stroke-width='1.2'/%3E%3Cpath d='M112,48 Q140,55 170,52 Q190,50 200,48' stroke-width='1'/%3E%3Cpath d='M45,85 Q80,92 130,88 Q170,84 200,80' stroke-width='0.8'/%3E%3C!-- 点缀小涡 --%3E%3Ccircle cx='155' cy='58' r='6' stroke-dasharray='0 9 28'/%3E%3Ccircle cx='155' cy='58' r='3' stroke-dasharray='0 5 14'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.15;
  pointer-events: none;
}

.panel-header {
  margin-top: 10px;
  padding-bottom: 16px;
  margin-bottom: 0;
  position: relative;
}

.panel-header h3 {
  font-family: var(--font-display);
  font-size: 24px;
  color: var(--color-primary);
  margin: 0 0 8px 0;
}

.panel-header p {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0;
}

/* ===== 卡片样式 - 双线框 + 纸质感背景 ===== */
.stats-card, .filter-card, .time-card {
  padding: 16px;
  margin-bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 100%);
  border: 3px solid var(--color-primary);
  border-radius: 4px;
  position: relative;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 卡片悬停效果 - 光晕 + 放大 */
.stats-card:hover, .filter-card:hover, .time-card:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 8px 20px rgba(139, 41, 66, 0.15),
    0 0 30px rgba(201, 169, 98, 0.25);
}

/* 双线框装饰 */
.stats-card::before, .filter-card::before, .time-card::before {
  content: '';
  position: absolute;
  inset: 6px;
  border: 1px solid var(--color-gold);
  border-radius: 2px;
  pointer-events: none;
  opacity: 0.4;
  transition: opacity 0.3s;
}

.stats-card:hover::before, .filter-card:hover::before, .time-card:hover::before {
  opacity: 0.7;
}

/* 卡片右上角装饰 - 中国结元素 */
.stats-card::after, .filter-card::after, .time-card::after {
  content: '';
  position: absolute;
  top: 8px;
  right: 8px;
  width: 12px;
  height: 12px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23C9A962'%3E%3Ccircle cx='10' cy='10' r='8' fill='none' stroke='%23C9A962' stroke-width='1.5'/%3E%3Ccircle cx='10' cy='10' r='5' fill='none' stroke='%23C9A962' stroke-width='1'/%3E%3Cpath d='M10,5 L12,10 L10,15 L8,10 Z' fill='%23C9A962'/%3E%3C/svg%3E");
  background-size: contain;
  opacity: 0.5;
  pointer-events: none;
  transition: opacity 0.3s;
}

.stats-card:hover::after, .filter-card:hover::after, .time-card:hover::after {
  opacity: 0.8;
}

.stats-card h4, .filter-card h4, .time-card h4 {
  font-family: var(--font-display);
  font-size: 15px;
  color: var(--color-primary);
  margin: 0 0 14px 0;
  padding-left: 10px;
  border-left: 3px solid var(--color-gold);
  position: relative;
  z-index: 1;
  font-style: italic;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  position: relative;
  z-index: 1;
}

.stat-item {
  text-align: center;
  padding: 8px 4px;
  background: rgba(139, 41, 66, 0.05);
  border-radius: 4px;
  border: 1px solid rgba(139, 41, 66, 0.1);
}

.stat-value {
  display: block;
  font-family: var(--font-display);
  font-size: 22px;
  color: var(--color-primary);
}

.stat-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

.filter-row {
  margin-bottom: 14px;
  position: relative;
  z-index: 1;
}

.filter-row label {
  display: block;
  font-family: var(--font-heading);
  font-size: 12px;
  color: var(--color-brown);
  margin-bottom: 6px;
}

.filter-row .el-select {
  width: 100%;
}

/* ===== 时段滑动条样式 ===== */
.time-slider-wrapper {
  padding: 0 4px;
}

.time-icons {
  display: flex;
  justify-content: space-between;
  padding: 0 6px;
  margin-bottom: 8px;
}

.time-icon {
  font-size: 20px;
  opacity: 0.4;
  transition: all 0.3s;
  filter: grayscale(0.5);
}

.time-icon.active {
  opacity: 1;
  filter: grayscale(0);
  transform: scale(1.2);
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.2));
}

.time-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 2px;
  margin-top: 6px;
}

.time-labels span {
  font-family: var(--font-heading);
  font-size: 11px;
  color: var(--color-text-muted);
  transition: all 0.3s;
}

.time-labels span.active {
  color: var(--color-primary);
  font-weight: 600;
}

/* 自定义滑动条样式 */
.time-slider :deep(.el-slider__runway) {
  height: 8px;
  background: linear-gradient(90deg,
    #FFB74D 0%,      /* 清晨 - 橙色 */
    #FFEB3B 33%,     /* 白天 - 黄色 */
    #FF7043 66%,     /* 傍晚 - 橙红 */
    #5C6BC0 100%     /* 深夜 - 靛蓝 */
  );
  border-radius: 4px;
}

.time-slider :deep(.el-slider__bar) {
  height: 8px;
  background: transparent;
  border-radius: 4px;
}

.time-slider :deep(.el-slider__button-wrapper) {
  top: -14px;
}

.time-slider :deep(.el-slider__button) {
  width: 20px;
  height: 20px;
  border: 3px solid var(--color-primary);
  background: var(--color-cream);
  box-shadow: 0 2px 8px rgba(139, 41, 66, 0.3);
  transition: all 0.3s;
}

.time-slider :deep(.el-slider__button):hover {
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(139, 41, 66, 0.4);
}

.time-slider :deep(.el-slider__stop) {
  width: 12px;
  height: 12px;
  background: var(--color-cream);
  border: 2px solid var(--color-gold);
  top: -2px;
}

/* 时间显示 - 根据时段变色 */
.time-display {
  text-align: center;
  font-family: var(--font-heading);
  font-size: 14px;
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  position: relative;
  z-index: 1;
  transition: all 0.3s;
}

.time-display.time-slot-0 {
  color: #E65100;
  background: linear-gradient(135deg, rgba(255, 183, 77, 0.2) 0%, rgba(255, 183, 77, 0.1) 100%);
  border: 1px solid rgba(255, 183, 77, 0.4);
}

.time-display.time-slot-1 {
  color: #F57F17;
  background: linear-gradient(135deg, rgba(255, 235, 59, 0.2) 0%, rgba(255, 235, 59, 0.1) 100%);
  border: 1px solid rgba(255, 235, 59, 0.4);
}

.time-display.time-slot-2 {
  color: #D84315;
  background: linear-gradient(135deg, rgba(255, 112, 67, 0.2) 0%, rgba(255, 112, 67, 0.1) 100%);
  border: 1px solid rgba(255, 112, 67, 0.4);
}

.time-display.time-slot-3 {
  color: #303F9F;
  background: linear-gradient(135deg, rgba(92, 107, 192, 0.2) 0%, rgba(92, 107, 192, 0.1) 100%);
  border: 1px solid rgba(92, 107, 192, 0.4);
}

/* 金色分割线样式 */
.divider-gold {
  height: 1px;
  background: linear-gradient(90deg, transparent, #D4AF37 15%, #D4AF37 85%, transparent);
  margin: 16px 0;
}
</style>
