<!-- 导航项模板 - 支持图标图片 -->
<template>
<div class="nav-item"
     v-for="item in navItems" 
     :key="item.id"
     :class="{ active: appStore.currentFeature === item.id }"
     @click="navigateTo(item)"
     :title="item.label">
  <!-- 图标显示：支持 emoji 和 img -->
  <div class="nav-icon-wrapper">
    <img v-if="isImageIcon(item.icon)" 
         :src="item.icon" 
         :alt="item.label" 
         class="nav-icon-img">
    <span v-else class="nav-icon">{{ item.icon }}</span>
  </div>
  
  <!-- 标签 -->
  <span class="nav-label">{{ item.label }}</span>
</div>
</template>

<style scoped>
/* 导航项 - 竖向列表 */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border-right: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-right-color: var(--color-gold);
  transform: translateX(-3px);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.15);
  border-right-color: var(--color-gold);
}

/* 图标包装器 */
.nav-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.3s, transform 0.3s;
}

/* Emoji 图标 */
.nav-icon {
  font-size: 24px;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
}

/* 图片图标 */
.nav-icon-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.15));
  transition: filter 0.3s, transform 0.3s;
}

.nav-item:hover .nav-icon-wrapper {
  filter: drop-shadow(0 2px 6px rgba(139, 41, 66, 0.3));
  transform: scale(1.15);
}

.nav-item.active .nav-icon-wrapper {
  filter: drop-shadow(0 2px 8px rgba(201, 169, 98, 0.4));
}

/* 标签 */
.nav-label {
  font-family: var(--font-heading);
  font-size: 11px;
  color: var(--color-cream);
  text-align: center;
  opacity: 0.9;
  transition: opacity 0.3s;
  line-height: 1.2;
  max-width: 50px;
  word-break: break-word;
}

.nav-item:hover .nav-label {
  opacity: 1;
}
</style>

<!-- JavaScript 辅助函数 - 在 script setup 中添加 -->
<script setup>
// 判断是否为图片图标
const isImageIcon = (icon) => {
  return typeof icon === 'string' && (
    icon.endsWith('.png') || 
    icon.endsWith('.jpg') || 
    icon.endsWith('.webp') ||
    icon.includes('/') // 包含路径
  )
}
</script>

