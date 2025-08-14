import React, { useState } from 'react';
import Modal from './modal';
import Button from './button';
import { parseSyncUrl } from '../utils/sync-utils';
import { useSettingsStore } from '../store';
import { useToastStore } from '../store/toast-store';
import { useClipboardStore } from '../store/clipboard-store';

interface DecryptConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  configUrl: string;
}

interface DecryptedConfig {
  token: string;
  gistId: string;
}

const DecryptConfigModal: React.FC<DecryptConfigModalProps> = ({
  isOpen,
  onClose,
  configUrl
}) => {
  const [salt, setSalt] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [decryptedConfig, setDecryptedConfig] = useState<DecryptedConfig | null>(null);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const { setToken, setGistId } = useSettingsStore();
  const { showSuccess, showError } = useToastStore();
  const { loadFromGist, loading } = useClipboardStore();

  const handleDecrypt = async () => {
    if (!salt.trim()) {
      setError('请输入盐字符串');
      return;
    }

    if (!/^\d{4}$/.test(salt.trim())) {
      setError('盐字符串必须是4位数字');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const config = parseSyncUrl(configUrl, salt.trim());
      
      if (!config) {
        setError('解密失败，请检查盐字符串是否正确');
        return;
      }

      // 立即应用配置到 store
      setToken(config.token);
      setGistId(config.gistId);
      
      // 保存解密结果用于展示
      setDecryptedConfig(config);
      setIsDecrypted(true);
      
      // 立即同步 Gist 数据
      try {
        await loadFromGist();
        showSuccess('配置同步成功！Gist 数据已加载');
      } catch (error: any) {
        showError(`配置同步成功，但 Gist 数据加载失败: ${error.message}`);
      }
      
    } catch (error: any) {
      setError(`解密失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    // 关闭 modal
    onClose();
    
    // 清空状态
    setSalt('');
    setError('');
    setDecryptedConfig(null);
    setIsDecrypted(false);
  };

  const handleClose = () => {
    setSalt('');
    setError('');
    setDecryptedConfig(null);
    setIsDecrypted(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="🔐 配置同步"
      closeOnOverlayClick={false}
      className="decrypt-config-modal"
    >
      <div className="decrypt-config-content">
        {!isDecrypted ? (
          <>
            <div className="decrypt-info">
              <p>检测到配置同步链接，请输入4位数字盐字符串来解密配置。</p>
              <p className="config-url-preview">
                <strong>同步链接：</strong>
                <br />
                <span className="url-text">{configUrl}</span>
              </p>
            </div>

            <div className="input-group">
              <label htmlFor="salt-input">盐字符串（4位数字）:</label>
              <input
                id="salt-input"
                type="text"
                value={salt}
                onChange={(e) => setSalt(e.target.value)}
                placeholder="输入4位数字，如：1234"
                maxLength={4}
                pattern="[0-9]{4}"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="modal-actions">
              <Button
                variant="ghost"
                onClick={handleClose}
                disabled={isLoading}
                fullWidth
              >
                取消
              </Button>
              
              <Button
                variant="primary"
                onClick={handleDecrypt}
                loading={isLoading}
                disabled={!salt.trim()}
                fullWidth
              >
                解密
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="decrypt-success">
              <div className="success-icon">✅</div>
              <h3>配置同步成功！</h3>
              <p>以下配置已同步到应用中：</p>
              {loading && (
                <div className="sync-status">
                  <span className="sync-loading">🔄 正在同步 Gist 数据...</span>
                </div>
              )}
            </div>

            <div className="config-preview">
              <div className="config-item">
                <label>GitHub Token:</label>
                <div className="token-preview">
                  {decryptedConfig?.token.substring(0, 8)}...{decryptedConfig?.token.substring(decryptedConfig.token.length - 4)}
                </div>
              </div>
              
              <div className="config-item">
                <label>Gist ID:</label>
                <div className="gist-preview">
                  {decryptedConfig?.gistId}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <Button
                variant="primary"
                onClick={handleConfirm}
                fullWidth
              >
                完成
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DecryptConfigModal; 