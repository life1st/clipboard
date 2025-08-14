import React, { useState } from 'react';
import { useSettingsStore } from '../store';
import { getGist, updateGistFile } from '../request';
import Button from '../components/button';
import Input from '../components/input';
import HistoryManager from '../components/history-manager';
import QRCodeComponent from '../components/qr-code';
import GitHubConfig from '../components/github-config';
import { generateSyncUrl, getCurrentHost } from '../utils/sync-utils';
import { useToastStore } from '../store/toast-store';

const Settings: React.FC = () => {
  // 使用 store 中的状态
  const {
    githubToken,
    gistId,
    autoSync,
    syncInterval,
    setAutoSync,
    setSyncInterval,
    resetSettings
  } = useSettingsStore();
  const { showSuccess, showError } = useToastStore();

  // 本地状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [salt, setSalt] = useState('');
  const [encryptedSyncUrl, setEncryptedSyncUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  // 配置状态变化处理
  const handleConfigChange = (configured: boolean) => {
    setIsConfigured(configured);
  };





  const handleTestGist = async () => {
    if (!isConfigured) {
      showError('请先完成 GitHub 配置');
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
      showError('请先完成 Gist ID 和 Token 配置');
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
      showError('请先完成 GitHub 配置以生成同步链接');
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
          <GitHubConfig onConfigChange={handleConfigChange} />
        </div>

        <div className="settings-section">
          <h3>Gist 操作</h3>
          <p className="gist-info">
            在完成 GitHub 配置后，你可以测试连接和创建剪贴板文件。
          </p>
          
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

        {/* 结果显示 */}
        {result && (
          <div className="settings-section">
            <h3>操作结果</h3>
            <pre className="result-display">{result}</pre>
          </div>
        )}

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
        
        <HistoryManager />

        <div className="settings-section">
          <h3>使用说明</h3>
          <div className="instructions">
            <ol>
              <li>在 GitHub 配置区域输入你的 Token 和 Gist ID</li>
              <li>点击"保存配置并测试连通性"自动验证配置</li>
              <li>配置成功后，可以测试 Gist 连接和创建剪贴板文件</li>
              <li>如需获取 Token，访问 <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">GitHub Token 设置页面</a></li>
              <li>选择 "gist" 权限生成 Token</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 