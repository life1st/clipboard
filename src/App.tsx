import { lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/navigation';
import AsyncRoute from './components/async-route';
import { useConfigDetection } from './hooks/use-config-detection';
import { useAppInitialization } from './hooks/use-app-initialization';
import DecryptConfigModal from './components/decrypt-config-modal';
import { useToastStore } from './store/toast-store';
import ToastContainer from './components/toast-container';
import { checkForUpdates, getVersionString } from './utils/version-check';

// 使用 dynamic import 进行代码拆分
const ClipboardList = lazy(() => import('./pages/clipboard-list'));
const Settings = lazy(() => import('./pages/settings'));

function App() {
  const { showDecryptModal, configUrl, closeDecryptModal } = useConfigDetection();
  const { toasts, removeToast, showSuccess } = useToastStore();
  
  // 使用全局初始化hook
  useAppInitialization();
  
  // 版本检测
  useEffect(() => {
    const checkVersion = async () => {
      try {
        const hasUpdate = await checkForUpdates();
        if (hasUpdate) {
          showSuccess('发现新版本，请刷新页面获取最新功能');
        } else {
          showSuccess('当前已是最新版本');
        }
        
        // 显示当前版本信息
        const versionString = await getVersionString();
        console.log(`Clipboard App ${versionString}`);
      } catch (error) {
        console.warn('Version check failed:', error);
      }
    };
    
    // 延迟检查，避免影响初始加载
    const timer = setTimeout(checkVersion, 3000);
    
    return () => clearTimeout(timer);
  }, [showSuccess]);
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