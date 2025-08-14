interface VersionInfo {
  version: string;
  buildTime: string;
  commitHash: string;
}

let cachedVersion: VersionInfo | null = null;

/**
 * 获取当前应用版本信息
 */
export const getCurrentVersion = async (): Promise<VersionInfo> => {
  if (cachedVersion) {
    return cachedVersion;
  }

  try {
    const response = await fetch('/version.json');
    if (!response.ok) {
      throw new Error('Failed to fetch version info');
    }
    
    const versionData = await response.json();
    cachedVersion = versionData;
    return versionData;
  } catch (error) {
    console.warn('Failed to load version info:', error);
    // 返回默认版本信息
    return {
      version: '0.0.0',
      buildTime: new Date().toISOString(),
      commitHash: 'unknown'
    };
  }
};

/**
 * 检查是否有新版本可用
 */
export const checkForUpdates = async (): Promise<boolean> => {
  try {
    const currentVersion = await getCurrentVersion();
    
    // 添加时间戳防止缓存
    const response = await fetch(`/version.json?t=${Date.now()}`);
    if (!response.ok) {
      return false;
    }
    
    const latestVersion = await response.json();
    
    // 比较版本号
    return latestVersion.version !== currentVersion.version ||
           latestVersion.commitHash !== currentVersion.commitHash;
  } catch (error) {
    console.warn('Failed to check for updates:', error);
    return false;
  }
};

/**
 * 获取版本显示字符串
 */
export const getVersionString = async (): Promise<string> => {
  const version = await getCurrentVersion();
  return `${version.version} (${version.commitHash})`;
};

/**
 * 获取构建时间
 */
export const getBuildTime = async (): Promise<string> => {
  const version = await getCurrentVersion();
  return new Date(version.buildTime).toLocaleString();
}; 