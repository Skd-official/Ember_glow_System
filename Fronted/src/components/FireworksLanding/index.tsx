// ============================================================================
// 烟火漫游启动页 - 东方夜雀食堂风格
// ============================================================================

import React, { useEffect, useRef, useState } from 'react'
import './styles.css'

import { generateFireworkSequence, generateFireworks, updateFireworks, isSequenceFinished, setCanvasSize } from '@/utils/fireworksSequence'
import { renderFrame, initCanvasContext } from '@/utils/canvasRenderer'
import type { Firework } from '@/types'

/**
 * 烟火漫游启动页
 * 东方夜雀食堂风格设计
 */
export const FireworksLanding: React.FC<{
  onEnter?: () => void
}> = ({ onEnter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()
  const startTimeRef = useRef<number>(0)
  const fireworksRef = useRef<Firework[]>([])

  // UI元素依次出现的状态
  const [showDecoration, setShowDecoration] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [showHint, setShowHint] = useState(false)
  // 按钮出现即可交互
  const [canInteract, setCanInteract] = useState(false)
  // 加载提示是否显示（烟花开始后隐藏）
  const [showLoading, setShowLoading] = useState(true)

  // 初始化烟花系统
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const width = window.innerWidth
    const height = window.innerHeight

    const { ctx } = initCanvasContext(canvas, width, height)

    // 设置画布尺寸供文字烟花使用
    setCanvasSize(width, height)

    // 生成烟花序列
    const seq = generateFireworkSequence(width, height, 0)
    const fw = generateFireworks(seq, width, height, 0)
    fireworksRef.current = fw

    startTimeRef.current = performance.now()

    // 烟花开始后立即隐藏加载提示
    setTimeout(() => setShowLoading(false), 500)      // 0.5秒后隐藏加载提示
    
    // UI元素依次出现动画（总计约8秒）
    setTimeout(() => setShowDecoration(true), 1000)   // 1秒后：花瓣装饰
    setTimeout(() => setShowTitle(true), 2500)        // 2.5秒后：主标题
    setTimeout(() => setShowSubtitle(true), 4500)     // 4.5秒后：英文副标题
    setTimeout(() => {
      setShowButton(true)
      setCanInteract(true)  // 按钮出现即可交互
    }, 6000)                                          // 6秒后：按钮（立即可点击）
    setTimeout(() => setShowHint(true), 7500)         // 7.5秒后：底部提示

    // 高性能动画循环
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current

      // 更新烟花物理状态
      updateFireworks(fireworksRef.current, elapsed)

      // 渲染帧
      renderFrame(ctx, width, height, fireworksRef.current, elapsed, false)

      // 检查是否结束，结束后重新生成新序列（循环播放）
      if (isSequenceFinished(fireworksRef.current)) {
        const newSeq = generateFireworkSequence(width, height, 0)
        fireworksRef.current = generateFireworks(newSeq, width, height, 0)
        startTimeRef.current = performance.now()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    // 窗口大小变化处理
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      initCanvasContext(canvas, newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // 处理进入
  const handleEnter = () => {
    if (!canInteract) return

    if (onEnter) {
      onEnter()
    } else if (containerRef.current) {
      containerRef.current.style.transition = 'opacity 0.8s ease'
      containerRef.current.style.opacity = '0'
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.display = 'none'
        }
      }, 800)
    }
  }

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && canInteract) {
        handleEnter()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canInteract])

  return (
    <div ref={containerRef} className="landing-container">
      {/* 烟花 Canvas */}
      <canvas ref={canvasRef} className="fireworks-canvas" />

      {/* 装饰性边框 */}
      <div className="decorative-frame">
        <div className="corner corner-tl" />
        <div className="corner corner-tr" />
        <div className="corner corner-bl" />
        <div className="corner corner-br" />
      </div>

      {/* 主内容区域 */}
      <div className="content-wrapper">
        {/* 标题区域 */}
        <div className="title-section">
          {/* 装饰性樱花/花瓣 */}
          <div className={`title-decoration ${showDecoration ? 'visible' : ''}`}>
            <span className="petal petal-1">✿</span>
            <span className="petal petal-2">❀</span>
            <span className="petal petal-3">✿</span>
          </div>

          {/* 主标题 */}
          <h1 className={`title-main ${showTitle ? 'visible' : ''}`}>
            <span className="title-char char-1">烟</span>
            <span className="title-char char-2">火</span>
            <span className="title-char char-3">漫</span>
            <span className="title-char char-4">游</span>
          </h1>

          {/* 英文副标题 */}
          <div className={`title-sub ${showSubtitle ? 'visible' : ''}`}>
            <span className="sub-line" />
            <h2 className="title-en">Ember Glow</h2>
            <span className="sub-line" />
          </div>
        </div>

        {/* 按钮区域 - 只有一个进入系统按钮 */}
        <div className={`button-section ${showButton ? 'visible' : ''}`}>
          <button
            className={`menu-button ${canInteract ? 'active' : ''}`}
            onClick={handleEnter}
            disabled={!canInteract}
          >
            <span className="button-text">进入系统</span>
          </button>
        </div>

        {/* 底部提示 - 加载完成后显示操作提示，加载中显示加载文字 */}
        {showLoading ? (
          <div className="footer-hint visible loading-hint">
            系统加载中...
          </div>
        ) : (
          <div className={`footer-hint ${showHint ? 'visible' : ''}`}>
            按 Enter 或点击按钮进入
          </div>
        )}
      </div>
    </div>
  )
}

export default FireworksLanding

