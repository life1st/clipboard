import React, { useState } from 'react';
import Modal from './modal';
import Button from './button';
import { parseSyncUrl } from '../utils/sync-utils';
import { useSettingsStore } from '../store';
import { useToastStore } from '../store/toast-store';

interface DecryptConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  configUrl: string;
}

const DecryptConfigModal: React.FC<DecryptConfigModalProps> = ({
  isOpen,
  onClose,
  configUrl
}) => {
  const [salt, setSalt] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setToken, setGistId } = useSettingsStore();
  const { showSuccess } = useToastStore();

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

      // 保存配置到 store
      setToken(config.token);
      setGistId(config.gistId);

      // 关闭 modal
      onClose();
      
      // 清空状态
      setSalt('');
      setError('');
      
      // 显示成功消息
      showSuccess('配置同步成功！');
      
    } catch (error: any) {
      setError(`解密失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSalt('');
    setError('');
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
            确定
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DecryptConfigModal; 