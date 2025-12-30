<template>
  <div class="footprint-view">
    <div class="view-header">
      <img :src="footprintIcon" :alt="title" class="header-icon">
      <h3>{{ title }}</h3>
    </div>
    <div class="stats-header">
      <div class="stat-box">
        <span class="stat-num">{{ stats.cities }}</span>
        <span class="stat-label">城市</span>
      </div>
      <div class="stat-box">
        <span class="stat-num">{{ stats.spots }}</span>
        <span class="stat-label">打卡点</span>
      </div>
      <div class="stat-box">
        <span class="stat-num">{{ stats.distance }}</span>
        <span class="stat-label">公里</span>
      </div>
    </div>

    <div class="footprint-list">
      <h4>我的足迹</h4>
      <div v-if="footprints.length === 0" class="empty">
        <p>还没有打卡记录，去探索吧！</p>
        <el-button type="primary" @click="showCheckin = true">立即打卡</el-button>
      </div>
      <div v-else class="timeline">
        <div v-for="item in footprints" :key="item.id" class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h5>{{ item.name }}</h5>
            <p>{{ item.address }}</p>
            <span class="time">{{ item.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 打卡弹窗 -->
    <el-dialog v-model="showCheckin" title="打卡" width="400px">
      <el-form :model="checkinForm">
        <el-form-item label="位置">
          <el-input v-model="checkinForm.location" placeholder="自动定位或手动输入" />
        </el-form-item>
        <el-form-item label="心情">
          <el-rate v-model="checkinForm.rating" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="checkinForm.note" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCheckin = false">取消</el-button>
        <el-button type="primary" @click="submitCheckin">确认打卡</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import footprintIcon from '@/assets/icons/footprint.png'

const title = '探索足迹'
const stats = reactive({ cities: 3, spots: 12, distance: 45.6 })
const footprints = ref([
  { id: 1, name: '宽窄巷子', address: '成都市青羊区', time: '2024-12-15 14:30' },
  { id: 2, name: '春熙路', address: '成都市锦江区', time: '2024-12-15 18:00' }
])

const showCheckin = ref(false)
const checkinForm = reactive({
  location: '',
  rating: 5,
  note: ''
})

function submitCheckin() {
  ElMessage.success('打卡成功！')
  showCheckin.value = false
}
</script>

<style scoped>
.footprint-view {
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

.stats-header {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-box {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-label {
  font-size: 14px;
  color: #888;
}

.footprint-list {
  background: white;
  padding: 24px;
  border-radius: 12px;
}

.footprint-list h4 {
  margin: 0 0 20px;
  color: var(--color-primary);
}

.empty {
  text-align: center;
  padding: 40px;
  color: #888;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--color-secondary);
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
}

.timeline-dot {
  position: absolute;
  left: -26px;
  top: 4px;
  width: 12px;
  height: 12px;
  background: var(--color-primary);
  border-radius: 50%;
  border: 2px solid white;
}

.timeline-content h5 {
  margin: 0;
  color: var(--color-brown);
}

.timeline-content p {
  margin: 4px 0;
  font-size: 13px;
  color: #666;
}

.timeline-content .time {
  font-size: 12px;
  color: #aaa;
}
</style>
