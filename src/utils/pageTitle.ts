// ========================================
// PAGE TITLE UTILITY
// ========================================

/**
 * Maps route paths to their corresponding page titles
 */
export const getPageTitle = (pathname: string, isAdmin: boolean = false): string => {
  // Remove trailing slash for consistent matching
  const cleanPath = pathname.endsWith('/') && pathname.length > 1 
    ? pathname.slice(0, -1) 
    : pathname;

  if (isAdmin) {
    // Admin portal page titles
    switch (cleanPath) {
      case '/':
        return 'Admin Dashboard';
      case '/companies':
        return 'Company Management';
      case '/users':
        return 'User Management';
      case '/settings':
        return 'System Settings';
      case '/login':
        return 'Admin Login';
      case '/change-password':
        return 'Change Password';
      default:
        return 'Tenmil Admin Portal';
    }
  } else {
    // Regular portal page titles
    switch (cleanPath) {
      case '/':
        return 'Dashboard';
      case '/assets':
        return 'Assets';
      case '/work-orders':
        return 'Work Orders';
      case '/parts':
        return 'Parts';
      case '/purchase-orders':
        return 'Purchase Orders';
      case '/billing':
        return 'Billing & Invoicing';
      case '/analytics':
        return 'Analytics & Reports';
      case '/users':
        return 'Users';
      case '/settings':
        return 'Settings';
      case '/login':
        return 'Login';
      case '/change-password':
        return 'Change Password';
      default:
        return 'Tenmil Dashboard';
    }
  }
};

/**
 * Hook to get the current page title based on the current route
 */
import { useLocation } from 'react-router-dom';

export const usePageTitle = (isAdmin: boolean = false): string => {
  const location = useLocation();
  return getPageTitle(location.pathname, isAdmin);
};
