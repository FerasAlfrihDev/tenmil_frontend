import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requirePasswordChange?: boolean;
  requiredPermissions?: string[];
  requiredGroups?: string[];
  requireAnyPermission?: boolean; // If true, user needs ANY of the permissions, not ALL
  requireAnyGroup?: boolean; // If true, user needs ANY of the groups, not ALL
  fallbackPath?: string;
  loadingComponent?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requirePasswordChange = false,
  requiredPermissions = [],
  requiredGroups = [],
  requireAnyPermission = false,
  requireAnyGroup = false,
  fallbackPath,
  loadingComponent,
}) => {
  const { state, hasPermission, hasGroup, hasAnyPermission, hasAnyGroup } = useUser();
  const location = useLocation();

  // Show loading component while checking authentication
  if (state.isLoading) {
    return loadingComponent ? (
      <>{loadingComponent}</>
    ) : (
      <div className="protected-route-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but we don't require auth, allow access
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Check password change requirement
  if (requirePasswordChange && !state.requiresPasswordChange) {
    // User doesn't need to change password, redirect to dashboard
    return <Navigate to="/" replace />;
  }

  if (!requirePasswordChange && state.requiresPasswordChange) {
    // User needs to change password but this route doesn't handle it
    return <Navigate to="/change-password" replace />;
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAnyPermission
      ? hasAnyPermission(requiredPermissions)
      : requiredPermissions.every(permission => hasPermission(permission));

    if (!hasRequiredPermissions) {
      const redirectPath = fallbackPath || '/unauthorized';
      return <Navigate to={redirectPath} replace />;
    }
  }

  // Check group requirements
  if (requiredGroups.length > 0) {
    const hasRequiredGroups = requireAnyGroup
      ? hasAnyGroup(requiredGroups)
      : requiredGroups.every(group => hasGroup(group));

    if (!hasRequiredGroups) {
      const redirectPath = fallbackPath || '/unauthorized';
      return <Navigate to={redirectPath} replace />;
    }
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
