## 烟火漫游烟花启动页 - 集成指南

### 📦 需要上传到GitHub的核心文件

#### 1. **复制以下目录结构到你的项目**

```
你的项目根目录/
├── src/
│   ├── components/
│   │   └── FireworksLanding/
│   │       ├── index.tsx          # 主要组件
│   │       └── styles.css         # 样式表
│   │
│   ├── utils/
│   │   ├── fireworksEngine.ts     # 烟花物理引擎（必要）
│   │   ├── fireworksSequence.ts   # 烟花序列控制（必要）
│   │   ├── canvasRenderer.ts      # Canvas渲染器（必要）
│   │   ├── textParticleGenerator.ts # 文字粒子生成（必要）
│   │   ├── holidaySystem.ts       # 节日系统（必要）
│   │   ├── lunarCalendar.ts       # 农历转换（必要）
│   │   └── textFireworks.ts       # 文字库管理（必要）
│   │
│   ├── types.ts                   # 类型定义（必要）
│   └── DEBUG_GUIDE.md             # 调试指南（参考）
```

#### 2. **不需要上传的文件**

- `package.json` / `package-lock.json` - 保持你的现有配置
- `vite.config.ts` - 保持你的现有配置
- `tsconfig.json` - 保持你的现有配置
- `README.md` / `WORK_SUMMARY.md` - 仅供参考，不影响功能

#### 3. **文件清单**（共11个）

必要文件（10个）：
1. `components/FireworksLanding/index.tsx`
2. `components/FireworksLanding/styles.css`
3. `utils/fireworksEngine.ts`
4. `utils/fireworksSequence.ts`
5. `utils/canvasRenderer.ts`
6. `utils/textParticleGenerator.ts`
7. `utils/holidaySystem.ts`
8. `utils/lunarCalendar.ts`
9. `utils/textFireworks.ts`
10. `types.ts`

参考文件（1个）：
11. `DEBUG_GUIDE.md` - 放在项目根目录

---

### 🤖 发送给AI助手的集成指令

以下是你发送给你的AI协作助手的完整集成指令（复制粘贴）：

---

## 📝 AI集成指令（发给你的AI助手）

你好！我需要你帮我集成一个烟花启动页组件到现有的React项目中。请按照以下步骤进行：

### 第一步：文件导入

我已经上传了以下文件到GitHub（分别复制到相应目录）：

**复制到 `src/utils/` 目录的文件：**
- `fireworksEngine.ts` - 烟花物理引擎
- `fireworksSequence.ts` - 烟花序列控制（需要导入 textParticleGenerator）
- `canvasRenderer.ts` - Canvas渲染器
- `textParticleGenerator.ts` - 文字粒子生成器
- `holidaySystem.ts` - 节日系统（需要导入 lunarCalendar）
- `lunarCalendar.ts` - 农历转换算法
- `textFireworks.ts` - 文字库管理

**复制到 `src/components/FireworksLanding/` 目录的文件：**
- `index.tsx` - React组件主文件
- `styles.css` - CSS样式表

**更新 `src/types.ts` 文件：**
- 确保包含以下接口定义（可能需要合并到现有的types.ts）：
  ```typescript
  export type FireworkType = 'bloom' | 'ring' | 'chrysanthemum' | 'willow' | 'peony' | 'text'
  export interface TrailPoint { x: number; y: number; opacity: number }
  export interface Particle { ... }  // 参考原文件
  export interface Firework { ... }  // 参考原文件
  export interface FireworkSequence { ... }  // 参考原文件
  export interface Holiday { ... }  // 参考原文件
  ```

### 第二步：依赖检查

检查 `package.json` 中是否包含以下依赖（应该已有）：
- `react` (18+)
- `typescript`
- `vite` (构建工具)

**无需新增依赖**，该组件仅使用React和Canvas API。

### 第三步：路径别名配置

确保你的 `vite.config.ts` 或 `tsconfig.json` 中配置了 `@` 别名：

```typescript
// vite.config.ts
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

如果已经配置过，则无需改动。

### 第四步：在你的主应用中使用

在你的 `App.tsx` 或主路由文件中导入使用：

```typescript
import FireworksLanding from '@/components/FireworksLanding'

export default function App() {
  return (
    <>
      {/* 烟花启动页 */}
      <FireworksLanding onEnter={() => {
        // 用户点击"进入系统"时的回调
        // 可以关闭启动页，跳转到主应用
        console.log('用户进入系统')
      }} />
      
      {/* 你的其他应用内容 */}
      {/* <YourMainApp /> */}
    </>
  )
}
```

### 第五步：样式全局配置

确保 `index.css` 或全局样式中有以下基础设置：

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

### 第六步：集成测试

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **验证功能**
   - ✅ 烟花是否能正常上升和爆炸
   - ✅ 粒子轨迹线条是否显示（应该看到火花线，不是糖豆）
   - ✅ UI元素是否依次出现
   - ✅ 按钮是否可以点击（出现即可点击，无灰色等待）

3. **检查控制台**
   - 确保没有TypeScript错误
   - 确保没有运行时错误

### 第七步：调试与定制

如需调整效果，参考 `DEBUG_GUIDE.md`：

- **改变烟花间隔**: 修改 `fireworksSequence.ts` 中的时间常数
- **改变文字内容**: 修改 `textFireworks.ts` 中的 `FIREWORK_TEXTS` 数组
- **改变节日检测**: 修改 `lunarCalendar.ts` 中的农历节日配置
- **改变烟花配色**: 修改 `holidaySystem.ts` 中的颜色定义

### 第八步：生产部署

构建前端应用：
```bash
npm run build
```

确保：
- ✅ 无TypeScript错误
- ✅ Canvas兼容性检查（支持modern browsers）
- ✅ 移动端响应式测试

### 常见问题排查

**Q: Canvas不显示？**
A: 检查 `index.tsx` 中 `initCanvasContext()` 是否正确初始化，确保canvas元素在DOM中

**Q: 文字烟花不显示？**
A: 检查 `textFireworks.ts` 中 `FIREWORK_TEXTS` 数组是否有内容，确保显示概率 > 0

**Q: 节日不被识别？**
A: 检查当前系统日期，使用 `DEBUG_GUIDE.md` 中的方法手动传入日期测试

**Q: 性能不佳（FPS低）？**
A: 检查粒子数量（`fireworksEngine.ts` 中的 `particleCount`），适当降低可提升性能

---

### 可选定制

根据需求，你可以：

1. **添加音效**：在 `index.tsx` 的 `handleEnter()` 回调中加入音效播放
2. **自定义文字库**：直接编辑 `textFireworks.ts` 中的 `FIREWORK_TEXTS`
3. **添加节日祝福**：在 `lunarCalendar.ts` 中修改 `wishes` 数组
4. **改变UI风格**：修改 `styles.css` 中的颜色和字体
5. **支持国际化**：将祝福文字移到i18n配置中

---

就这样！这个组件是完全独立的，不会与你现有的代码冲突。祝集成顺利！

---

### 集成完成检查清单

完成以下检查，确认集成成功：

- [ ] 所有10个文件已复制到正确位置
- [ ] TypeScript编译通过（无红色错误）
- [ ] 开发服务器能正常启动
- [ ] 烟花能正常显示和爆炸
- [ ] UI元素依次出现动画
- [ ] 按钮可以点击
- [ ] 没有控制台错误
- [ ] 节日系统正常工作（可选验证）
- [ ] 文字烟花正常显示（可选验证）
- [ ] 移动端响应式正常

祝集成顺利！有任何问题，参考 `DEBUG_GUIDE.md`。

---

**文件列表（共10个核心文件）：**
```
1. components/FireworksLanding/index.tsx
2. components/FireworksLanding/styles.css
3. utils/fireworksEngine.ts
4. utils/fireworksSequence.ts
5. utils/canvasRenderer.ts
6. utils/textParticleGenerator.ts
7. utils/holidaySystem.ts
8. utils/lunarCalendar.ts
9. utils/textFireworks.ts
10. types.ts （需要合并更新）
```

