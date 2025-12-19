// ============================================================================
// @ember-glow/fireworks 主入口
// 支持 React, Vue 和框架无关的核心
// ============================================================================

// 核心导出
export * from './core'

// 样式
import './styles/fireworks.css'

// 框架特定的导出需要在各自的子包中
// 使用时：
// - React: import { FireworksLanding } from '@ember-glow/fireworks/react'
// - Vue: import { FireworksLanding } from '@ember-glow/fireworks/vue'
// - Core: import { ... } from '@ember-glow/fireworks/core' 或 '@ember-glow/fireworks'

