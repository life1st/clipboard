import axiosInstance from './axios';
import { Gist, UpdateGistRequest, ApiError } from './types';
import { getAuthHeaders } from './auth';

/**
 * 获取指定的 Gist
 * @param gistId - Gist ID
 * @returns Promise<Gist>
 */
export const getGist = async (gistId: string): Promise<Gist> => {
  try {
    // 获取认证 headers
    const authHeaders = await getAuthHeaders();
    
    // 发送请求，如果有 token 会自动包含在 headers 中
    const response = await axiosInstance.get<Gist>(`/gists/${gistId}`, {
      headers: authHeaders
    });
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || '获取 Gist 失败',
      status: error.response?.status || 0,
      statusText: error.response?.statusText || 'Unknown Error'
    };
    throw apiError;
  }
};

/**
 * 更新指定的 Gist
 * @param gistId - Gist ID
 * @param updateData - 更新数据
 * @returns Promise<Gist>
 */
export const updateGist = async (gistId: string, updateData: UpdateGistRequest): Promise<Gist> => {
  try {
    // 获取认证 headers
    const authHeaders = await getAuthHeaders();
    
    // 发送请求，如果有 token 会自动包含在 headers 中
    const response = await axiosInstance.patch<Gist>(`/gists/${gistId}`, updateData, {
      headers: authHeaders
    });
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || '更新 Gist 失败',
      status: error.response?.status || 0,
      statusText: error.response?.statusText || 'Unknown Error'
    };
    throw apiError;
  }
};

/**
 * 获取 Gist 的特定文件内容
 * @param gistId - Gist ID
 * @param filename - 文件名
 * @returns Promise<string>
 */
export const getGistFileContent = async (gistId: string, filename: string): Promise<string> => {
  try {
    const gist = await getGist(gistId);
    const file = gist.files[filename];
    
    if (!file) {
      throw new Error(`文件 ${filename} 不存在`);
    }
    
    return file.content;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.message || '获取文件内容失败',
      status: 0,
      statusText: 'File Not Found'
    };
    throw apiError;
  }
};

/**
 * 更新 Gist 的特定文件
 * @param gistId - Gist ID
 * @param filename - 文件名
 * @param content - 文件内容
 * @param description - Gist 描述（可选）
 * @returns Promise<Gist>
 */
export const updateGistFile = async (
  gistId: string, 
  filename: string, 
  content: string, 
  description?: string
): Promise<Gist> => {
  const updateData: UpdateGistRequest = {
    files: {
      [filename]: {
        content: content
      }
    }
  };
  
  if (description) {
    updateData.description = description;
  }
  
  // 直接调用 updateGist，它会自动处理认证
  return updateGist(gistId, updateData);
};

/**
 * 删除 Gist 中的特定文件
 * @param gistId - Gist ID
 * @param filename - 文件名
 * @returns Promise<Gist>
 */
export const deleteGistFile = async (gistId: string, filename: string): Promise<Gist> => {
  const updateData: UpdateGistRequest = {
    files: {
      [filename]: null // 设置为 null 表示删除文件
    }
  };
  
  return updateGist(gistId, updateData);
}; 