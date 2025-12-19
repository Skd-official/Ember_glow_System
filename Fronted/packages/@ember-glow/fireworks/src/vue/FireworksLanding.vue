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

      <!-- 按钮区域 -->
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
        {{ canInteract ? '按 Enter 或点击按钮进入' : '系统加载中...' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  generateFireworkSequence,
  generateFireworks,
  updateFireworks,
  isSequenceFinished,
  setCanvasSize,
  renderFrame,
  initCanvasContext,
  type Firework
} from '../core'
import '../styles/fireworks.css'

interface Props {
  onEnter?: () => void
}

const props = defineProps<Props>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const animationFrameRef = ref<number>()
const startTimeRef = ref<number>(0)
const fireworksRef = ref<Firework[]>([])

const showDecoration = ref(false)
const showTitle = ref(false)
const showSubtitle = ref(false)
const showButton = ref(false)
const showHint = ref(false)
const canInteract = ref(false)

const handleEnter = () => {
  if (!canInteract.value) return
  if (props.onEnter) {
    props.onEnter()
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.key === 'Enter' || e.key === ' ') && canInteract.value) {
    handleEnter()
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
  fireworksRef.value = fw

  startTimeRef.value = performance.now()

  // UI元素依次出现动画
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
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTimeRef.value

    updateFireworks(fireworksRef.value, elapsed)
    renderFrame(ctx, width, height, fireworksRef.value, elapsed, false)

    if (isSequenceFinished(fireworksRef.value)) {
      const newSeq = generateFireworkSequence(width, height, 0)
      fireworksRef.value = generateFireworks(newSeq, width, height, 0)
      startTimeRef.value = performance.now()
    }

    animationFrameRef.value = requestAnimationFrame(animate)
  }

  animationFrameRef.value = requestAnimationFrame(animate)

  const handleResize = () => {
    if (!canvas) return
    const newWidth = window.innerWidth
    const newHeight = window.innerHeight
    initCanvasContext(canvas, newWidth, newHeight)
  }

  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeyDown)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('keydown', handleKeyDown)
    if (animationFrameRef.value) {
      cancelAnimationFrame(animationFrameRef.value)
    }
  })
})
</script>

<style scoped>
@import '../styles/fireworks.css';
</style>

