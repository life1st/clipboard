import React, { useMemo } from 'react';
import { usePasteModalStore, useClipboardStore, useSettingsStore } from '../store';
import { useToastStore } from '../store/toast-store';
import Button from './button';
import Modal from './modal';

const PasteModal: React.FC = () => {
  const { 
    isOpen: showPasteModal, 
    content: pasteContent, 
    closeModal: closePasteModal, 
    setContent 
  } = usePasteModalStore();
  
  const { addItem } = useClipboardStore();
  const { gistId, githubToken } = useSettingsStore();
  const { showSuccess, showError } = useToastStore();

  // 检查是否已配置
  const isConfigured = useMemo(() => {
    return !!(gistId && githubToken);
  }, [gistId, githubToken]);

  const addNewItem = async () => {
    if (!pasteContent.trim()) return;
    
    try {
      // 添加项目（包含自动同步逻辑）
      await addItem(pasteContent.trim());
      
      // 显示成功消息
      if (isConfigured) {
        showSuccess('项目已添加并同步到 Gist');
      } else {
        showSuccess('项目已添加到本地');
      }
      
      closePasteModal();
    } catch (error: any) {
      // 如果是同步失败，项目已经添加到本地，只是同步失败
      if (isConfigured) {
        showError(`项目已添加到本地，但 Gist 同步失败: ${error.message}`);
      } else {
        showError(`添加失败: ${error.message}`);
      }
      console.error('Error adding item:', error);
    }
  };

  return (
    <Modal 
      isOpen={showPasteModal}
      onClose={closePasteModal}
      title="添加剪贴板项目"
      className="paste-modal"
    >
      <div className="input-group">
        <label>内容:</label>
        <textarea 
          value={pasteContent} 
          onChange={(e) => setContent(e.target.value)}
          placeholder="粘贴或输入内容"
          rows={6}
        />
      </div>
      
      {isConfigured && (
        <div className="input-group">
          <label>
            <input 
              type="checkbox" 
              checked={true}
              disabled={true}
            />
            自动同步到 Gist (clipboard.json)
          </label>
          <small className="help-text">
            项目添加后将自动更新到 Gist 中的 clipboard.json 文件
          </small>
        </div>
      )}
      
      <div className="modal-actions">
        <Button 
          variant="primary"
          onClick={addNewItem}
          disabled={!pasteContent.trim()}
          fullWidth
        >
          添加
        </Button>
        <Button 
          variant="ghost"
          onClick={closePasteModal}
          fullWidth
        >
          取消
        </Button>
      </div>
    </Modal>
  );
};

export default PasteModal;