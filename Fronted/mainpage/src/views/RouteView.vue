<template>
  <div class="route-view">
    <div class="view-header">
      <img :src="routeIcon" :alt="title" class="header-icon">
      <h3>{{ title }}</h3>
    </div>
    <div class="route-form">
      <h3>🛤️ 智能路线规划</h3>
      <el-form :model="form" label-position="top">
        <el-form-item label="出发位置">
          <el-input v-model="form.location" placeholder="点击地图选择或输入地址" />
        </el-form-item>
        <el-form-item label="游玩时长（天）">
          <el-input-number v-model.number="form.duration" :min="1" :max="30" :step="1" placeholder="请输入游玩天数" />
          <span style="margin-left: 12px; color: #888; font-size: 12px;">
            <span v-if="form.duration">计划{{ form.duration }}天的烟火之旅</span>
            <span v-else>请输入游玩天数</span>
          </span>
        </el-form-item>
        <el-form-item label="偏好类型">
          <el-checkbox-group v-model="form.preferences">
            <el-checkbox label="food">美食</el-checkbox>
            <el-checkbox label="culture">文艺</el-checkbox>
            <el-checkbox label="nightlife">夜生活</el-checkbox>
            <el-checkbox label="local">本地特色</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="预算（可选）">
          <el-input-number v-model="form.budget" :min="0" :step="50" placeholder="元" />
        </el-form-item>
        <el-button type="primary" :loading="generating" @click="generateRoute">
          生成路线
        </el-button>
      </el-form>
    </div>

    <div class="route-result" v-if="routeResult">
      <h4>推荐路线</h4>
      <div class="route-summary">
        <span>🕐 {{ routeResult.duration }}</span>
        <span>📍 {{ routeResult.distance }}</span>
        <span>💰 约{{ routeResult.budget }}元</span>
      </div>
      <div class="poi-list">
        <div v-for="(poi, index) in routeResult.pois" :key="poi.id" class="poi-item">
          <span class="poi-index">{{ index + 1 }}</span>
          <div class="poi-info">
            <h5>{{ poi.name }}</h5>
            <p>{{ poi.category }} · {{ poi.rating }}分</p>
          </div>
        </div>
      </div>
      <el-button type="success" @click="saveRoute">保存路线</el-button>
    </div>

    <div class="empty-state" v-else>
      <p>填写条件后点击"生成路线"，AI将为你规划最佳烟火气路线</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import routeIcon from '@/assets/icons/route.png'

const title = '路线规划'
const form = reactive({
  location: '',
  duration: 3,
  preferences: ['food'],
  budget: 200
})

const generating = ref(false)
const routeResult = ref(null)

async function generateRoute() {
  if (!form.location) {
    ElMessage.warning('请输入出发位置')
    return
  }
  generating.value = true
  // TODO: 调用后端API
  setTimeout(() => {
    routeResult.value = {
      duration: '4小时',
      distance: '5.2公里',
      budget: 180,
      pois: [
        { id: 1, name: '老妈蹄花', category: '川菜', rating: 4.8 },
        { id: 2, name: '宽窄巷子', category: '景点', rating: 4.5 },
        { id: 3, name: '小龙坎火锅', category: '火锅', rating: 4.7 }
      ]
    }
    generating.value = false
  }, 1500)
}

function saveRoute() {
  ElMessage.success('路线已保存')
}
</script>

<style scoped>
.route-view {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
  background: linear-gradient(135deg, #fdf5e6 0%, #f9f1e0 100%);
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

.route-form {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 250, 240, 0.95) 100%);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid rgba(212, 165, 116, 0.3);
  box-shadow: 0 4px 16px rgba(201, 169, 98, 0.1);
}

.route-form h3 {
  margin: 0 0 20px;
  color: var(--color-brown);
  font-size: 18px;
  font-weight: 600;
}

.route-result {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 250, 240, 0.95) 100%);
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(212, 165, 116, 0.3);
  box-shadow: 0 4px 16px rgba(201, 169, 98, 0.1);
}

.route-result h4 {
  margin: 0 0 16px;
  color: var(--color-brown);
  font-size: 16px;
  font-weight: 600;
}

.route-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  color: #666;
  padding: 12px;
  background: rgba(212, 165, 116, 0.1);
  border-radius: 8px;
  border-left: 4px solid var(--color-gold);
}

.poi-list {
  margin-bottom: 20px;
}

.poi-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.15) 0%, rgba(255, 240, 200, 0.1) 100%);
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid rgba(212, 165, 116, 0.2);
  transition: all 0.3s;
}

.poi-item:hover {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.25) 0%, rgba(255, 240, 200, 0.2) 100%);
  transform: translateX(4px);
}

.poi-index {
  width: 28px;
  height: 28px;
  background: var(--color-brown);
  color: var(--color-cream);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.poi-info h5 {
  margin: 0;
  color: var(--color-brown);
  font-weight: 600;
}

.poi-info p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #888;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #888;
  font-size: 14px;
}
</style>
