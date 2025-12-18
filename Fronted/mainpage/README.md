# 烟火漫游 - 前端项目

城市烟火气探索平台

## 技术栈

- Vue 3 + Vite
- Element Plus
- TailwindCSS
- Pinia (状态管理)
- Vue Router
- Cesium (3D地图)
- ECharts (图表)
- Axios (HTTP请求)

## 项目结构

```
mainpage/
├── public/              # 静态资源
├── src/
│   ├── api/            # API接口封装
│   ├── components/     # 公共组件
│   ├── router/         # 路由配置
│   ├── stores/         # Pinia状态管理
│   ├── styles/         # 全局样式
│   ├── views/          # 页面组件
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 功能模块

1. **烟火地图** - Cesium 3D地图展示全国烟火气分布
2. **路线规划** - 智能生成探索路线
3. **探索足迹** - 打卡记录与足迹地图
4. **AI游记** - 一键生成游记
5. **社区广场** - 分享与发现
6. **趋势对比** - 夜光与烟火气数据分析

## 后端API

开发时需要启动后端服务，默认代理到 `http://localhost:8000`
