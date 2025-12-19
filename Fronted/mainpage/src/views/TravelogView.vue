<template>
  <div class="travelog-view">
    <div class="generate-section">
      <h3>📝 AI游记生成</h3>
      <p>选择你的路线或足迹，AI将为你生成一篇有温度的游记</p>
      
      <el-form :model="form" label-position="top">
        <el-form-item label="数据来源">
          <el-radio-group v-model="form.source">
            <el-radio label="route">我的路线</el-radio>
            <el-radio label="footprint">我的足迹</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="写作风格">
          <el-select v-model="form.style" placeholder="选择风格">
            <el-option label="文艺清新" value="literary" />
            <el-option label="幽默风趣" value="humorous" />
            <el-option label="实用攻略" value="practical" />
            <el-option label="小红书风" value="xiaohongshu" />
          </el-select>
        </el-form-item>
        <el-button type="primary" :loading="generating" @click="generate">
          ✨ 一键生成
        </el-button>
      </el-form>
    </div>

    <div class="result-section" v-if="result">
      <div class="result-header">
        <h4>{{ result.title }}</h4>
        <div class="actions">
          <el-button size="small" @click="copy">复制</el-button>
          <el-button size="small" type="primary" @click="save">保存</el-button>
        </div>
      </div>
      <div class="result-content" v-html="result.content"></div>
    </div>

    <div class="my-travelogs">
      <h4>我的游记</h4>
      <div v-if="travelogs.length === 0" class="empty">暂无游记</div>
      <div v-else class="travelog-list">
        <div v-for="item in travelogs" :key="item.id" class="travelog-card">
          <h5>{{ item.title }}</h5>
          <p>{{ item.excerpt }}</p>
          <span class="time">{{ item.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  source: 'route',
  style: 'literary'
})

const generating = ref(false)
const result = ref(null)
const travelogs = ref([])

async function generate() {
  generating.value = true
  setTimeout(() => {
    result.value = {
      title: '成都三日烟火漫游记',
      content: `<p>成都，一座来了就不想走的城市。</p>
        <p>清晨的宽窄巷子还未苏醒，我已经在老妈蹄花门口排起了队...</p>
        <p>这座城市的烟火气，藏在每一碗热腾腾的抄手里，藏在火锅店此起彼伏的笑声中。</p>`
    }
    generating.value = false
  }, 2000)
}

function copy() {
  ElMessage.success('已复制到剪贴板')
}

function save() {
  ElMessage.success('游记已保存')
}
</script>

<style scoped>
.travelog-view {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
}

.generate-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.generate-section h3 {
  margin: 0 0 8px;
  color: var(--color-primary);
}

.generate-section > p {
  color: #888;
  margin-bottom: 20px;
}

.result-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.result-header h4 {
  margin: 0;
  color: var(--color-primary);
}

.result-content {
  line-height: 1.8;
  color: var(--color-brown);
}

.my-travelogs {
  background: white;
  padding: 24px;
  border-radius: 12px;
}

.my-travelogs h4 {
  margin: 0 0 16px;
  color: var(--color-primary);
}

.empty {
  text-align: center;
  padding: 40px;
  color: #888;
}

.travelog-card {
  padding: 16px;
  background: var(--color-cream);
  border-radius: 8px;
  margin-bottom: 12px;
}

.travelog-card h5 {
  margin: 0 0 8px;
  color: var(--color-brown);
}

.travelog-card p {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.travelog-card .time {
  font-size: 12px;
  color: #aaa;
}
</style>
