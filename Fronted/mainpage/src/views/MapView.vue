<template>
  <div class="map-view">
    <div ref="cesiumContainer" class="cesium-container"></div>
    
    <!-- 地图控件 -->
    <div class="map-controls">
      <div class="legend-control">
        <span class="control-label">烟火气指数</span>
        <div class="legend-gradient">
          <span>低</span>
          <div class="gradient-bar"></div>
          <span>高</span>
        </div>
      </div>
    </div>

    <!-- 加载提示 -->
    <div v-if="loading" class="loading-overlay">
      <el-icon class="is-loading" :size="40"><Loading /></el-icon>
      <p>地图加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 使用全局 Cesium（从 CDN 加载）
const Cesium = window.Cesium

const appStore = useAppStore()
const cesiumContainer = ref(null)
const loading = ref(true)
let viewer = null

// Cesium Ion 令牌
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MDNmZjY1MS01YjcyLTQxMzctYTFmZS01YzhlMmE0ODFmOWQiLCJpZCI6MzcwNTYwLCJpYXQiOjE3NjU5NzU2ODd9.blf3lw3GlznfiOGsc2wRMGvNzuIhdxj1YlfhiFeyp_U'

onMounted(async () => {
  try {
    // 创建 Cesium Viewer，使用简化配置
    viewer = new Cesium.Viewer(cesiumContainer.value, {
      baseLayerPicker: false,
      animation: false,
      timeline: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      selectionIndicator: true,
      infoBox: true,
      // 重要：禁用 requestRenderMode 以避免渲染问题
      requestRenderMode: false,
      maximumRenderTimeChange: Infinity
    })

    // 优化渲染性能
    viewer.scene.globe.enableLighting = false
    viewer.scene.fog.enabled = true
    viewer.scene.globe.depthTestAgainstTerrain = false

    // 保存到store
    appStore.setViewer(viewer)

    // 飞行到中国
    await flyToChina()

    // 加载边界数据
    await loadChinaBoundary()

    // 添加城市标记
    addCityMarkers()

    // 添加悬停交互效果
    setupHoverEffects()

    loading.value = false
    console.log('✅ Cesium 初始化成功')

  } catch (error) {
    console.error('Cesium 初始化失败:', error)
    ElMessage.error('地图加载失败，请刷新页面重试')
    loading.value = false
  }
})

onUnmounted(() => {
  if (viewer) {
    viewer.destroy()
    appStore.setViewer(null)
  }
})

async function flyToChina() {
  try {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(105.0, 35.0, 5000000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0
      },
      duration: 2.5,
      complete: () => {
        console.log('✓ 已飞行到中国')
      }
    })
  } catch (error) {
    console.error('飞行到中国失败:', error)
  }
}

async function loadChinaBoundary() {
  try {
    // 方案 1: 使用本地数据（最稳定）
    const url = '/data/100000_full.json'

    const dataSource = await Cesium.GeoJsonDataSource.load(url, {
      stroke: Cesium.Color.fromCssColorString('#D4A574').withAlpha(0.9),
      fill: Cesium.Color.fromCssColorString('#8B2942').withAlpha(0.2),
      strokeWidth: 3,
      clampToGround: true,
      markerSize: 8,
      markerColor: Cesium.Color.YELLOW
    })

    dataSource.name = 'china-boundary'
    viewer.dataSources.add(dataSource)

    // 遍历所有实体并优化样式
    dataSource.entities.values.forEach(entity => {
      // 优化多边形样式
      if (entity.polygon) {
        entity.polygon.outline = true
        entity.polygon.outlineColor = Cesium.Color.fromCssColorString('#D4A574')
        entity.polygon.outlineWidth = 2
        entity.polygon.fill = true
        // 禁用简化以获得精确边界
        entity.polygon.arcType = Cesium.ArcType.GEODESIC
      }

      // 优化折线样式（如果存在）
      if (entity.polyline) {
        entity.polyline.clampToGround = true
        entity.polyline.width = 2
        entity.polyline.material = Cesium.Color.fromCssColorString('#D4A574').withAlpha(0.8)
      }
    })

    console.log('✅ 中国边界数据加载成功 (本地)', dataSource.entities.values.length, '个实体')
  } catch (error) {
    console.warn('⚠️ 本地加载失败，尝试代理加载...', error)

    // 降级方案 2: 使用代理地址
    try {
      const dataSource = await Cesium.GeoJsonDataSource.load(
        '/geo/areas_v3/bound/100000_full.json',
        {
          stroke: Cesium.Color.fromCssColorString('#D4A574').withAlpha(0.9),
          fill: Cesium.Color.fromCssColorString('#8B2942').withAlpha(0.2),
          strokeWidth: 3,
          clampToGround: true
        }
      )
      dataSource.name = 'china-boundary'
      viewer.dataSources.add(dataSource)
      console.log('✅ 使用代理源加载边界成功')
    } catch (proxyError) {
      console.warn('⚠️ 代理加载失败，尝试在线源...', proxyError)

      // 降级方案 3: 在线备用源
      try {
        const dataSource = await Cesium.GeoJsonDataSource.load(
          'https://chyangkwang.github.io/geojson/china.geojson',
          {
            stroke: Cesium.Color.fromCssColorString('#D4A574').withAlpha(0.9),
            fill: Cesium.Color.fromCssColorString('#8B2942').withAlpha(0.2),
            strokeWidth: 3,
            clampToGround: true
          }
        )
        dataSource.name = 'china-boundary'
        viewer.dataSources.add(dataSource)
        console.log('✅ 使用在线备用源加载边界成功')
      } catch (onlineError) {
        console.warn('⚠️ 所有边界加载方案均失败', onlineError)
        ElMessage.warning('中国边界加载失败，但不影响地图其他功能')
        // 继续执行，不中断城市标记的添加
      }
    }
  }
}

function addCityMarkers() {
  appStore.hotCities.forEach(city => {
    const hue = (100 - city.index) / 100 * 0.1
    const color = Cesium.Color.fromHsl(hue, 0.9, 0.5)

    viewer.entities.add({
      name: city.name,
      position: Cesium.Cartesian3.fromDegrees(city.lon, city.lat, 10000),
      point: {
        pixelSize: 12 + city.index / 10,
        color: color,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        scaleByDistance: new Cesium.NearFarScalar(1e5, 2, 5e6, 0.5)
      },
      label: {
        text: city.name,
        font: 'bold 16px Microsoft YaHei',
        fillColor: Cesium.Color.fromCssColorString('#5C3D2E'),
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 3,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -20),
        scaleByDistance: new Cesium.NearFarScalar(1e5, 1.5, 5e6, 0.3)
      },
      description: `
        <div style="padding: 10px; font-family: 'Microsoft YaHei';">
          <h3 style="color: #8B2942; margin: 0 0 10px;">🔥 ${city.name}</h3>
          <p><strong>烟火气指数：</strong>${city.index}/100</p>
          <p><strong>特色：</strong>${city.desc}</p>
        </div>
      `
    })

    // 脉冲圆圈
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(city.lon, city.lat),
      ellipse: {
        semiMinorAxis: 50000 + city.index * 500,
        semiMajorAxis: 50000 + city.index * 500,
        material: color.withAlpha(0.2),
        outline: true,
        outlineColor: color.withAlpha(0.5)
      }
    })
  })
}

// 悬停效果相关变量
let hoveredEntity = null
let pulseAnimation = null
let originalPointSize = null
let tooltipOverlay = null

function setupHoverEffects() {
  // 创建自定义 tooltip 覆盖层
  createTooltipOverlay()

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

  // 鼠标移动事件
  handler.setInputAction((movement) => {
    const pickedObject = viewer.scene.pick(movement.endPosition)

    if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.point) {
      const entity = pickedObject.id

      // 如果是新的实体
      if (hoveredEntity !== entity) {
        // 恢复之前的实体
        resetHoveredEntity()

        // 设置新的悬停实体
        hoveredEntity = entity
        originalPointSize = entity.point.pixelSize.getValue()

        // 放大效果
        entity.point.pixelSize = originalPointSize * 1.5
        entity.point.outlineWidth = 3

        // 启动脉冲动画
        startPulseAnimation(entity)

        // 显示详细信息 tooltip
        showTooltip(entity, movement.endPosition)
      } else {
        // 更新 tooltip 位置
        updateTooltipPosition(movement.endPosition)
      }

      // 改变鼠标样式
      viewer.container.style.cursor = 'pointer'
    } else {
      // 离开实体
      resetHoveredEntity()
      hideTooltip()
      viewer.container.style.cursor = 'default'
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
}

function createTooltipOverlay() {
  tooltipOverlay = document.createElement('div')
  tooltipOverlay.className = 'city-tooltip'
  tooltipOverlay.style.cssText = `
    position: absolute;
    display: none;
    pointer-events: none;
    z-index: 1000;
    background: linear-gradient(135deg, rgba(139, 41, 66, 0.95) 0%, rgba(92, 61, 46, 0.95) 100%);
    color: #FDF6E3;
    padding: 12px 16px;
    border-radius: 8px;
    font-family: 'ZCOOL XiaoWei', serif;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3), 0 0 30px rgba(201, 169, 98, 0.3);
    border: 2px solid #C9A962;
    min-width: 180px;
    transform: translate(-50%, -100%);
    margin-top: -15px;
  `
  viewer.container.appendChild(tooltipOverlay)
}

function showTooltip(entity, position) {
  const cityData = appStore.hotCities.find(c => c.name === entity.name)
  if (!cityData || !tooltipOverlay) return

  tooltipOverlay.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #C9A962;">
        🔥 ${cityData.name}
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span style="color: #D4A574;">烟火气指数</span>
        <span style="font-weight: bold; color: #FDF6E3;">${cityData.index}/100</span>
      </div>
      <div style="height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; overflow: hidden; margin-bottom: 8px;">
        <div style="height: 100%; width: ${cityData.index}%; background: linear-gradient(90deg, #C9A962, #D4A574); border-radius: 3px;"></div>
      </div>
      <div style="font-size: 12px; color: #D4A574; line-height: 1.4;">
        ${cityData.desc}
      </div>
    </div>
  `

  tooltipOverlay.style.left = position.x + 'px'
  tooltipOverlay.style.top = position.y + 'px'
  tooltipOverlay.style.display = 'block'

  // 添加入场动画
  tooltipOverlay.style.animation = 'tooltipFadeIn 0.3s ease-out'
}

function updateTooltipPosition(position) {
  if (tooltipOverlay) {
    tooltipOverlay.style.left = position.x + 'px'
    tooltipOverlay.style.top = position.y + 'px'
  }
}

function hideTooltip() {
  if (tooltipOverlay) {
    tooltipOverlay.style.display = 'none'
  }
}

function startPulseAnimation(entity) {
  if (pulseAnimation) {
    clearInterval(pulseAnimation)
  }

  let scale = 1
  let growing = true
  const baseSize = originalPointSize * 1.5

  pulseAnimation = setInterval(() => {
    if (growing) {
      scale += 0.02
      if (scale >= 1.2) growing = false
    } else {
      scale -= 0.02
      if (scale <= 1) growing = true
    }

    if (entity && entity.point) {
      entity.point.pixelSize = baseSize * scale
    }
  }, 30)
}

function resetHoveredEntity() {
  if (hoveredEntity && hoveredEntity.point && originalPointSize) {
    hoveredEntity.point.pixelSize = originalPointSize
    hoveredEntity.point.outlineWidth = 2
  }

  if (pulseAnimation) {
    clearInterval(pulseAnimation)
    pulseAnimation = null
  }

  hoveredEntity = null
  originalPointSize = null
}
</script>

<style scoped>
.map-view {
  width: 100%;
  height: 100%;
  position: relative;
}

.cesium-container {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.control-label {
  font-size: 12px;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.legend-gradient {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #888;
}

.gradient-bar {
  width: 100px;
  height: 8px;
  background: linear-gradient(to right, #4A90D9, #F5A623, #D0021B);
  border-radius: 4px;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--color-primary);
}
</style>

<!-- 全局样式 - tooltip 动画 -->
<style>
@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -100%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1);
  }
}

.city-tooltip::before {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #C9A962;
}

.city-tooltip::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(139, 41, 66, 0.95);
}
</style>
