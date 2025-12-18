<template>
  <div class="community-view">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="精选游记" name="travelogs">
        <div class="card-grid">
          <div v-for="item in travelogs" :key="item.id" class="travelog-card">
            <div class="card-cover" :style="{ background: item.color }"></div>
            <div class="card-content">
              <h4>{{ item.title }}</h4>
              <p>{{ item.excerpt }}</p>
              <div class="card-footer">
                <span class="author">{{ item.author }}</span>
                <span class="likes">❤️ {{ item.likes }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="热门路线" name="routes">
        <div class="route-list">
          <div v-for="item in routes" :key="item.id" class="route-card">
            <div class="route-header">
              <h4>{{ item.name }}</h4>
              <el-tag size="small">{{ item.city }}</el-tag>
            </div>
            <p>{{ item.description }}</p>
            <div class="route-meta">
              <span>🕐 {{ item.duration }}</span>
              <span>📍 {{ item.spots }}个点位</span>
              <span>👁️ {{ item.views }}</span>
            </div>
            <el-button size="small" @click="copyRoute(item)">复制路线</el-button>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="隐藏宝藏" name="discoveries">
        <div class="discovery-list">
          <div v-for="item in discoveries" :key="item.id" class="discovery-card">
            <h4>{{ item.name }}</h4>
            <p>{{ item.description }}</p>
            <div class="discovery-footer">
              <span>📍 {{ item.location }}</span>
              <el-button size="small" text @click="vote(item)">
                👍 {{ item.votes }}
              </el-button>
            </div>
          </div>
        </div>
        <el-button type="primary" class="submit-btn" @click="showSubmit = true">
          + 提交新发现
        </el-button>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="showSubmit" title="提交隐藏宝藏" width="400px">
      <el-form :model="submitForm">
        <el-form-item label="名称">
          <el-input v-model="submitForm.name" />
        </el-form-item>
        <el-form-item label="位置">
          <el-input v-model="submitForm.location" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="submitForm.description" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showSubmit = false">取消</el-button>
        <el-button type="primary" @click="submitDiscovery">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('travelogs')
const showSubmit = ref(false)

const travelogs = ref([
  { id: 1, title: '成都三日烟火记', excerpt: '一座来了就不想走的城市...', author: '小明', likes: 128, color: '#FFE4C4' },
  { id: 2, title: '武汉过早指南', excerpt: '热干面、豆皮、面窝...', author: '吃货小王', likes: 256, color: '#E6E6FA' },
  { id: 3, title: '长沙夜生活', excerpt: '解放西路的夜晚永远不会结束', author: '夜猫子', likes: 89, color: '#F0FFF0' }
])

const routes = ref([
  { id: 1, name: '成都美食一日游', city: '成都', description: '从早到晚吃遍成都', duration: '8小时', spots: 6, views: 1234 },
  { id: 2, name: '武汉过早路线', city: '武汉', description: '体验最地道的武汉早餐', duration: '3小时', spots: 4, views: 890 }
])

const discoveries = ref([
  { id: 1, name: '巷子深处的老茶馆', location: '成都市青羊区', description: '藏在小巷里的百年老茶馆', votes: 45 },
  { id: 2, name: '凌晨三点的烧烤摊', location: '长沙市天心区', description: '本地人才知道的深夜美食', votes: 78 }
])

const submitForm = reactive({
  name: '',
  location: '',
  description: ''
})

function copyRoute(item) {
  ElMessage.success(`已复制路线：${item.name}`)
}

function vote(item) {
  item.votes++
  ElMessage.success('投票成功')
}

function submitDiscovery() {
  ElMessage.success('提交成功，等待社区验证')
  showSubmit.value = false
}
</script>

<style scoped>
.community-view {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.travelog-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
}
.travelog-card:hover {
  transform: translateY(-4px);
}

.card-cover {
  height: 120px;
}

.card-content {
  padding: 16px;
}

.card-content h4 {
  margin: 0 0 8px;
  color: var(--color-brown);
}

.card-content p {
  margin: 0 0 12px;
  font-size: 13px;
  color: #666;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}

.route-list, .discovery-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.route-card, .discovery-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
}

.route-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.route-header h4, .discovery-card h4 {
  margin: 0;
  color: var(--color-brown);
}

.route-card p, .discovery-card p {
  margin: 0 0 12px;
  font-size: 13px;
  color: #666;
}

.route-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #888;
  margin-bottom: 12px;
}

.discovery-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #888;
}

.submit-btn {
  margin-top: 20px;
}
</style>
