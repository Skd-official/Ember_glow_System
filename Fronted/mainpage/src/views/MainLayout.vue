<template>
  <div class="main-layout">
    <!-- 顶部标题区 -->
    <header class="main-header">
      <div class="header-left">
        <span class="logo-text">🔥 烟火漫游</span>
      </div>
      <div class="header-center">
        <p class="header-slogan">SUCH IS THE JOY OF OUR REUNION</p>
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
    <div class="function-card">
      <div class="step-indicators">
        <span v-for="i in 4" :key="i" class="step" :class="{ active: i <= currentStep }">{{ i }}</span>
      </div>
      <h2 class="current-title">{{ featureConfig[appStore.currentFeature]?.title }}</h2>
    </div>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 左侧导航 -->
      <nav class="side-nav">
        <button 
          v-for="item in navItems" 
          :key="item.id"
          class="nav-item"
          :class="{ active: appStore.currentFeature === item.id }"
          @click="navigateTo(item)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.label }}</span>
        </button>
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

        <div class="panel-content">
          <!-- 统计卡片 -->
          <div class="stats-card">
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

          <!-- 筛选器 -->
          <div class="filter-card">
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

          <!-- 时间控制 -->
          <div class="time-card">
            <h4>时段选择</h4>
            <el-slider 
              v-model="appStore.timeSlot" 
              :min="0" 
              :max="3" 
              :marks="timeMarks"
              :format-tooltip="formatTime"
            />
            <p class="time-display">{{ currentTimeLabel }}</p>
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

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const showLogin = ref(false)
const preference = ref('mixed')

const navItems = [
  { id: 'map', label: '烟火地图', icon: '🗺️', path: '/main/map' },
  { id: 'route', label: '路线规划', icon: '🛤️', path: '/main/route' },
  { id: 'footprint', label: '探索足迹', icon: '👣', path: '/main/footprint' },
  { id: 'travelog', label: 'AI游记', icon: '📝', path: '/main/travelog' },
  { id: 'community', label: '社区广场', icon: '🏘️', path: '/main/community' },
  { id: 'trend', label: '趋势对比', icon: '📊', path: '/main/trend' }
]

const featureConfig = {
  map: { title: '烟火地图', panelTitle: '城市烟火气地图', panelSubtitle: '在全国尺度上观察城市的烟火气分布', step: 1 },
  route: { title: '路线规划', panelTitle: '智能探索路线规划', panelSubtitle: '基于时间、预算与偏好生成路线', step: 2 },
  footprint: { title: '探索足迹', panelTitle: '探索打卡与足迹地图', panelSubtitle: '记录每一次真实的到访', step: 3 },
  travelog: { title: 'AI游记', panelTitle: 'AI 游记生成', panelSubtitle: '把足迹织成一篇有温度的游记', step: 4 },
  community: { title: '社区广场', panelTitle: '探索社区与灵感广场', panelSubtitle: '看看别人的烟火路线', step: 1 },
  trend: { title: '趋势对比', panelTitle: '夜光与烟火气趋势对比', panelSubtitle: '感受城市的亮起与熄灭', step: 1 }
}

const currentStep = computed(() => featureConfig[appStore.currentFeature]?.step || 1)

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
}

.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid #eee;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary);
}

.header-slogan {
  font-size: 12px;
  letter-spacing: 3px;
  color: var(--color-secondary);
}

.function-card {
  background: var(--color-cream);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 2px solid var(--color-secondary);
}

.step-indicators {
  display: flex;
  gap: 8px;
}

.step {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ddd;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s;
}
.step.active {
  background: var(--color-primary);
}

.current-title {
  font-size: 24px;
  color: var(--color-primary);
  margin: 0;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.side-nav {
  width: 100px;
  background: white;
  border-right: 1px solid #eee;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
}
.nav-item:hover {
  background: var(--color-cream);
}
.nav-item.active {
  background: var(--color-primary);
  color: white;
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.nav-text {
  font-size: 12px;
}

.content-area {
  flex: 1;
  overflow: hidden;
}

.info-panel {
  width: 300px;
  background: white;
  border-left: 1px solid #eee;
  padding: 20px;
  overflow-y: auto;
}

.panel-header h3 {
  font-size: 18px;
  color: var(--color-primary);
  margin: 0 0 8px 0;
}

.panel-header p {
  font-size: 13px;
  color: #888;
  margin: 0 0 20px 0;
}

.stats-card, .filter-card, .time-card {
  background: var(--color-cream);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.stats-card h4, .filter-card h4, .time-card h4 {
  font-size: 14px;
  color: var(--color-brown);
  margin: 0 0 12px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
}

.stat-label {
  font-size: 11px;
  color: #888;
}

.filter-row {
  margin-bottom: 12px;
}

.filter-row label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.filter-row .el-select {
  width: 100%;
}

.time-display {
  text-align: center;
  font-size: 14px;
  color: var(--color-primary);
  margin-top: 12px;
}
</style>
