import React, { useState, useMemo, useCallback } from 'react';
import { debounce } from 'lodash-es';
import { useClipboardStore, useSettingsStore, usePasteModalStore } from '../store';
import { useToastStore } from '../store/toast-store';
import { updateGistFile } from '../request';
import { Link } from 'react-router-dom';
import Button from '../components/button';
import cls from 'classnames'
import { SORT_OPTIONS, SORT_ORDERS, SORT_LABELS, SORT_ORDER_LABELS, DISPLAY_LIMITS } from '../constants';

// ClipboardItem 组件
interface ClipboardItemProps {
  item: any;
  onDelete: (id: string) => void;
}

const ClipboardItem: React.FC<ClipboardItemProps> = ({ item, onDelete }) => {
  const { showError } = useToastStore();

  const [copied, setCopied] = useState(false);

  // 使用防抖重置copied状态
  const resetCopied = useCallback(
    debounce(() => setCopied(false), 2000),
    []
  );

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // showSuccess('内容已复制到剪贴板');
      setCopied(true);
      resetCopied(); // 防抖重置
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      showError('复制失败，请检查浏览器权限');
    }
  };

  return (
    <div 
      className="clipboard-item"
      onClick={() => handleCopy(item.content)}
    >
      <div className="item-content">
        <div className="content-text">
          {item.content.length > 100 
            ? item.content.substring(0, 100) + '...' 
            : item.content
          }
        </div>
        <div className="item-meta">
          <span className="timestamp">
            {new Date(item.timestamp).toLocaleString()}
          </span>
          <span className={cls('copy-status', {
            'copied': copied
          })}>
            {copied ? '✅已复制' : '点击复制'}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onFocus={(e) => e.stopPropagation()}
        title="删除"
        className="delete-button"
      >
        ✕
      </button>
    </div>
  );
};

const ClipboardList: React.FC = () => {
  const { 
    items: clipboardItems,
    loading,
    error,
    lastSync,
    maxItems,
    sortBy,
    sortOrder,
    addItem,
    deleteItem,
    clearAll,
    setLoading,
    setError,
    setMaxItems,
    setSortBy,
    setSortOrder,
    loadFromGist
  } = useClipboardStore();

  // 使用 useMemo 计算派生状态
  const totalItems = useMemo(() => clipboardItems.length, [clipboardItems]);
  const hasItems = useMemo(() => clipboardItems.length > 0, [clipboardItems]);
  
  const {
    gistId,
    githubToken
  } = useSettingsStore();

  const { isOpen: showPasteModal, content: pasteContent, openModal: openPasteModal, closeModal: closePasteModal, setContent } = usePasteModalStore();
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(true); // 显示设置折叠状态，默认折叠

  // 检查是否已配置
  const isConfigured = useMemo(() => {
    return !!(gistId && githubToken);
  }, [gistId, githubToken]);

  const handleSync = async () => {
    if (!isConfigured) {
      setError('请先在设置页面配置 Gist ID 和 Token');
      return;
    }
    loadFromGist()
  }

  // 从剪贴板粘贴内容
  const pasteFromClipboard = async () => {
    try {
      const content = await navigator.clipboard.readText();
      openPasteModal(content);
    } catch (err) {
      console.error('Failed to read from clipboard:', err);
      setError('读取剪贴板失败，请检查浏览器权限');
    }
  };

  // 添加新项目
  const addNewItem = async () => {
    if (!pasteContent.trim()) return;
    
    try {
      // 添加项目到本地状态
      addItem(pasteContent.trim());
      closePasteModal();
      
      // 如果配置了 Gist，自动保存到 Gist
      if (isConfigured) {
        setLoading(true);
        setError('');
        
        try {
          // 获取最新的项目列表（包括刚添加的项目）
          const { items } = useClipboardStore.getState();
          const content = JSON.stringify({
            items: items,
            lastUpdated: new Date().toISOString()
          }, null, 2);
          
          // 更新 Gist 中的 clipboard.json 文件
          await updateGistFile(gistId, 'clipboard.json', content, 'Updated clipboard data');
          
          // 显示成功消息
          setError('✅ 项目已添加并同步到 Gist');
          setTimeout(() => setError(''), 3000);
          
        } catch (err: any) {
          setError(`❌ 同步到 Gist 失败: ${err.message}`);
        } finally {
          setLoading(false);
        }
      }
    } catch (err: any) {
      setError(`❌ 添加项目失败: ${err.message}`);
    }
  };

  // 清空所有项目
  const handleClearAll = () => {
    if (window.confirm('确定要清空所有项目吗？')) {
      clearAll();
    }
  };

  return (
    <div className="clipboard-list-page">
      <div className="page-content">
        {/* 配置提示区域 */}
        {!isConfigured && (
          <div className="config-prompt-section">
            <div className="config-prompt">
              <div className="prompt-icon">⚙️</div>
              <div className="prompt-content">
                <h3>需要配置 Gist 同步</h3>
                <p>要使用 Gist 同步功能，请先在设置页面配置 GitHub Token 和 Gist ID</p>
                <Link to="/settings">
                  <Button variant="primary" fullWidth>
                    🚀 前往设置页面
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Gist 同步控制区域 */}
        {isConfigured && (
          <div className="gist-sync-section">
            <div className='gist-sync-header'>
              <h3>Gist 同步</h3>
              <Button
                variant="secondary"
                onClick={handleSync}
                disabled={loading || !isConfigured}
                loading={loading}
                fullWidth
                title="保存当前数据到 Gist"
                size='sm'
                className='gist-sync-button'
              >
                {loading ? '同步中...' : '从 Gist 同步'}
              </Button>
            </div>
            <div className="sync-info">
              <span>Gist ID: {gistId ? '✅' : '❌'}</span>
              <span>Token: {githubToken ? '✅' : '❌'}</span>
            </div>
            
            <div className="sync-controls">
              <div className="auto-load-info">
                <span className="info-text">
                  {hasItems ? `已加载 ${totalItems} 个项目` : '暂无数据，将自动从 Gist 加载'}
                </span>
                {lastSync && (
                  <span className="last-sync">最后同步: {new Date(lastSync).toLocaleString()}</span>
                )}
              </div>
            </div>
          </div>
        )}



        <div className="settings-section">
          <div className="settings-header">
            <h3>显示设置</h3>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setIsSettingsCollapsed(!isSettingsCollapsed)}
              title={isSettingsCollapsed ? '展开显示设置' : '折叠显示设置'}
            >
              {isSettingsCollapsed ? '▶️' : '▼️'}
            </Button>
          </div>
          
          {!isSettingsCollapsed && (
            <div className="display-options">
              <div className="input-group">
                <label>排序方式:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value={SORT_OPTIONS.TIMESTAMP}>{SORT_LABELS[SORT_OPTIONS.TIMESTAMP]}</option>
                  <option value={SORT_OPTIONS.CONTENT}>{SORT_LABELS[SORT_OPTIONS.CONTENT]}</option>
                </select>
              </div>
              
              <div className="input-group">
                <label>排序顺序:</label>
                <select 
                  value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value as any)}
                >
                  <option value={SORT_ORDERS.DESC}>{SORT_ORDER_LABELS[SORT_ORDERS.DESC]}</option>
                  <option value={SORT_ORDERS.ASC}>{SORT_ORDER_LABELS[SORT_ORDERS.ASC]}</option>
                </select>
              </div>
              
              <div className="input-group">
                <label>最大显示项目数:</label>
                <input 
                  type="number" 
                  value={maxItems}
                  onChange={(e) => setMaxItems(parseInt(e.target.value) || DISPLAY_LIMITS.DEFAULT_ITEMS)}
                  min={DISPLAY_LIMITS.MIN_ITEMS}
                  max={DISPLAY_LIMITS.MAX_ITEMS}
                />
              </div>
            </div>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* 剪贴板列表 */}
        <div className="clipboard-section">
          <div className="section-header">
            <h3>剪贴板项目 ({totalItems})</h3>
            <div className="header-actions">
              <Button 
                variant="danger"
                onClick={handleClearAll}
                disabled={!hasItems}
                size='sm'
              >
                清空所有
              </Button>
            </div>
          </div>
          
          {clipboardItems.length === 0 ? (
            <div className="empty-state">
              <p>暂无剪贴板项目</p>
              <p>点击右下角的粘贴按钮来添加内容</p>
            </div>
          ) : (
            <div className="clipboard-list">
              {clipboardItems.map((item: any) => (
                <ClipboardItem
                  key={item.id}
                  item={item}
                  onDelete={deleteItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* 浮动粘贴按钮 */}
        <Button 
          variant="primary"
          size="lg"
          onClick={pasteFromClipboard}
          title="从剪贴板粘贴"
          className="floating-paste-button"
        >
          Paste
        </Button>

        {/* 粘贴模态框 */}
        {showPasteModal && (
          <div className="modal-overlay" onClick={closePasteModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>添加剪贴板项目</h3>
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
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default ClipboardList; 