// ========================================
// ADMIN SIDEBAR COMPONENT
// ========================================

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Building,
  Users,
  Settings
} from 'lucide-react';

interface AdminSidebarProps {
  children?: React.ReactNode;
}

interface AdminNavItem {
  href: string;
  text: string;
  icon: React.ComponentType<any>;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ children }) => {
  const defaultNavItems: AdminNavItem[] = [
    { href: '/', text: 'Dashboard', icon: LayoutDashboard },
    { href: '/companies', text: 'Companies', icon: Building },
    { href: '/users', text: 'Users', icon: Users },
    { href: '/settings', text: 'Settings', icon: Settings },
  ];

  const renderNavItems = (items: AdminNavItem[]) => {
    // Get current path to determine active item using React Router's useLocation
    const location = useLocation();
    const currentPath = location.pathname;
    
    return (
      <ul>
        {items.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = currentPath === item.href;
          
          return (
            <li key={index}>
              <Link 
                to={item.href} 
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <IconComponent className="nav-icon" size={18} />
                <span className="nav-text">{item.text}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <aside className="app-sidebar admin-sidebar">
      {children || (
        <nav className="sidebar-nav">
          <div className="sidebar-header mb-lg">
            <div className="admin-badge" style={{
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              color: '#a855f7',
              padding: '0.5vmin 1vmin',
              borderRadius: '0.3vmin',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '1vmin'
            }}>
              ADMIN PORTAL
            </div>
          </div>
          {renderNavItems(defaultNavItems)}
        </nav>
      )}
    </aside>
  );
};

export default AdminSidebar;
