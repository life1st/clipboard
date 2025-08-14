import { lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/navigation';
import AsyncRoute from './components/async-route';
import { useSettingsStore, useClipboardStore } from './store';
import { useConfigDetection } from './hooks/use-config-detection';
import DecryptConfigModal from './components/decrypt-config-modal';
import { useToastStore } from './store/toast-store';
import ToastContainer from './components/toast-container';

// 使用 dynamic import 进行代码拆分
const ClipboardList = lazy(() => import('./pages/clipboard-list'));
const Settings = lazy(() => import('./pages/settings'));

function App() {
  const { loadFromGist } = useClipboardStore();
  const { showDecryptModal, configUrl, closeDecryptModal } = useConfigDetection();
  const { toasts, removeToast } = useToastStore();
  
  useEffect(() => {
    const initializeApp = async () => {
      await Promise.all([
        useSettingsStore.persist.rehydrate(),
        useClipboardStore.persist.rehydrate(),
      ])
      loadFromGist()
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // 页面重新可见时，从gist拉取最新数据
        loadFromGist();
      }
    };

    initializeApp()
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 清理事件监听器
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [])
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="app-main">
          <Routes>
            <Route path="/" element={
              <AsyncRoute>
                <ClipboardList />
              </AsyncRoute>
            } />
            <Route path="/clipboard" element={
              <AsyncRoute>
                <ClipboardList />
              </AsyncRoute>
            } />            
            <Route path="/settings" element={
              <AsyncRoute>
                <Settings />
              </AsyncRoute>
            } />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>使用 GitHub Gist API 管理你的代码片段</p>
        </footer>
        
        {/* 配置解密 Modal */}
        <DecryptConfigModal
          isOpen={showDecryptModal}
          onClose={closeDecryptModal}
          configUrl={configUrl}
        />
        
        {/* Toast 通知 */}
        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      </div>
    </Router>
  );
}

export default App 