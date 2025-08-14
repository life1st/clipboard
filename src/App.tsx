import { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/navigation';
import AsyncRoute from './components/async-route';
import { useConfigDetection } from './hooks/use-config-detection';
import { useAppInitialization } from './hooks/use-app-initialization';
import DecryptConfigModal from './components/decrypt-config-modal';
import { useToastStore } from './store/toast-store';
import ToastContainer from './components/toast-container';

// 使用 dynamic import 进行代码拆分
const ClipboardList = lazy(() => import('./pages/clipboard-list'));
const Settings = lazy(() => import('./pages/settings'));

function App() {
  const { showDecryptModal, configUrl, closeDecryptModal } = useConfigDetection();
  const { toasts, removeToast } = useToastStore();
  
  // 使用全局初始化hook
  useAppInitialization();
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