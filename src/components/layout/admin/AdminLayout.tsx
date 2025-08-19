// ========================================
// ADMIN LAYOUT COMPONENT
// ========================================

import React from 'react';
import { Header, Footer, MainContent } from '../';
import AdminSidebar from './AdminSidebar';

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
  return (
    <div className="app-container admin-container">
      <Header title={headerTitle}>
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
