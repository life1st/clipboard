import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { PagePreloader } from '../utils/page-preloader';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const menus = [
    {
      path: '/clipboard',
      name: '剪贴板列表',
      icon: '📋',
    },
    {
      path: '/settings',
      name: '设置',
      icon: '⚙️',
    }
  ]

  return (
    <>
      {/* 占位 div，高度与导航栏一致 */}
      <div className="navigation-placeholder"></div>
      
      <nav className="navigation">
        <div className="nav-container">
          <NavLink to="/" className="nav-brand">
            <span className="nav-title">Clipboard</span>
          </NavLink>
          
          <ul className="nav-links">
            {menus.map((menu) => (
              <li className={`${isActive(menu.path) ? 'active' : '' } nav-item`} key={menu.path}>
                <NavLink 
                  to={menu.path} 
                  className="nav-link"
                  onMouseEnter={() => PagePreloader.preloadPage(menu.path)}
                >
                  {menu.icon} {menu.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navigation; 