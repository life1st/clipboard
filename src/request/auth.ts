import { useSettingsStore } from '../store';

/**
 * 获取 GitHub Token 并设置到请求配置中
 * @param config - 请求配置
 * @returns 更新后的请求配置
 */
export const getAuthHeaders = async () => {
  try {
    const token = useSettingsStore.getState().githubToken;
    
    if (token) {
      return {
        'Authorization': `token ${token}`
      };
    }
    
    return {};
  } catch (error) {
    console.warn('Failed to get auth token:', error);
    return {};
  }
};

/**
 * 检查是否有可用的 GitHub Token
 * @returns 是否有 token
 */
export const hasAuthToken = async (): Promise<boolean> => {
  try {
    const token = useSettingsStore.getState().githubToken;
    return !!token;
  } catch (error) {
    console.warn('Failed to check auth token:', error);
    return false;
  }
}; 