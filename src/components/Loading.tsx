import React from 'react';
import '../styles/Loading.css';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  size = 'medium',
  fullScreen = false
}) => {
  const sizeClass = `loading-spinner-${size}`;
  const containerClass = fullScreen ? 'loading-container-fullscreen' : 'loading-container';

  return (
    <div className={containerClass}>
      <div className="loading-content">
        <div className={`loading-spinner ${sizeClass}`}>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        {message && <p className="loading-message">{message}</p>}
      </div>
    </div>
  );
};

export default Loading;
