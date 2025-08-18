// =============================================================================
// 版本信息工具函数
// =============================================================================

export interface VersionInfo {
  version: string;
  buildInfo: string;
  hash: string;
  packageVersion: string;
}

/**
 * 获取应用版本信息
 * 从 version.json 和 package.json 获取版本相关数据
 */
export const getVersionInfo = async (): Promise<VersionInfo> => {
  try {
    // 获取构建版本信息
    const versionResponse = await fetch('/version.json');
    const versionData = await versionResponse.json();

    // 获取 package.json 中的版本信息
    const packageResponse = await fetch('/package.json');
    const packageData = await packageResponse.json();

    return {
      version: versionData.version || '未知',
      buildInfo: versionData.buildInfo || '未知',
      hash: versionData.hash || '未知',
      packageVersion: packageData.version || '未知'
    };
  } catch (error) {
    console.warn('获取版本信息失败:', error);
    // 返回默认值
    return {
      version: '未知',
      buildInfo: '未知',
      hash: '未知',
      packageVersion: '未知'
    };
  }
};

/**
 * 格式化构建信息
 * 将时间戳和时区偏移转换为可读的时间格式
 */
export const formatBuildInfo = (buildInfo: string): string => {
  try {
    const parts = buildInfo.split(' ');
    if (parts.length >= 1) {
      const timestamp = parseInt(parts[0]);
      if (!isNaN(timestamp)) {
        const date = new Date(timestamp);
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
    }
    return buildInfo;
  } catch {
    return buildInfo;
  }
};

/**
 * 格式化 Git 哈希值
 * 显示短版本的哈希值
 */
export const formatGitHash = (hash: string): string => {
  if (hash && hash !== '未知' && hash.length > 7) {
    return hash.substring(0, 7);
  }
  return hash;
};