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
import * as Cesium from 'cesium'

const appStore = useAppStore()
const cesiumContainer = ref(null)
const loading = ref(true)
let viewer = null

// Cesium Ion 令牌
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MDNmZjY1MS01YjcyLTQxMzctYTFmZS01YzhlMmE0ODFmOWQiLCJpZCI6MzcwNTYwLCJpYXQiOjE3NjU5NzU2ODd9.blf3lw3GlznfiOGsc2wRMGvNzuIhdxj1YlfhiFeyp_U'

onMounted(async () => {
  try {
    viewer = new Cesium.Viewer(cesiumContainer.value, {
      terrainProvider: await Cesium.createWorldTerrainAsync(),
      baseLayerPicker: false,
      animation: false,
      timeline: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      selectionIndicator: true,
      infoBox: true
    })

    viewer.scene.globe.enableLighting = false
    viewer.scene.fog.enabled = true

    // 保存到store
    appStore.setViewer(viewer)

    // 飞行到中国
    flyToChina()

    // 加载边界数据
    await loadChinaBoundary()

    // 添加城市标记
    addCityMarkers()

    loading.value = false
    console.log('✅ Cesium 初始化成功')

  } catch (error) {
    console.error('Cesium 初始化失败:', error)
    ElMessage.error('地图加载失败')
    loading.value = false
  }
})

onUnmounted(() => {
  if (viewer) {
    viewer.destroy()
    appStore.setViewer(null)
  }
})

function flyToChina() {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(105.0, 35.0, 6000000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0
    },
    duration: 2.5
  })
}

async function loadChinaBoundary() {
  try {
    const dataSource = await Cesium.GeoJsonDataSource.load(
      'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
      {
        stroke: Cesium.Color.fromCssColorString('#D4A574').withAlpha(0.8),
        fill: Cesium.Color.fromCssColorString('#8B2942').withAlpha(0.15),
        strokeWidth: 2,
        clampToGround: true
      }
    )
    dataSource.name = 'china-boundary'
    viewer.dataSources.add(dataSource)
    console.log('✅ 中国边界数据加载成功')
  } catch (error) {
    console.warn('边界数据加载失败:', error)
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
