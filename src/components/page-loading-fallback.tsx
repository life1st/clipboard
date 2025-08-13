import React from 'react';

const PageLoadingFallback: React.FC = () => {
  return (
    <div className="page">
      <div className="page-content">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <h2>页面加载中...</h2>
          <p>正在加载页面内容，请稍候</p>
        </div>
      </div>
    </div>
  );
};

export default PageLoadingFallback; 