// ========================================
// ADMIN LAYOUT COMPONENT
// ========================================

import React from 'react';
import { Header, Footer, MainContent } from '../';
import AdminSidebar from './AdminSidebar';
import { usePageTitle } from '../../../utils/pageTitle';

interface AdminLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerContent?: React.ReactNode;
  sidebarContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  headerTitle,
  headerContent,
  sidebarContent,
  footerContent,
}) => {
  // Get dynamic page title based on current route (admin mode)
  const dynamicTitle = usePageTitle(true);
  // Use provided headerTitle or fall back to dynamic title
  const title = headerTitle || dynamicTitle;

  return (
    <div className="app-container admin-container">
      <Header title={title}>
        {headerContent}
      </Header>
      
      <AdminSidebar>
        {sidebarContent}
      </AdminSidebar>
      
      <MainContent>
        {children}
      </MainContent>
      
      <Footer>
        {footerContent}
      </Footer>
    </div>
  );
};

export default AdminLayout;
