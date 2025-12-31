<template>
  <div class="trend-view">
    <div class="view-header">
      <img :src="trendIcon" :alt="title" class="header-icon">
      <h3>{{ title }}</h3>
    </div>
    <div class="trend-header">
      <h3>📊 夜光与烟火气趋势对比</h3>
      <div class="year-selector">
        <el-radio-group v-model="selectedYear">
          <el-radio-button label="2015">2015</el-radio-button>
          <el-radio-button label="2020">2020</el-radio-button>
          <el-radio-button label="2024">2024</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="charts-container">
      <div class="chart-card">
        <h4>夜光强度变化</h4>
        <div ref="nightlightChart" class="chart"></div>
      </div>
      <div class="chart-card">
        <h4>烟火气指数趋势</h4>
        <div ref="vitalityChart" class="chart"></div>
      </div>
    </div>

    <div class="insights">
      <h4>趋势洞察</h4>
      <div class="insight-cards">
        <div class="insight-card rising">
          <span class="icon">📈</span>
          <div class="info">
            <h5>崛起中的街区</h5>
            <p>成都太古里周边 +45%</p>
            <p>武汉光谷 +38%</p>
          </div>
        </div>
        <div class="insight-card stable">
          <span class="icon">➡️</span>
          <div class="info">
            <h5>稳定发展</h5>
            <p>长沙五一广场</p>
            <p>西安回民街</p>
          </div>
        </div>
        <div class="insight-card declining">
          <span class="icon">📉</span>
          <div class="info">
            <h5>需要关注</h5>
            <p>部分老城区 -15%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import trendIcon from '@/assets/icons/trend.png'

const title = '趋势对比'
const selectedYear = ref('2024')
const nightlightChart = ref(null)
const vitalityChart = ref(null)

onMounted(() => {
  initNightlightChart()
  initVitalityChart()
})

function initNightlightChart() {
  const chart = echarts.init(nightlightChart.value)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['成都', '武汉', '长沙', '西安', '重庆', '广州']
    },
    yAxis: { type: 'value', name: '夜光强度' },
    series: [
      { name: '2015', type: 'bar', data: [45, 52, 38, 41, 48, 62] },
      { name: '2020', type: 'bar', data: [58, 61, 52, 49, 55, 68] },
      { name: '2024', type: 'bar', data: [72, 68, 65, 58, 70, 75] }
    ],
    color: ['#91CC75', '#FAC858', '#EE6666']
  })
}

function initVitalityChart() {
  const chart = echarts.init(vitalityChart.value)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1月', '3月', '5月', '7月', '9月', '11月']
    },
    yAxis: { type: 'value', name: '烟火气指数' },
    series: [{
      name: '烟火气指数',
      type: 'line',
      smooth: true,
      data: [78, 82, 85, 92, 88, 95],
      areaStyle: { opacity: 0.3 },
      itemStyle: { color: '#8B2942' }
    }]
  })
}
</script>

<style scoped>
.trend-view {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
}

.view-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(212, 165, 116, 0.3);
}

.header-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.view-header h3 {
  margin: 0;
  color: var(--color-brown);
  font-size: 20px;
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.trend-header h3 {
  margin: 0;
  color: var(--color-primary);
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
}

.chart-card h4 {
  margin: 0 0 16px;
  color: var(--color-brown);
}

.chart {
  height: 300px;
}

.insights {
  background: white;
  padding: 24px;
  border-radius: 12px;
}

.insights h4 {
  margin: 0 0 16px;
  color: var(--color-primary);
}

.insight-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.insight-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
}

.insight-card.rising { background: #E8F5E9; }
.insight-card.stable { background: #FFF3E0; }
.insight-card.declining { background: #FFEBEE; }

.insight-card .icon {
  font-size: 24px;
}

.insight-card h5 {
  margin: 0 0 8px;
  color: var(--color-brown);
}

.insight-card p {
  margin: 0;
  font-size: 13px;
  color: #666;
}
</style>
