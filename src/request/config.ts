// GitHub API 配置
export const GITHUB_CONFIG = {
  // GitHub API 基础 URL
  BASE_URL: 'https://api.github.com',
  
  // API 版本
  API_VERSION: 'v3',
  
  // 请求超时时间（毫秒）
  TIMEOUT: 10000,
  
  // 默认请求头
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json'
  }
};

// Token 管理 - 现在通过 store 管理，这里保留兼容性
export const TOKEN_MANAGER = {
  // 存储 Token 的 localStorage key
  STORAGE_KEY: 'github_token',
  
  // 获取 Token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_MANAGER.STORAGE_KEY);
  },
  
  // 设置 Token
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_MANAGER.STORAGE_KEY, token);
  },
  
  // 删除 Token
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_MANAGER.STORAGE_KEY);
  },
  
  // 检查是否有 Token
  hasToken: (): boolean => {
    return !!TOKEN_MANAGER.getToken();
  }
};

// 错误消息
export const ERROR_MESSAGES = {
  NO_TOKEN: '请先设置 GitHub Token',
  INVALID_GIST_ID: '无效的 Gist ID',
  INVALID_FILENAME: '无效的文件名',
  NETWORK_ERROR: '网络错误，请检查网络连接',
  RATE_LIMIT: '请求频率过高，请稍后再试',
  UNAUTHORIZED: '未授权访问，请检查 Token 是否有效',
  NOT_FOUND: '资源未找到',
  VALIDATION_ERROR: '请求参数错误'
}; 