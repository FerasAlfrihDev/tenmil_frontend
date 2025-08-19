// ========================================
// HEADER COMPONENT
// ========================================

import React from 'react';

interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title = 'Tenmil', children }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-right">
        {children}
      </div>
    </header>
  );
};

export default Header;
