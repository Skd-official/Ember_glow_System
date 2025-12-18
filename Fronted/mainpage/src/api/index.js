import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      ElMessage.error('登录已过期，请重新登录')
    } else {
      ElMessage.error(error.response?.data?.message || '请求失败')
    }
    return Promise.reject(error)
  }
)

// API 接口
export const userApi = {
  login: (data) => api.post('/users/login', data),
  register: (data) => api.post('/users/register', data),
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data)
}

export const vitalityApi = {
  getDistricts: () => api.get('/districts'),
  getGrids: (params) => api.get('/vitality/grids', { params }),
  getHeatmap: (params) => api.get('/vitality/heatmap', { params }),
  getRanking: (params) => api.get('/vitality/ranking', { params })
}

export const poiApi = {
  getList: (params) => api.get('/pois', { params }),
  getDetail: (id) => api.get(`/pois/${id}`)
}

export const routeApi = {
  generate: (data) => api.post('/routes/generate', data),
  getList: () => api.get('/routes'),
  getDetail: (id) => api.get(`/routes/${id}`),
  save: (data) => api.post('/routes', data),
  update: (id, data) => api.put(`/routes/${id}`, data),
  delete: (id) => api.delete(`/routes/${id}`)
}

export const footprintApi = {
  create: (data) => api.post('/footprints', data),
  getList: () => api.get('/footprints'),
  getStats: () => api.get('/footprints/stats'),
  delete: (id) => api.delete(`/footprints/${id}`)
}

export const travelogApi = {
  generate: (data) => api.post('/travelogs/generate', data),
  getList: () => api.get('/travelogs'),
  save: (data) => api.post('/travelogs', data),
  update: (id, data) => api.put(`/travelogs/${id}`, data),
  delete: (id) => api.delete(`/travelogs/${id}`)
}

export default api
