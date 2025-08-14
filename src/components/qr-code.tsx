import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

const QRCodeComponent: React.FC<QRCodeProps> = ({ 
  value, 
  size = 200, 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).catch((err) => {
        console.error('生成二维码失败:', err);
      });
    }
  }, [value, size]);

  if (!value) {
    return (
      <div className={`qr-code-placeholder ${className}`}>
        <div className="placeholder-content">
          <span>暂无数据</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`qr-code-container ${className}`}>
      <canvas 
        ref={canvasRef}
        className="qr-code-canvas"
        width={size}
        height={size}
      />
    </div>
  );
};

export default QRCodeComponent; 