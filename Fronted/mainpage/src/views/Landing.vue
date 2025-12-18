<template>
  <section class="landing">
    <div class="texture-overlay"></div>
    
    <!-- 四角装饰 -->
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <!-- 左侧内容 -->
    <div class="landing-content">
      <p class="slogan-en">SUCH IS THE JOY OF OUR REUNION</p>
      <h1 class="brand-name">Rhodes Island</h1>

      <div class="title-block">
        <div class="coin-icon"></div>
        <h2 class="main-title">
          <span v-for="(char, i) in '烟火漫游'" :key="i" class="char">{{ char }}</span>
        </h2>
        <div class="coin-icon"></div>
      </div>

      <div class="subtitle-banner">
        <span>城市烟火气探索平台</span>
      </div>

      <el-button type="primary" size="large" class="enter-btn" @click="enterMain">
        开始探索
        <el-icon class="ml-2"><ArrowRight /></el-icon>
      </el-button>
    </div>

    <!-- 右侧装饰 -->
    <div class="landing-illustration">
      <div class="circle-bg"></div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()

function enterMain() {
  router.push('/main/map')
}
</script>

<style scoped>
.landing {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 100px;
  background: linear-gradient(135deg, #FAF3E8 0%, #FFF5E6 100%);
  position: relative;
  overflow: hidden;
}

.texture-overlay {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 2px,
    rgba(139, 41, 66, 0.02) 2px,
    rgba(139, 41, 66, 0.02) 4px
  );
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 3px solid var(--color-primary);
}
.corner-tl { top: 30px; left: 30px; border-right: none; border-bottom: none; }
.corner-tr { top: 30px; right: 30px; border-left: none; border-bottom: none; }
.corner-bl { bottom: 30px; left: 30px; border-right: none; border-top: none; }
.corner-br { bottom: 30px; right: 30px; border-left: none; border-top: none; }

.landing-content {
  flex: 1;
  max-width: 600px;
}

.slogan-en {
  font-size: 14px;
  letter-spacing: 4px;
  color: var(--color-secondary);
  margin-bottom: 10px;
}

.brand-name {
  font-size: 24px;
  color: var(--color-primary);
  margin-bottom: 40px;
  font-weight: 400;
}

.title-block {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.coin-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-secondary);
  border: 3px solid var(--color-primary);
}

.main-title {
  font-size: 72px;
  font-weight: 700;
  color: var(--color-primary);
  display: flex;
  gap: 8px;
}

.char {
  display: inline-block;
  transition: transform 0.3s;
}
.char:hover {
  transform: translateY(-5px);
}

.subtitle-banner {
  background: var(--color-primary);
  color: white;
  padding: 12px 30px;
  display: inline-block;
  font-size: 18px;
  margin-bottom: 50px;
  clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
}

.enter-btn {
  background: var(--color-primary);
  border-color: var(--color-primary);
  font-size: 18px;
  padding: 24px 48px;
  border-radius: 0;
}
.enter-btn:hover {
  background: #a03350;
  border-color: #a03350;
}

.landing-illustration {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle-bg {
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--color-cream) 0%, var(--color-secondary) 100%);
  opacity: 0.6;
}

@media (max-width: 768px) {
  .landing {
    flex-direction: column;
    padding: 40px 20px;
    text-align: center;
  }
  .main-title { font-size: 48px; }
  .landing-illustration { display: none; }
}
</style>
