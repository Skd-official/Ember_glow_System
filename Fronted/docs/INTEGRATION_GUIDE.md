## 🤖 烟火漫游启动页 - 队友集成指南

> 这份文档专为要集成该组件的开发者和AI助手设计

---

## 📦 核心文件清单

### 必要文件（10个）

```
src/
├── components/FireworksLanding/
│   ├── index.tsx              ⬆️ 必要
│   └── styles.css             ⬆️ 必要
├── utils/
│   ├── fireworksEngine.ts             ⬆️ 必要
│   ├── fireworksSequence.ts           ⬆️ 必要
│   ├── canvasRenderer.ts              ⬆️ 必要
│   ├── textParticleGenerator.ts       ⬆️ 必要
│   ├── holidaySystem.ts               ⬆️ 必要
│   ├── lunarCalendar.ts               ⬆️ 必要
│   └── textFireworks.ts               ⬆️ 必要
└── types.ts                           ⬆️ 必要（合并更新）
```

---

## 📋 集成步骤

### 第1步：文件复制

1. **复制组件目录**
   ```bash
   cp -r src/components/FireworksLanding your-project/src/components/
   ```

2. **复制工具文件**
   ```bash
   cp src/utils/fireworksEngine.ts your-project/src/utils/
   cp src/utils/fireworksSequence.ts your-project/src/utils/
   cp src/utils/canvasRenderer.ts your-project/src/utils/
   cp src/utils/textParticleGenerator.ts your-project/src/utils/
   cp src/utils/holidaySystem.ts your-project/src/utils/
   cp src/utils/lunarCalendar.ts your-project/src/utils/
   cp src/utils/textFireworks.ts your-project/src/utils/
   ```

3. **更新 types.ts**
   - 打开你项目的 `src/types.ts`
   - 添加以下类型定义（如果还没有）：
   ```typescript
   export type FireworkType = 'bloom' | 'ring' | 'chrysanthemum' | 'willow' | 'peony' | 'text'
   export interface TrailPoint { x: number; y: number; opacity: number }
   export interface Particle { ... }  // 参考原文件
   export interface Firework { ... }  // 参考原文件
   export interface FireworkSequence { ... }  // 参考原文件
   export interface Holiday { ... }  // 参考原文件
   ```

### 第2步：依赖检查

确保 `package.json` 包含：
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

**无需新增依赖**，组件仅使用 React 和 Canvas API

### 第3步：路径别名配置

确保你的项目支持 `@` 别名（指向 `src/`）

**Vite 配置** (`vite.config.ts`)：
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**TypeScript 配置** (`tsconfig.json`)：
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 第4步：全局样式配置

在 `src/index.css` 或 `src/main.css` 中添加：
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}
```

### 第5步：在应用中使用

在你的 `App.tsx` 或主入口文件中：

```typescript
import FireworksLanding from '@/components/FireworksLanding'

export default function App() {
  const handleEnter = () => {
    // 用户点击"进入系统"时的回调
    console.log('用户进入系统')
    // 可以跳转到主应用或关闭启动页
  }

  return (
    <>
      <FireworksLanding onEnter={handleEnter} />
      {/* 你的主应用内容 */}
    </>
  )
}
```

---

## 🧪 验证集成

启动开发服务器后，检查：

- [ ] 页面能正常加载
- [ ] 烟花能正常显示和爆炸
- [ ] UI 元素依次出现
- [ ] 按钮可以点击
- [ ] 控制台无 TypeScript 错误
- [ ] 帧率稳定（FPS ~60）

---

## ⚙️ 可选自定义

### 修改文字库
编辑 `src/utils/textFireworks.ts` 的 `FIREWORK_TEXTS` 数组：
```typescript
export const FIREWORK_TEXTS: string[] = [
  '你的自定义文字1',
  '你的自定义文字2',
  // ...
]
```

### 修改节日祝福
编辑 `src/utils/lunarCalendar.ts` 中各节日的 `wishes` 数组

### 修改烟花显示概率
编辑 `src/utils/fireworksSequence.ts` 第34行：
```typescript
// 改变 0.8（节日概率）和 0.3（平时概率）
const showText = holiday ? Math.random() < 0.8 : Math.random() < 0.3
```

### 修改烟花数量
编辑 `src/utils/fireworksSequence.ts` 第30行：
```typescript
const totalFireworks = 16 + Math.floor(Math.random() * 6)  // 16-21朵
```

---

## 🚨 常见问题排查

### Canvas 不显示
- 检查 `index.tsx` 中 canvas 元素是否正确初始化
- 确保 CSS 中 `.fireworks-canvas` 的 z-index 正确

### 文字不显示
- 检查 `textFireworks.ts` 中 `FIREWORK_TEXTS` 是否有内容
- 检查显示概率（平时30%，节日80%）
- 查看浏览器控制台是否有错误

### 节日不被识别
- 检查系统时间是否正确
- 验证 `lunarCalendar.ts` 中农历日期映射
- 在控制台测试 `detectHoliday()`

### 性能不佳
- 检查 GPU 是否被充分利用
- 监测粒子数量
- 尝试降低画质或减少烟花数量

---

## 📝 给 AI 助手的集成指令

以下内容直接复制给你的 AI 助手执行：

---

### 🤖 **AI 集成指令**（直接给AI）

你好！我需要你帮我集成一个烟花启动页组件到我现有的 React 项目中。请按照以下步骤精确执行：

#### 第一步：文件导入
我已上传了以下文件到 GitHub（或本地）。请复制到相应目录：

**目录结构：**
```
我的项目/src/
├── components/FireworksLanding/
│   ├── index.tsx
│   └── styles.css
├── utils/
│   ├── fireworksEngine.ts
│   ├── fireworksSequence.ts
│   ├── canvasRenderer.ts
│   ├── textParticleGenerator.ts
│   ├── holidaySystem.ts
│   ├── lunarCalendar.ts
│   └── textFireworks.ts
└── types.ts (需要合并更新)
```

#### 第二步：检查依赖
确保 `package.json` 中有：
- `react` >= 18.0.0
- `typescript` >= 5.0.0

**无需新增依赖**

#### 第三步：配置别名
在 `vite.config.ts` 中确保有 `@` 别名指向 `src/`，在 `tsconfig.json` 中也要配置

#### 第四步：全局 CSS
在 `src/index.css` 中添加基础重置样式

#### 第五步：导入使用
在 `App.tsx` 中：
```typescript
import FireworksLanding from '@/components/FireworksLanding'

export default function App() {
  return <FireworksLanding onEnter={() => console.log('进入')} />
}
```

#### 第六步：验证
- 启动 `npm run dev`
- 检查浏览器控制台无错误
- 验证烟花显示正常

完成！如有任何错误，查看控制台信息。

---

## 📞 需要帮助？

- **问题**: 组件导入失败
  **解决**: 检查路径别名配置和文件位置

- **问题**: 样式不正常
  **解决**: 确保 CSS 被正确加载，检查全局 CSS 设置

- **问题**: 烟花不显示
  **解决**: 打开控制台检查错误，确保 Canvas API 支持

- **问题**: 时间卡顿
  **解决**: 降低粒子数量或减少烟花数

---

**集成难度**: ⭐⭐ 简单  
**预计时间**: 15-20 分钟  
**支持度**: 完全独立组件，不会与现有代码冲突

