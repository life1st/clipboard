import React, { useState, useMemo } from 'react';
import { useClipboardStore } from '../store';
import { HISTORY_LIMITS } from '../constants';
import Button from './button';
import Modal from './modal';

const HistoryManager: React.FC = () => {
  const {
    history,
    maxHistorySize,
    currentHistoryIndex,
    undo,
    redo,
    clearHistory,
    restoreFromHistory,
    setMaxHistorySize
  } = useClipboardStore();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const canUndo = useMemo(() => currentHistoryIndex > 0, [currentHistoryIndex]);
  const canRedo = useMemo(() => currentHistoryIndex < history.length - 1, [currentHistoryIndex, history.length]);

  // 格式化历史版本时间
  const formatHistoryTime = (index: number) => {
    if (index === currentHistoryIndex) {
      return '当前版本';
    }
    const timestamp = Date.now() - (currentHistoryIndex - index) * 1000; // 模拟时间
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="history-section">
      <div className="history-header">
        <h3>历史数据管理</h3>
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? '展开历史管理' : '折叠历史管理'}
        >
          {isCollapsed ? '▶️' : '▼️'}
        </Button>
      </div>
      
      {!isCollapsed && (
        <>
          <div className="history-controls">
            <div className="history-buttons">
              <Button 
                variant="primary"
                onClick={undo}
                disabled={!canUndo}
                fullWidth
                title="撤销到上一个版本"
              >
                ↩️ 撤销
              </Button>
              
              <Button 
                variant="secondary"
                onClick={redo}
                disabled={!canRedo}
                fullWidth
                title="重做到下一个版本"
              >
                ↪️ 重做
              </Button>
              
              <Button 
                variant="primary"
                onClick={() => setShowHistoryModal(true)}
                disabled={history.length === 0}
                fullWidth
                title="查看历史版本"
              >
                📚 历史版本 ({history.length})
              </Button>
              
              <Button 
                variant="primary"
                onClick={clearHistory}
                disabled={history.length === 0}
                fullWidth
                title="清空历史记录"
              >
                🗑️ 清空历史
              </Button>
            </div>
            
            <div className="history-settings">
              <div className="input-group">
                <label>最大历史版本数:</label>
                <input 
                  type="number" 
                  value={maxHistorySize}
                  onChange={(e) => setMaxHistorySize(parseInt(e.target.value) || HISTORY_LIMITS.DEFAULT_SIZE)}
                  min={HISTORY_LIMITS.MIN_SIZE}
                  max={HISTORY_LIMITS.MAX_SIZE}
                />
              </div>
            </div>
          </div>
          
          {history.length > 0 && (
            <div className="history-info">
              <span>当前版本: {currentHistoryIndex + 1} / {history.length}</span>
              {currentHistoryIndex !== history.length - 1 && (
                <span className="warning">⚠️ 当前不在最新版本</span>
              )}
            </div>
          )}
        </>
      )}

      {/* 历史版本模态框 */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="📚 历史版本管理"
        className="history-modal"
      >
        <div className="history-list">
          {history.map((version, index) => (
            <div 
              key={index} 
              className={`history-version ${index === currentHistoryIndex ? 'current' : ''}`}
            >
              <div className="version-info">
                <span className="version-number">版本 {index + 1}</span>
                <span className="version-time">{formatHistoryTime(index)}</span>
                <span className="version-count">{version.length} 个项目</span>
              </div>
              
              <div className="version-actions">
                {index !== currentHistoryIndex && (
                  <Button 
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      restoreFromHistory(index);
                      setShowHistoryModal(false);
                    }}
                    title="恢复到此版本"
                  >
                    恢复
                  </Button>
                )}
                {index === currentHistoryIndex && (
                  <span className="current-badge">当前版本</span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="modal-actions">
          <Button 
            variant="secondary"
            onClick={() => setShowHistoryModal(false)}
            fullWidth
          >
            关闭
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default HistoryManager; 