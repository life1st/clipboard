import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { PagePreloader } from '../utils/page-preloader';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <NavLink to="/" className="nav-brand">
          <span className="nav-title">Clipboard</span>
        </NavLink>
        
        <ul className="nav-links">
          <li className="nav-item">
            <NavLink 
              to="/clipboard" 
              className={`nav-link ${isActive('/clipboard') ? 'active' : ''}`}
              onMouseEnter={() => PagePreloader.preloadPage('/clipboard')}
            >
              📋 剪贴板列表
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink 
              to="/settings" 
              className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
              onMouseEnter={() => PagePreloader.preloadPage('/settings')}
            >
              ⚙️ 设置
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation; 