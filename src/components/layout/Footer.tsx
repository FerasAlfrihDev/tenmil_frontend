// ========================================
// FOOTER COMPONENT
// ========================================

import React from 'react';

interface FooterProps {
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  return (
    <footer className="app-footer">
      {children || (
        <p>&copy; {new Date().getFullYear()} Tenmil. All rights reserved.</p>
      )}
    </footer>
  );
};

export default Footer;
