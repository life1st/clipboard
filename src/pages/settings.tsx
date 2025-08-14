import React, { useState, useMemo, useEffect } from 'react';
import { useSettingsStore } from '../store';
import { getGist, updateGistFile } from '../request';
import Button from '../components/button';
import Input from '../components/input';
import HistoryManager from '../components/history-manager';
import QRCodeComponent from '../components/qr-code';
import { generateSyncUrl, getCurrentHost } from '../utils/sync-utils';
import { useToastStore } from '../store/toast-store';

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
  const { showSuccess, showError } = useToastStore();

  // 本地状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setLocalToken] = useState('');
  const [result, setResult] = useState('');
  const [salt, setSalt] = useState('');
  const [encryptedSyncUrl, setEncryptedSyncUrl] = useState('');

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
      showSuccess('Token 已保存');
      setLocalToken(''); // 清空输入框
    } else {
      showError('Token 不能为空');
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
      showError('请先设置 Gist ID 和 Token');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const gist = await getGist(gistId);
      showSuccess('Gist 连接成功！');
      setResult(`Gist 连接成功！\n${JSON.stringify(gist, null, 2)}`);
    } catch (error: any) {
      const errorMessage = `Gist 连接失败: ${error.message}`;
      showError(errorMessage);
      setResult(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClipboardFile = async () => {
    if (!isConfigured) {
      showError('请先设置 Gist ID 和 Token');
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
      showSuccess('创建剪贴板文件成功！');
      setResult(`创建剪贴板文件成功！\n${JSON.stringify(updatedGist, null, 2)}`);
    } catch (error: any) {
      const errorMessage = `创建剪贴板文件失败: ${error.message}`;
      showError(errorMessage);
      setResult(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };



  const handleGenerateEncryptedUrl = () => {
    if (!isConfigured) {
      showError('请先完成配置以生成同步链接');
      return;
    }

    if (!salt.trim()) {
      showError('请输入4位数字盐字符串');
      return;
    }

    if (!/^\d{4}$/.test(salt.trim())) {
      showError('盐字符串必须是4位数字');
      return;
    }

    try {
      const host = getCurrentHost();
      const encryptedUrl = generateSyncUrl(host, githubToken, gistId, salt.trim());
      setEncryptedSyncUrl(encryptedUrl);
      showSuccess('同步链接已生成');
    } catch (error: any) {
      showError(`生成同步链接失败: ${error.message}`);
    }
  };

  const handleCopyEncryptedUrl = async () => {
    if (!encryptedSyncUrl) {
      showError('请先生成同步链接');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(encryptedSyncUrl);
      showSuccess('同步链接已复制到剪贴板');
    } catch (error) {
      showError('复制失败，请手动复制链接');
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
            <label htmlFor="github-token">GitHub Token:</label>
            <div className="input-with-button">
              <Input 
                type="password" 
                name="github-token"
                value={token} 
                onChange={(e) => setLocalToken(e.target.value)}
                placeholder={githubToken ? 'Token 已设置（输入新值覆盖）' : '输入你的 GitHub Token'}
                size="sm"
              />
              <Button 
                variant="ghost"
                onClick={handleClearToken}
                size="sm"
              >
                清空
              </Button>
            </div>
          </div>
          
          <div className="token-status">
            <span className={`status ${tokenStatus.includes('✅') ? 'success' : 'error'}`}>
              {tokenStatus}
            </span>
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
            <Input 
              type="text" 
              name="gist-id"
              value={gistId} 
              onChange={(e) => setGistId(e.target.value)}
              placeholder="输入你的 Gist ID"
              size="md"
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
              <Input 
                type="number" 
                value={syncInterval}
                onChange={(e) => setSyncInterval(parseInt(e.target.value) || 5)}
                min={1}
                max={60}
                size="md"
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



        <div className="settings-section qr-code-section">
          <h3>配置同步</h3>
          <div className="qr-code-info">
            <p>
              输入4位数字盐字符串，生成加密的同步链接，提高配置安全性。
              <br />
              使用手机扫描二维码，可以快速同步当前配置到其他设备。
              <br />
              接收方需要知道相同的盐字符串才能解密配置。
            </p>
          </div>
          
          {isConfigured ? (
            <>
              <div className="input-group">
                <label>盐字符串（4位数字）:</label>
                <Input 
                  type="text" 
                  value={salt} 
                  onChange={(e) => setSalt(e.target.value)}
                  placeholder="输入4位数字，如：1234"
                  maxLength={4}
                  pattern="[0-9]{4}"
                  size="md"
                />
              </div>
              
              <div className="qr-code-actions">
                <Button 
                  variant="secondary"
                  onClick={handleGenerateEncryptedUrl}
                  fullWidth
                >
                  生成同步链接
                </Button>
              </div>
              
              {encryptedSyncUrl && (
                <>
                  <h4>📱 扫码同步配置</h4>
                  <QRCodeComponent 
                    value={encryptedSyncUrl} 
                    size={240}
                    className="sync-qr-code"
                  />
                  
                  <div className="sync-url-display">
                    <strong>同步链接：</strong>
                    <br />
                    {encryptedSyncUrl}
                  </div>
                  
                  <div className="qr-code-actions">
                    <Button 
                      variant="primary"
                      onClick={handleCopyEncryptedUrl}
                      fullWidth
                    >
                      复制同步链接
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="qr-code-placeholder">
              <div className="placeholder-content">
                <span>请先完成 GitHub Token 和 Gist ID 配置</span>
              </div>
            </div>
          )}
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