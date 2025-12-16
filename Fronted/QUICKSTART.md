# ⚡ 快速开始指南 (5 分钟上手)

> **你在这里**：项目已全部生成，现在可以立即开始！

---

## 🎯 第一步：本地验证 (2min)

```bash
# 1. 打开命令行，进入项目目录
cd Y:\烟火漫游\Ember_glow_System\Fronted

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

**预期结果**：
- 终端显示 `VITE v5.x.x ready in XXXms`
- 浏览器自动打开 `http://localhost:3000`
- 看到深夜背景 + 烟花绽放 + 文字标题 + 按钮

---

## 🎨 第二步：测试各功能 (2min)

### 测试烟花效果
- ✅ 每次刷新烟花不同（随机种子）
- ✅ 烟花持续约 18-20 秒
- ✅ 粒子有重力效果，逐渐漂落

### 测试标题动画
- ✅ 中文标题《烟火漫游》在 3 秒时出现
- ✅ 英文标题《Ember Glow》在 5 秒时出现
- ✅ 按钮《进入系统》在 8 秒时出现

### 测试按钮交互
- ✅ 20秒后按钮可点击（之前是禁用状态）
- ✅ 悬停时按钮放大 + 光晕增强
- ✅ 点击后显示提示信息

### 测试节假日（如果时间合适）
- 检查当前日期
- 如果是节假日，会看到不同的烟花颜色
- 会显示对应的节日祝福文字

### 测试文字烟花
- 30% 概率显示文字烟花
- 多次刷新可能看到不同的文字
- 文字在烟花爆炸消散后显示

---

## 🔧 第三步：自定义配置 (1min)

### 修改文字内容

编辑 `src/utils/textFireworks.ts`，找到这一段：

```typescript
export const FIREWORK_TEXTS: string[] = [
  '烟火漫游',
  '城市烟火',
  '诗意生活',
  // ← 在这里添加你的文字
]
```

**保存后自动刷新**（Vite HMR）

### 修改样式

编辑 `src/components/FireworksLanding/styles.css`

**示例**：修改中文标题颜色

```css
.title-zh {
  color: #FDB927;  /* 改成你想要的颜色，如 #FF0000 是红色 */
}
```

---

## 📦 第四步：交付给队友 (0min)

### 要复制的核心文件

```bash
# 用你的项目复制这些文件到队友的项目

# 1. 组件目录
src/components/FireworksLanding/

# 2. 工具函数
src/utils/fireworksEngine.ts
src/utils/fireworksSequence.ts
src/utils/holidaySystem.ts
src/utils/textFireworks.ts
src/utils/canvasRenderer.ts

# 3. 类型定义
src/types.ts
```

### 队友项目中的使用方法

```tsx
// 在队友的路由文件中 (例如 pages/index.tsx)

import React from 'react'
import { useNavigate } from 'react-router-dom'
import FireworksLanding from '@/components/FireworksLanding'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <FireworksLanding
      onEnter={() => navigate('/home')}
      autoCloseTime={25000}
    />
  )
}
```

**就这么简单！** 🎉

---

## 🎯 核心命令速查

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 类型检查
npm run type-check
```

---

## 📁 项目文件说明

| 文件 | 用途 |
|------|------|
| `src/components/FireworksLanding/index.tsx` | 主 React 组件 |
| `src/components/FireworksLanding/styles.css` | 样式（东方风格） |
| `src/utils/fireworksEngine.ts` | 烟花粒子系统 |
| `src/utils/fireworksSequence.ts` | 烟花序列管理 |
| `src/utils/holidaySystem.ts` | 节假日检测 |
| `src/utils/textFireworks.ts` | 文字配置 |
| `src/utils/canvasRenderer.ts` | Canvas 渲染 |
| `src/types.ts` | TypeScript 类型 |
| `README.md` | 详细文档 |
| `COMPLETION_SUMMARY.md` | 完成总结 |

---

## 🚨 常见问题快速解答

**Q: 烟花不动？**  
A: 确保浏览器 Canvas 支持（Chrome/Firefox/Safari 都行）

**Q: 文字看不清？**  
A: 系统需要安装"方正楷体"或"仿宋"字体。可在 CSS 中改成系统字体。

**Q: 怎么跳过启动页？**  
A: 按下 `ESC` 或 `Enter` 键，或直接点击按钮

**Q: 粒子太多卡顿？**  
A: 编辑 `src/utils/fireworksEngine.ts`，降低 `particleCount` 参数

---

## ✨ 下一步

1. ✅ **本地测试** → 确保效果满意
2. ✅ **微调样式** → 根据需要修改颜色、大小
3. ✅ **添加文字** → 在 `textFireworks.ts` 中自定义
4. ✅ **交付代码** → 复制文件给队友
5. ✅ **集成路由** → 队友集成到其项目中

---

## 🎆 最终效果

运行后你会看到：

1. **深夜天空**：极简黑色渐变背景 + 星辰点缀
2. **烟花绽放**：6 种不同效果的烟花随机发射（15-20秒）
3. **标题出现**：
   - 《烟火漫游》- 古典仿宋体，金黄色，有光晕
   - 《Ember Glow》- 优雅衬线体，橙色，半透明
4. **按钮呈现**：
   - 《进入系统》- 黄→橙渐变，黑边框，仿古风格
   - 悬停时放大 + 光晕增强
5. **交互反馈**：点击后跳转或关闭

---

## 🎉 准备好了吗？

```bash
npm install && npm run dev
```

**开始享受赛博烟花的魔法吧！** 🚀✨

---

*任何问题都可以查看 README.md 或源代码注释！*

