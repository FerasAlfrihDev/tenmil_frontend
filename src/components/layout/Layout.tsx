// ========================================
// MAIN LAYOUT COMPONENT
// ========================================

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

interface LayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerContent?: React.ReactNode;
  sidebarContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  headerTitle,
  headerContent,
  sidebarContent,
  footerContent,
}) => {
  return (
    <div className="app-container">
      <Header title={headerTitle}>
        {headerContent}
      </Header>
      
      <Sidebar>
        {sidebarContent}
      </Sidebar>
      
      <MainContent>
        {children}
      </MainContent>
      
      <Footer>
        {footerContent}
      </Footer>
    </div>
  );
};

export default Layout;
