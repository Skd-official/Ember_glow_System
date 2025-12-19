// ============================================================================
// React 适配层 - FireworksLanding 组件
// ============================================================================

import React, { useEffect, useRef, useState } from 'react'
import '../styles/fireworks.css'

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

/**
 * React 烟火漫游启动页组件
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
  const [canInteract, setCanInteract] = useState(false)

  // 初始化烟花系统
  useEffect(() => {
    if (window.hideLoadingTip) {
      window.hideLoadingTip()
    }

    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const width = window.innerWidth
    const height = window.innerHeight

    const { ctx } = initCanvasContext(canvas, width, height)
    setCanvasSize(width, height)

    const seq = generateFireworkSequence(width, height, 0)
    const fw = generateFireworks(seq, width, height, 0)
    fireworksRef.current = fw

    startTimeRef.current = performance.now()

    // UI元素依次出现动画
    setTimeout(() => setShowDecoration(true), 1000)
    setTimeout(() => setShowTitle(true), 2500)
    setTimeout(() => setShowSubtitle(true), 4500)
    setTimeout(() => {
      setShowButton(true)
      setCanInteract(true)
    }, 6000)
    setTimeout(() => setShowHint(true), 7500)

    // 高性能动画循环
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current

      updateFireworks(fireworksRef.current, elapsed)
      renderFrame(ctx, width, height, fireworksRef.current, elapsed, false)

      if (isSequenceFinished(fireworksRef.current)) {
        const newSeq = generateFireworkSequence(width, height, 0)
        fireworksRef.current = generateFireworks(newSeq, width, height, 0)
        startTimeRef.current = performance.now()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

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
      <canvas ref={canvasRef} className="fireworks-canvas" />

      <div className="decorative-frame">
        <div className="corner corner-tl" />
        <div className="corner corner-tr" />
        <div className="corner corner-bl" />
        <div className="corner corner-br" />
      </div>

      <div className="content-wrapper">
        <div className="title-section">
          <div className={`title-decoration ${showDecoration ? 'visible' : ''}`}>
            <span className="petal petal-1">✿</span>
            <span className="petal petal-2">❀</span>
            <span className="petal petal-3">✿</span>
          </div>

          <h1 className={`title-main ${showTitle ? 'visible' : ''}`}>
            <span className="title-char char-1">烟</span>
            <span className="title-char char-2">火</span>
            <span className="title-char char-3">漫</span>
            <span className="title-char char-4">游</span>
          </h1>

          <div className={`title-sub ${showSubtitle ? 'visible' : ''}`}>
            <span className="sub-line" />
            <h2 className="title-en">Ember Glow</h2>
            <span className="sub-line" />
          </div>
        </div>

        <div className={`button-section ${showButton ? 'visible' : ''}`}>
          <button
            className={`menu-button ${canInteract ? 'active' : ''}`}
            onClick={handleEnter}
            disabled={!canInteract}
          >
            <span className="button-text">进入系统</span>
          </button>
        </div>

        <div className={`footer-hint ${showHint ? 'visible' : ''}`}>
          {canInteract ? '按 Enter 或点击按钮进入' : '系统加载中...'}
        </div>
      </div>
    </div>
  )
}

export default FireworksLanding

