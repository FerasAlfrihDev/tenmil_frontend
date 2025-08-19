// ========================================
// SIDEBAR COMPONENT
// ========================================

import React from 'react';
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
  const defaultNavItems: NavItem[] = [
    { href: '/', text: 'Dashboard', icon: LayoutDashboard },
    { href: '/assets', text: 'Assets', icon: Truck },
    { href: '/work-orders', text: 'Work Orders', icon: Wrench },
    { href: '/parts', text: 'Parts', icon: Package },
    { href: '/purchase-orders', text: 'Purchase Orders', icon: ShoppingCart },
    { href: '/billing', text: 'Billing', icon: CreditCard },
    { href: '/analytics', text: 'Analytics/Reports', icon: ChartColumn },
    { href: '/users', text: 'Users', icon: Users },
    { href: '/settings', text: 'Settings', icon: Settings },
  ];

  const renderNavItems = (items: NavItem[]) => {
    // Get current path to determine active item
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    
    return (
      <ul>
        {items.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = currentPath === item.href;
          
          return (
            <li key={index}>
              <a 
                href={item.href} 
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <IconComponent className="nav-icon" size={18} />
                <span className="nav-text">{item.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <aside className="app-sidebar">
      {children || (
        <nav className="sidebar-nav">
          {renderNavItems(defaultNavItems)}
        </nav>
      )}
    </aside>
  );
};

export default Sidebar;
