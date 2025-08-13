import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { GITHUB_CONFIG } from './config';
import { useSettingsStore } from '../store';

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: GITHUB_CONFIG.BASE_URL,
  timeout: GITHUB_CONFIG.TIMEOUT,
  headers: {
    ...GITHUB_CONFIG.DEFAULT_HEADERS
  }
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 如果有 GitHub Token，添加到请求头
    const token = useSettingsStore.getState().githubToken;
    if (token) {
      config.headers.set('Authorization', `token ${token}`);
    }
    
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data);
    
    // 处理常见的 HTTP 错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('未授权访问，请检查 GitHub Token');
          break;
        case 403:
          console.error('访问被拒绝，可能是权限不足');
          break;
        case 404:
          console.error('资源未找到');
          break;
        case 422:
          console.error('请求参数错误');
          break;
        case 429:
          console.error('请求频率过高，请稍后再试');
          break;
        default:
          console.error(`HTTP 错误: ${error.response.status}`);
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance; 