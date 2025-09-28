// ========================================
// SIDEBAR COMPONENT
// ========================================

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Truck,
  Wrench,
  Package,
  ShoppingCart,
  CreditCard,
  ChartColumn,
  Users,
  Settings
} from 'lucide-react';

interface SidebarProps {
  children?: React.ReactNode;
}

interface NavItem {
  href: string;
  text: string;
  icon: React.ComponentType<any>;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  // Main navigation groups
  const navGroups: NavItem[][] = [
    // Group 1: Dashboard
    [
      { href: '/', text: 'Dashboard', icon: LayoutDashboard }
    ],
    // Group 2: Core Operations
    [
      { href: '/assets', text: 'Assets', icon: Truck },
      { href: '/work-orders', text: 'Work Orders', icon: Wrench },
      { href: '/parts', text: 'Parts', icon: Package },
      { href: '/purchase-orders', text: 'Purchase Orders', icon: ShoppingCart }
    ],
    // Group 3: Business Management
    [
      { href: '/billing', text: 'Billing', icon: CreditCard },
      { href: '/analytics', text: 'Analytics/Reports', icon: ChartColumn },
      { href: '/users', text: 'Users', icon: Users }
    ]
  ];

  // Bottom navigation (Settings)
  const bottomNavItems: NavItem[] = [
    { href: '/settings', text: 'Settings', icon: Settings }
  ];

  const renderNavGroups = () => {
    // Get current path to determine active item using React Router's useLocation
    const location = useLocation();
    const currentPath = location.pathname;
    
    return (
      <ul>
        {navGroups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {group.map((item, itemIndex) => {
              const IconComponent = item.icon;
              const isActive = currentPath === item.href;
              
              return (
                <li key={`${groupIndex}-${itemIndex}`}>
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
            {/* Add separator line between groups (except after the last group) */}
            {groupIndex < navGroups.length - 1 && (
              <li className="nav-separator">
                <div className="separator-line"></div>
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    );
  };

  const renderBottomNav = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    
    return (
      <ul>
        {bottomNavItems.map((item, index) => {
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
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">TenMil</h1>
      </div>
      {children || (
        <>
          <nav className="sidebar-nav">
            {renderNavGroups()}
          </nav>
          <nav className="sidebar-bottom-nav">
            <ul>
              <li className="nav-separator">
                <div className="separator-line"></div>
              </li>
            </ul>
            {renderBottomNav()}
          </nav>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
