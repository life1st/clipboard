import React, { useState, useMemo, useEffect } from 'react';
import { useSettingsStore } from '../store';
import { getGist, updateGistFile } from '../request';
import Button from '../components/button';
import HistoryManager from '../components/history-manager';

const Settings: React.FC = () => {
  // 使用 store 中的状态
  const {
    githubToken,
    gistId,
    autoSync,
    syncInterval,
    setToken,
    setGistId,
    removeToken,
    setAutoSync,
    setSyncInterval,
    resetSettings
  } = useSettingsStore();

  // 本地状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setLocalToken] = useState('');
  const [result, setResult] = useState('');
  const [tokenMessage, setTokenMessage] = useState('');

  // 本地计算属性
  const tokenStatus = useMemo(() => {
    if (githubToken) {
      return '✅ Token 已设置';
    }
    return '❌ Token 未设置';
  }, [githubToken]);

  // 计算是否已配置
  const isConfigured = useMemo(() => {
    return !!(githubToken && gistId);
  }, [githubToken, gistId]);

  // 初始化本地状态
  useEffect(() => {
    if (githubToken) {
      setLocalToken(githubToken);
    }
  }, [githubToken]);

  const handleSaveToken = () => {
    if (token.trim()) {
      setToken(token.trim());
      setTokenMessage('✅ Token 已保存');
      setLocalToken(''); // 清空输入框
      // 3秒后清除消息
      setTimeout(() => setTokenMessage(''), 3000);
    } else {
      setTokenMessage('❌ Token 不能为空');
      // 3秒后清除消息
      setTimeout(() => setTokenMessage(''), 3000);
    }
  };

  const handleRemoveToken = () => {
    removeToken();
    setLocalToken('');
  };

  const handleClearToken = () => {
    setLocalToken('');
  };

  const handleTestGist = async () => {
    if (!isConfigured) {
      setResult('请先设置 Gist ID 和 Token');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const gist = await getGist(gistId);
      setResult(`✅ Gist 连接成功！\n${JSON.stringify(gist, null, 2)}`);
    } catch (error: any) {
      const errorMessage = `❌ Gist 连接失败: ${error.message}`;
      setResult(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClipboardFile = async () => {
    if (!isConfigured) {
      setResult('请先设置 Gist ID 和 Token');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      // 创建默认的剪贴板数据结构
      const defaultContent = JSON.stringify({
        items: [],
        lastUpdated: new Date().toISOString()
      }, null, 2);
      
      const updatedGist = await updateGistFile(gistId, 'clipboard.json', defaultContent);
      setResult(`✅ 创建剪贴板文件成功！\n${JSON.stringify(updatedGist, null, 2)}`);
    } catch (error: any) {
      const errorMessage = `❌ 创建剪贴板文件失败: ${error.message}`;
      setResult(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="page-content">
        <div className="page-header">
          <div className="header-content">
            <div className="header-icon">⚙️</div>
            <h1>设置</h1>
            <p>配置应用设置、GitHub Token 和 Gist</p>
          </div>
          <div className="header-decoration"></div>
        </div>
        
        <div className="settings-section">
          <h3>GitHub Token 配置</h3>
          <p className="token-info">
            要使用 GitHub Gist API，你需要设置 Personal Access Token。
            <br />
            <a 
              href="https://github.com/settings/tokens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="token-link"
            >
              点击这里创建 Token
            </a>
          </p>
          
          <div className="input-group">
            <label>GitHub Token:</label>
            <input 
              type="password" 
              value={token} 
              onChange={(e) => setLocalToken(e.target.value)}
              placeholder={githubToken ? 'Token 已设置（输入新值覆盖）' : '输入你的 GitHub Token'}
            />
          </div>
          
          <div className="token-status">
            <span className={`status ${tokenStatus.includes('✅') ? 'success' : 'error'}`}>
              {tokenStatus}
            </span>
            {tokenMessage && (
              <span className={`status ${tokenMessage.includes('✅') ? 'success' : 'error'}`}>
                {tokenMessage}
              </span>
            )}
            {githubToken && (
              <div className="token-info-display">
                <span className="token-preview">
                  Token: {githubToken.substring(0, 8)}...{githubToken.substring(githubToken.length - 4)}
                </span>
              </div>
            )}
          </div>
          
          <div className="button-group">
            <Button 
              variant="primary"
              onClick={handleSaveToken}
              fullWidth
            >
              保存 Token
            </Button>
            
            <Button 
              variant="ghost"
              onClick={handleClearToken}
              fullWidth
            >
              清空输入
            </Button>
            
            <Button 
              variant="danger"
              onClick={handleRemoveToken}
              fullWidth
            >
              删除 Token
            </Button>
          </div>
        </div>

        <div className="settings-section">
          <h3>Gist 配置</h3>
          <p className="gist-info">
            设置你的 GitHub Gist ID，剪贴板数据将同步到这个 Gist 中。
            <br />
            文件名将自动设置为 <code>clipboard.json</code>
          </p>
          
          <div className="input-group">
            <label>Gist ID:</label>
            <input 
              type="text" 
              value={gistId} 
              onChange={(e) => setGistId(e.target.value)}
              placeholder="输入你的 Gist ID"
            />
          </div>
          
          <div className="button-group">
            <Button 
              variant="primary"
              onClick={handleTestGist}
              disabled={loading || !isConfigured}
              loading={loading}
              fullWidth
            >
              测试 Gist 连接
            </Button>
            
            <Button 
              variant="secondary"
              onClick={handleCreateClipboardFile}
              disabled={loading || !isConfigured}
              loading={loading}
              fullWidth
            >
              创建剪贴板文件
            </Button>
          </div>
        </div>

        <div className="settings-section">
          <h3>应用设置</h3>
          <p className="app-info">
            配置应用的自动同步和显示选项
          </p>
          
          <div className="input-group">
            <label>
              <input 
                type="checkbox" 
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
              />
              启用自动同步
            </label>
          </div>
          
          {autoSync && (
            <div className="input-group">
              <label>同步间隔（分钟）:</label>
              <input 
                type="number" 
                value={syncInterval}
                onChange={(e) => setSyncInterval(parseInt(e.target.value) || 5)}
                min="1"
                max="60"
              />
            </div>
          )}
          
          <div className="button-group">
            <Button 
              variant="danger"
              onClick={resetSettings}
              fullWidth
            >
              重置所有设置
            </Button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="settings-section">
            <div className="error-message">
              {error}
            </div>
          </div>
        )}
        
        {/* 结果显示 */}
        {result && (
          <div className="settings-section">
            <h3>操作结果</h3>
            <pre className="result-display">{result}</pre>
          </div>
        )}
        
        <HistoryManager />

        <div className="settings-section">
          <h3>使用说明</h3>
          <div className="instructions">
            <ol>
              <li>访问 <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">GitHub Token 设置页面</a></li>
              <li>点击 "Generate new token (classic)"</li>
              <li>选择 "gist" 权限</li>
              <li>生成并复制 Token</li>
              <li>粘贴到上面的输入框中并保存</li>
              <li>创建一个新的 Gist 或使用现有的 Gist ID</li>
              <li>点击"测试 Gist 连接"验证配置</li>
              <li>点击"创建剪贴板文件"初始化数据结构</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 