// ========================================
// MAIN LAYOUT COMPONENT
// ========================================

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { usePageTitle } from '../../utils/pageTitle';

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
  // Get dynamic page title based on current route
  const dynamicTitle = usePageTitle(false);
  // Use provided headerTitle or fall back to dynamic title
  const title = headerTitle || dynamicTitle;

  return (
    <div className="app-container">
      <Header title={title}>
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
