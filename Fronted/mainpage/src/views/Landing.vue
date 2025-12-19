<template>
  <div class="landing-container">
    <!-- 烟花 Canvas -->
    <canvas ref="canvasRef" class="fireworks-canvas" />

    <!-- 装饰性边框 -->
    <div class="decorative-frame">
      <div class="corner corner-tl" />
      <div class="corner corner-tr" />
      <div class="corner corner-bl" />
      <div class="corner corner-br" />
    </div>

    <!-- 主内容区域 -->
    <div class="content-wrapper">
      <!-- 标题区域 -->
      <div class="title-section">
        <!-- 装饰性樱花/花瓣 -->
        <div :class="['title-decoration', { visible: showDecoration }]">
          <span class="petal petal-1">✿</span>
          <span class="petal petal-2">❀</span>
          <span class="petal petal-3">✿</span>
        </div>

        <!-- 主标题 -->
        <h1 :class="['title-main', { visible: showTitle }]">
          <span class="title-char char-1">烟</span>
          <span class="title-char char-2">火</span>
          <span class="title-char char-3">漫</span>
          <span class="title-char char-4">游</span>
        </h1>

        <!-- 英文副标题 -->
        <div :class="['title-sub', { visible: showSubtitle }]">
          <span class="sub-line" />
          <h2 class="title-en">Ember Glow</h2>
          <span class="sub-line" />
        </div>
      </div>

      <!-- 按钮区域 - 只有"进入系统"按钮 -->
      <div :class="['button-section', { visible: showButton }]">
        <button
          :class="['menu-button', { active: canInteract }]"
          @click="handleEnter"
          :disabled="!canInteract"
        >
          <span class="button-text">进入系统</span>
        </button>
      </div>

      <!-- 底部提示 -->
      <div :class="['footer-hint', { visible: showHint }]">
        按 Enter 或点击按钮进入
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  generateFireworkSequence,
  generateFireworks,
  updateFireworks,
  isSequenceFinished,
  setCanvasSize,
  renderFrame,
  initCanvasContext
} from '@ember-glow/fireworks/core'

const router = useRouter()
const canvasRef = ref(null)
const showDecoration = ref(false)
const showTitle = ref(false)
const showSubtitle = ref(false)
const showButton = ref(false)
const showHint = ref(false)
const canInteract = ref(false)

let animationFrameId = null
let canvasCtx = null
let particles = []
let fireworksRef = []
let startTimeRef = 0

function handleEnter() {
  if (!canInteract.value) return
  canInteract.value = false
  showDecoration.value = false
  showTitle.value = false
  showSubtitle.value = false
  showButton.value = false
  showHint.value = false
  setTimeout(() => {
    router.push('/main/map')
  }, 300)
}

function handleKeyDown(e) {
  if (e.key === 'Enter' && canInteract.value) {
    handleEnter()
  }
}

function handleResize() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function handleClick(e) {
  if (canInteract.value && !e.target.closest('button')) {
    // 可以在这里添加鼠标烟花效果
  }
}

onMounted(() => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const width = window.innerWidth
  const height = window.innerHeight

  const { ctx } = initCanvasContext(canvas, width, height)
  setCanvasSize(width, height)

  const seq = generateFireworkSequence(width, height, 0)
  const fw = generateFireworks(seq, width, height, 0)
  fireworksRef = fw
  startTimeRef = performance.now()

  // UI动画时间表
  setTimeout(() => {
    showDecoration.value = true
  }, 1000)
  setTimeout(() => {
    showTitle.value = true
  }, 2500)
  setTimeout(() => {
    showSubtitle.value = true
  }, 4500)
  setTimeout(() => {
    showButton.value = true
    canInteract.value = true
  }, 6000)
  setTimeout(() => {
    showHint.value = true
  }, 7500)

  // 高性能动画循环
  const animate = (currentTime) => {
    const elapsed = currentTime - startTimeRef

    updateFireworks(fireworksRef, elapsed)
    renderFrame(ctx, width, height, fireworksRef, elapsed, false)

    if (isSequenceFinished(fireworksRef)) {
      const newSeq = generateFireworkSequence(width, height, 0)
      fireworksRef = generateFireworks(newSeq, width, height, 0)
      startTimeRef = performance.now()
    }

    animationFrameId = requestAnimationFrame(animate)
  }

  animationFrameId = requestAnimationFrame(animate)

  window.addEventListener('click', handleClick)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClick)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('resize', handleResize)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
/* 样式由 main.js 全局加载 */
</style>

