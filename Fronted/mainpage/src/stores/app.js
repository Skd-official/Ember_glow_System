import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const currentFeature = ref('map')
  const selectedCity = ref('成都')
  const timeSlot = ref(2) // 0-清晨 1-白天 2-傍晚 3-深夜
  const cesiumViewer = ref(null)

  const timeConfig = [
    { label: '清晨', range: '06:00-09:00', period: 'morning' },
    { label: '白天', range: '10:00-17:00', period: 'daytime' },
    { label: '傍晚', range: '18:00-22:00', period: 'evening' },
    { label: '深夜', range: '23:00-02:00', period: 'night' }
  ]

  const hotCities = [
    { name: '成都', lon: 104.07, lat: 30.67, index: 95, desc: '火锅串串，巴适得板' },
    { name: '武汉', lon: 114.30, lat: 30.60, index: 92, desc: '过早文化，热干面之都' },
    { name: '长沙', lon: 112.94, lat: 28.23, index: 90, desc: '夜宵之城，娱乐天堂' },
    { name: '西安', lon: 108.95, lat: 34.27, index: 88, desc: '回民街，千年古都烟火' },
    { name: '重庆', lon: 106.55, lat: 29.56, index: 93, desc: '山城夜景，江湖菜香' },
    { name: '广州', lon: 113.26, lat: 23.13, index: 89, desc: '早茶文化，食在广州' },
    { name: '北京', lon: 116.41, lat: 39.90, index: 85, desc: '胡同烟火，京味儿十足' },
    { name: '上海', lon: 121.47, lat: 31.23, index: 86, desc: '弄堂生活，海派风情' },
    { name: '杭州', lon: 120.15, lat: 30.29, index: 84, desc: '西湖夜市，江南韵味' },
    { name: '南京', lon: 118.80, lat: 32.06, index: 87, desc: '秦淮灯火，金陵味道' }
  ]

  function setFeature(feature) {
    currentFeature.value = feature
  }

  function setCity(city) {
    selectedCity.value = city
  }

  function setTimeSlot(slot) {
    timeSlot.value = slot
  }

  function setViewer(viewer) {
    cesiumViewer.value = viewer
  }

  return {
    currentFeature, selectedCity, timeSlot, cesiumViewer,
    timeConfig, hotCities,
    setFeature, setCity, setTimeSlot, setViewer
  }
})
