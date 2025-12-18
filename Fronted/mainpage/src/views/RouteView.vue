<template>
  <div class="route-view">
    <div class="route-form">
      <h3>🛤️ 智能路线规划</h3>
      <el-form :model="form" label-position="top">
        <el-form-item label="出发位置">
          <el-input v-model="form.location" placeholder="点击地图选择或输入地址" />
        </el-form-item>
        <el-form-item label="游玩时长">
          <el-radio-group v-model="form.duration">
            <el-radio-button label="2h">2小时</el-radio-button>
            <el-radio-button label="half">半天</el-radio-button>
            <el-radio-button label="full">一天</el-radio-button>
          </el-radio-group>
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

const form = reactive({
  location: '',
  duration: 'half',
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
}

.route-form {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.route-form h3 {
  margin: 0 0 20px;
  color: var(--color-primary);
}

.route-result {
  background: white;
  padding: 24px;
  border-radius: 12px;
}

.route-result h4 {
  margin: 0 0 16px;
  color: var(--color-primary);
}

.route-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  color: #666;
}

.poi-list {
  margin-bottom: 20px;
}

.poi-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-cream);
  border-radius: 8px;
  margin-bottom: 8px;
}

.poi-index {
  width: 28px;
  height: 28px;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.poi-info h5 {
  margin: 0;
  color: var(--color-brown);
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
}
</style>
