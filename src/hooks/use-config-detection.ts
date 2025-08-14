import { useState, useEffect } from 'react';

export const useConfigDetection = () => {
  const [showDecryptModal, setShowDecryptModal] = useState(false);
  const [configUrl, setConfigUrl] = useState('');

  useEffect(() => {
    // 检查 URL 中是否有 config 参数
    const urlParams = new URLSearchParams(window.location.search);
    const configParam = urlParams.get('config');
    
    if (configParam) {
      // 构建完整的配置 URL
      const currentUrl = window.location.href;
      setConfigUrl(currentUrl);
      setShowDecryptModal(true);
    }
  }, []);

  const closeDecryptModal = () => {
    setShowDecryptModal(false);
    setConfigUrl('');
    
    // 清除 URL 中的 config 参数
    const url = new URL(window.location.href);
    url.searchParams.delete('config');
    window.history.replaceState({}, '', url.toString());
  };

  return {
    showDecryptModal,
    configUrl,
    closeDecryptModal
  };
}; 