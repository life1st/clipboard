import CryptoJS from 'crypto-js';

/**
 * 生成配置同步的 URL
 * @param host 当前环境的 host
 * @param token GitHub Token
 * @param gistId Gist ID
 * @param salt 4位数字盐字符串
 * @returns 加密后的同步 URL
 */
export const generateSyncUrl = (host: string, token: string, gistId: string, salt: string): string => {
  // 验证盐字符串格式
  if (!/^\d{4}$/.test(salt)) {
    throw new Error('盐字符串必须是4位数字');
  }

  // 创建配置对象
  const config = { token, gistId };
  
  // 使用盐字符串加密配置
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(config), 
    salt
  ).toString();
  
  // 对加密结果进行 URL 编码
  const encoded = encodeURIComponent(encrypted);
  
  return `${host}?config=${encoded}`;
};

/**
 * 从 URL 中解析配置参数
 * @param url URL 字符串
 * @param salt 4位数字盐字符串
 * @returns 解析出的配置对象
 */
export const parseSyncUrl = (url: string, salt: string): { token: string; gistId: string } | null => {
  try {
    const urlObj = new URL(url);
    const encryptedConfig = urlObj.searchParams.get('config');
    
    if (!encryptedConfig) {
      return null;
    }

    // 验证盐字符串格式
    if (!/^\d{4}$/.test(salt)) {
      throw new Error('盐字符串必须是4位数字');
    }

    // URL 解码
    const decoded = decodeURIComponent(encryptedConfig);
    
    // 解密配置
    const decrypted = CryptoJS.AES.decrypt(decoded, salt).toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      throw new Error('解密失败，请检查盐字符串是否正确');
    }

    const config = JSON.parse(decrypted);
    
    if (config.token && config.gistId) {
      return { token: config.token, gistId: config.gistId };
    }
    
    return null;
  } catch (error) {
    console.error('解析同步 URL 失败:', error);
    return null;
  }
};

/**
 * 获取当前环境的 host
 * @returns 当前环境的 host
 */
export const getCurrentHost = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
}; 