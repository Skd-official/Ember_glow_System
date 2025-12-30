<template>
  <div class="community-view">
    <div class="view-header">
      <img :src="communityIcon" :alt="title" class="header-icon">
      <h3>{{ title }}</h3>
    </div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="精选游记" name="travelogs">
        <div class="publish-bar">
          <el-button type="primary" @click="showPublishTravelog = true">
            ✍️ 发布游记
          </el-button>
        </div>
        <div class="card-grid">
          <div v-for="item in travelogs" :key="item.id" class="travelog-card">
            <div class="card-cover" :style="{ background: item.color }"></div>
            <div class="card-content">
              <h4>{{ item.title }}</h4>
              <p>{{ item.excerpt }}</p>
              <div class="card-footer">
                <span class="author">{{ item.author }}</span>
                <span
                  class="likes"
                  :class="{ liked: item.isLiked }"
                  @click.stop="toggleLike(item)"
                >
                  ❤️ {{ item.likes }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="热门路线" name="routes">
        <div class="publish-bar">
          <el-button type="primary" @click="showPublishRoute = true">
            🗺️ 分享路线
          </el-button>
        </div>
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
            <div class="route-actions">
              <el-button size="small" @click="copyRoute(item)">复制路线</el-button>
              <el-button
                size="small"
                text
                :class="{ liked: item.isLiked }"
                @click="toggleRouteLike(item)"
              >
                {{ item.isLiked ? '❤️ 取消点赞' : '🤍 点赞' }} ({{ item.likes }})
              </el-button>
            </div>
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

    <!-- 发布游记对话框 -->
    <el-dialog v-model="showPublishTravelog" title="发布游记" width="500px">
      <el-form :model="travelogForm">
        <el-form-item label="游记标题">
          <el-input v-model="travelogForm.title" placeholder="请输入游记标题" />
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="travelogForm.city" placeholder="如：成都、武汉" />
        </el-form-item>
        <el-form-item label="游记内容">
          <el-input v-model="travelogForm.content" type="textarea" rows="4" placeholder="分享你的旅行故事..." />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="travelogForm.tags" placeholder="如：美食、景点、住宿（用逗号分隔）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPublishTravelog = false">取消</el-button>
        <el-button type="primary" @click="publishTravelog">发布</el-button>
      </template>
    </el-dialog>

    <!-- 分享路线对话框 -->
    <el-dialog v-model="showPublishRoute" title="分享路线" width="500px">
      <el-form :model="routeForm">
        <el-form-item label="路线名称">
          <el-input v-model="routeForm.name" placeholder="请输入路线名称" />
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="routeForm.city" placeholder="如：成都、武汉" />
        </el-form-item>
        <el-form-item label="路线描述">
          <el-input v-model="routeForm.description" type="textarea" rows="3" placeholder="描述你的路线" />
        </el-form-item>
        <el-form-item label="预计耗时">
          <el-input v-model="routeForm.duration" placeholder="如：8小时" />
        </el-form-item>
        <el-form-item label="点位数量">
          <el-input v-model="routeForm.spots" type="number" placeholder="共几个点位" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPublishRoute = false">取消</el-button>
        <el-button type="primary" @click="publishRoute">分享</el-button>
      </template>
    </el-dialog>

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
import communityIcon from '@/assets/icons/community.png'

const title = '社区广场'
const activeTab = ref('travelogs')
const showSubmit = ref(false)
const showPublishTravelog = ref(false)
const showPublishRoute = ref(false)

const travelogs = ref([
  { id: 1, title: '成都三日烟火记', excerpt: '一座来了就不想走的城市...', author: '小明', likes: 128, color: '#FFE4C4', isLiked: false },
  { id: 2, title: '武汉过早指南', excerpt: '热干面、豆皮、面窝...', author: '吃货小王', likes: 256, color: '#E6E6FA', isLiked: false },
  { id: 3, title: '长沙夜生活', excerpt: '解放西路的夜晚永远不会结束', author: '夜猫子', likes: 89, color: '#F0FFF0', isLiked: false }
])

const routes = ref([
  { id: 1, name: '成都美食一日游', city: '成都', description: '从早到晚吃遍成都', duration: '8小时', spots: 6, views: 1234, likes: 45, isLiked: false },
  { id: 2, name: '武汉过早路线', city: '武汉', description: '体验最地道的武汉早餐', duration: '3小时', spots: 4, views: 890, likes: 32, isLiked: false }
])

const discoveries = ref([
  { id: 1, name: '巷子深处的老茶馆', location: '成都市青羊区', description: '藏在小巷里的百年老茶馆', votes: 45 },
  { id: 2, name: '凌晨三点的烧烤摊', location: '长沙市天心区', description: '本地人才知道的深夜美食', votes: 78 }
])

const travelogForm = reactive({
  title: '',
  content: '',
  city: '',
  tags: ''
})

const routeForm = reactive({
  name: '',
  description: '',
  city: '',
  duration: '',
  spots: ''
})

const submitForm = reactive({
  name: '',
  location: '',
  description: ''
})

function copyRoute(item) {
  ElMessage.success(`已复制路线：${item.name}`)
}

function toggleLike(item) {
  if (item.isLiked) {
    item.likes--
    item.isLiked = false
    ElMessage.success('已取消点赞')
  } else {
    item.likes++
    item.isLiked = true
    ElMessage.success('点赞成功')
  }
}

function toggleRouteLike(item) {
  if (item.isLiked) {
    item.likes--
    item.isLiked = false
    ElMessage.success('已取消点赞')
  } else {
    item.likes++
    item.isLiked = true
    ElMessage.success('点赞成功')
  }
}

function vote(item) {
  item.votes++
  ElMessage.success('投票成功')
}

function publishTravelog() {
  if (!travelogForm.title || !travelogForm.content || !travelogForm.city) {
    ElMessage.error('请填写游记信息')
    return
  }
  const newTravelog = {
    id: travelogs.value.length + 1,
    title: travelogForm.title,
    excerpt: travelogForm.content.substring(0, 50) + '...',
    author: '我',
    likes: 0,
    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    isLiked: false
  }
  travelogs.value.unshift(newTravelog)
  ElMessage.success('游记发布成功！')
  showPublishTravelog.value = false
  travelogForm.title = ''
  travelogForm.content = ''
  travelogForm.city = ''
  travelogForm.tags = ''
}

function publishRoute() {
  if (!routeForm.name || !routeForm.description || !routeForm.city) {
    ElMessage.error('请填写路线信息')
    return
  }
  const newRoute = {
    id: routes.value.length + 1,
    name: routeForm.name,
    city: routeForm.city,
    description: routeForm.description,
    duration: routeForm.duration || '待定',
    spots: routeForm.spots || 0,
    views: 0,
    likes: 0,
    isLiked: false
  }
  routes.value.unshift(newRoute)
  ElMessage.success('路线分享成功！')
  showPublishRoute.value = false
  routeForm.name = ''
  routeForm.description = ''
  routeForm.city = ''
  routeForm.duration = ''
  routeForm.spots = ''
}

function submitDiscovery() {
  if (!submitForm.name || !submitForm.location || !submitForm.description) {
    ElMessage.error('请填写完整信息')
    return
  }
  const newDiscovery = {
    id: discoveries.value.length + 1,
    name: submitForm.name,
    location: submitForm.location,
    description: submitForm.description,
    votes: 0
  }
  discoveries.value.unshift(newDiscovery)
  ElMessage.success('提交成功，等待社区验证')
  showSubmit.value = false
  submitForm.name = ''
  submitForm.location = ''
  submitForm.description = ''
}
</script>

<style scoped>
.community-view {
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

.publish-bar {
  margin-bottom: 20px;
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

.likes {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.likes:hover {
  background: rgba(255, 182, 193, 0.2);
  color: #d4237a;
}

.likes.liked {
  color: #d4237a;
  background: rgba(255, 182, 193, 0.3);
  font-weight: bold;
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

.route-actions {
  display: flex;
  gap: 8px;
  justify-content: space-between;
}

.route-actions .el-button.liked {
  color: #d4237a;
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
