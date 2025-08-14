import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../store';
import { useToastStore } from '../store/toast-store';
import { getGist } from '../request/gist';
import Button from './button';
import Input from './input';

interface GitHubConfigProps {
  onConfigChange?: (configured: boolean) => void;
}

const GitHubConfig: React.FC<GitHubConfigProps> = ({ onConfigChange }) => {
  const {
    githubToken,
    gistId,
    setToken,
    setGistId,
    removeToken
  } = useSettingsStore();
  
  const { showSuccess, showError } = useToastStore();
  
  // 本地状态
  const [localToken, setLocalToken] = useState('');
  const [localGistId, setLocalGistId] = useState('');
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  
  // 计算是否已配置
  const isConfigured = !!(githubToken && gistId);
  
  // 初始化本地状态
  useEffect(() => {
    if (githubToken) {
      setLocalToken(githubToken);
    }
    if (gistId) {
      setLocalGistId(gistId);
    }
  }, [githubToken, gistId]);
  
  // 通知父组件配置状态变化
  useEffect(() => {
    onConfigChange?.(isConfigured);
  }, [isConfigured, onConfigChange]);
  
  // 测试连通性
  const testConnection = async (token: string, gistId: string) => {
    setTesting(true);
    try {
      // 临时设置 token 进行测试
      const originalToken = githubToken;
      setToken(token);
      
      // 测试 Gist 连接
      await getGist(gistId);
      
      // 恢复原始 token
      if (originalToken !== token) {
        setToken(originalToken);
      }
      
      return true;
    } catch (error: any) {
      const errorMessage = `连接测试失败: ${error.message}`;
      showError(errorMessage);
      return false;
    } finally {
      setTesting(false);
    }
  };
  
  // 保存配置
  const handleSaveConfig = async () => {
    if (!localToken.trim()) {
      showError('Token 不能为空');
      return;
    }
    
    if (!localGistId.trim()) {
      showError('Gist ID 不能为空');
      return;
    }
    
    setLoading(true);
    
    try {
      // 先测试连通性
      const isConnected = await testConnection(localToken.trim(), localGistId.trim());
      
      if (isConnected) {
        // 保存配置
        setToken(localToken.trim());
        setGistId(localGistId.trim());
        showSuccess('配置保存成功，连通性测试通过！');
      }
    } catch (error: any) {
      showError(`保存配置失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 清除配置
  const handleClearConfig = () => {
    setLocalToken('');
    setLocalGistId('');
  };
  
  // 删除配置
  const handleRemoveConfig = () => {
    removeToken();
    setGistId('');
    setLocalToken('');
    setLocalGistId('');
    showSuccess('配置已删除');
  };
  
  // 仅测试连通性
  const handleTestOnly = async () => {
    if (!localToken.trim() || !localGistId.trim()) {
      showError('请先输入 Token 和 Gist ID');
      return;
    }
    
    await testConnection(localToken.trim(), localGistId.trim());
  };
  
  return (
    <div className="github-config">
      <div className="config-header">
        <h3>GitHub 配置</h3>
        <p className="config-description">
          配置 GitHub Token 和 Gist ID 以启用数据同步功能
        </p>
      </div>
      
      <div className="config-form">
        <div className="input-group">
          <label htmlFor="github-token">GitHub Token:</label>
          <Input 
            type="password" 
            name="github-token"
            value={localToken} 
            onChange={(e) => setLocalToken(e.target.value)}
            placeholder={githubToken ? 'Token 已设置（输入新值覆盖）' : '输入你的 GitHub Token'}
            size="md"
          />
          <div className="input-help">
            <a 
              href="https://github.com/settings/tokens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="help-link"
            >
              如何获取 Token？
            </a>
          </div>
        </div>
        
        <div className="input-group">
          <label htmlFor="gist-id">Gist ID:</label>
          <Input 
            type="text" 
            name="gist-id"
            value={localGistId} 
            onChange={(e) => setLocalGistId(e.target.value)}
            placeholder={gistId ? 'Gist ID 已设置（输入新值覆盖）' : '输入你的 Gist ID'}
            size="md"
          />
          <div className="input-help">
            <span className="help-text">
              文件名将自动设置为 <code>clipboard.json</code>
            </span>
          </div>
        </div>
        
        <div className="config-status">
          <span className={`status ${isConfigured ? 'success' : 'warning'}`}>
            {isConfigured ? '✅ 配置已完成' : '⚠️ 配置未完成'}
          </span>
          {isConfigured && (
            <div className="config-preview">
              <span className="token-preview">
                Token: {githubToken.substring(0, 8)}...{githubToken.substring(githubToken.length - 4)}
              </span>
              <span className="gist-preview">
                Gist: {gistId}
              </span>
            </div>
          )}
        </div>
        
        <div className="config-actions">
          <div className="primary-actions">
            <Button 
              variant="primary"
              onClick={handleSaveConfig}
              loading={loading}
              disabled={!localToken.trim() || !localGistId.trim()}
              fullWidth
            >
              {loading ? '保存并测试中...' : '保存配置并测试连通性'}
            </Button>
            
            <Button 
              variant="secondary"
              onClick={handleTestOnly}
              loading={testing}
              disabled={!localToken.trim() || !localGistId.trim()}
              fullWidth
            >
              {testing ? '测试中...' : '仅测试连通性'}
            </Button>
          </div>
          
          <div className="secondary-actions">
            <Button 
              variant="ghost"
              onClick={handleClearConfig}
              disabled={!localToken.trim() && !localGistId.trim()}
              size="sm"
            >
              清空输入
            </Button>
            
            {isConfigured && (
              <Button 
                variant="danger"
                onClick={handleRemoveConfig}
                size="sm"
              >
                删除配置
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubConfig; 