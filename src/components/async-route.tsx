import React, { Suspense, ReactNode } from 'react';
import Button from './button';
import { ErrorBoundary } from 'react-error-boundary';

interface AsyncRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// 错误回退组件
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="page">
      <div className="page-content">
        <div className="error-container">
          <h2>❌ 页面加载失败</h2>
          <p>抱歉，页面加载时出现了错误</p>
          <div className="error-details">
            <details>
              <summary>错误详情</summary>
              <pre className="error-message">{error.message}</pre>
            </details>
          </div>
          <Button 
            variant="primary"
            onClick={resetErrorBoundary}
          >
            重试加载
          </Button>
        </div>
      </div>
    </div>
  );
};

// 异步路由组件
const AsyncRoute: React.FC<AsyncRouteProps> = ({ 
  children, 
  fallback = <PageLoadingFallback />
}) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // 清除错误状态
        window.location.reload();
      }}
    >
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// 页面加载回退组件
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

export default AsyncRoute; 