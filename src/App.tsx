import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider, useUser } from './contexts/UserContext'
import { ProtectedRoute } from './components/auth'
import { Layout } from './components/layout'
import { AdminLayout } from './components/layout/admin'
import { ToastContainer } from './components/ui/Toast'
import { useToast } from './hooks/useToast'
import { errorHandler } from './services/errorHandler'
import { 
  Dashboard, 
  ComingSoon, 
  LandingPage, 
  LoginPage,
  ChangePasswordPage,
  AssetsPage, 
  WorkOrdersPage, 
  PartsPage, 
  PurchaseOrdersPage 
} from './pages'
import { AdminDashboard, AdminComingSoon } from './pages/admin'
import apiService from './services/api'
import { Moon, Sun, Globe, Bell } from 'lucide-react'

// Main App Content Component (inside UserProvider)
function AppContent() {
  const [count, setCount] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)
  const { toasts, showError, showWarning, dismissToast } = useToast()
  const { state: userState } = useUser()

  // Initialize error handler with toast functionality
  useEffect(() => {
    errorHandler.setToastHandler((type, title, message) => {
      if (type === 'error') {
        showError(title, message);
      } else if (type === 'warning') {
        showWarning(title, message);
      }
    });
  }, [showError, showWarning]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Update HTML class when theme changes
  useEffect(() => {
    const htmlElement = document.documentElement
    if (isDarkMode) {
      htmlElement.classList.remove('theme-light')
      htmlElement.classList.add('theme-dark')
    } else {
      htmlElement.classList.remove('theme-dark')
      htmlElement.classList.add('theme-light')
    }
  }, [isDarkMode])

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    setShowLanguages(false) // Close other dropdowns
  }

  const toggleLanguages = () => {
    setShowLanguages(!showLanguages)
    setShowNotifications(false) // Close other dropdowns
  }

  const headerContent = (
    <div className="header-right-content">
      <div className="header-actions">
        <button 
          className="header-icon-btn" 
          title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        <div className="header-dropdown-container">
          <button 
            className={`header-icon-btn ${showLanguages ? 'active' : ''}`}
            title="Change Language"
            onClick={toggleLanguages}
          >
            <Globe size={18} />
          </button>
          {showLanguages && (
            <div className="header-dropdown">
              <div className="dropdown-item">
                <span className="dropdown-flag">🇺🇸</span>
                <span className="dropdown-text">English</span>
              </div>
              <div className="dropdown-item">
                <span className="dropdown-flag">🇪🇸</span>
                <span className="dropdown-text">Español</span>
              </div>
              <div className="dropdown-item">
                <span className="dropdown-flag">🇫🇷</span>
                <span className="dropdown-text">Français</span>
              </div>
              <div className="dropdown-item">
                <span className="dropdown-flag">🇩🇪</span>
                <span className="dropdown-text">Deutsch</span>
              </div>
              <div className="dropdown-item">
                <span className="dropdown-flag">🇯🇵</span>
                <span className="dropdown-text">日本語</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="header-dropdown-container">
          <button 
            className={`header-icon-btn ${showNotifications ? 'active' : ''}`}
            title="Notifications"
            onClick={toggleNotifications}
          >
            <Bell size={18} />
          </button>
          {showNotifications && (
            <div className="header-dropdown">
              <div className="dropdown-item">
                <strong>New Work Order</strong>
                <span className="dropdown-time">2 min ago</span>
              </div>
              <div className="dropdown-item">
                <strong>Asset Maintenance Due</strong>
                <span className="dropdown-time">15 min ago</span>
              </div>
              <div className="dropdown-item">
                <strong>Part Order Delivered</strong>
                <span className="dropdown-time">1 hour ago</span>
              </div>
              <div className="dropdown-item">
                <strong>System Update</strong>
                <span className="dropdown-time">3 hours ago</span>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item view-all">View All Notifications</div>
            </div>
          )}
        </div>
      </div>
      <div 
        className="header-username" 
        title={userState.user?.email || 'Not logged in'}
      >
        {userState.user?.name || 'Guest'}
      </div>
    </div>
  )

  // Remove custom sidebar content to use the default sidebar with proper colors and icons
  const sidebarContent = null

  const subdomainType = apiService.getSubdomainType();

  // Render different layouts based on subdomain type
  const renderLayout = () => {
    // Landing page for main domain (localhost with no subdomain)
    if (subdomainType === 'main') {
      return <LandingPage />;
    }

    if (subdomainType === 'admin') {
      return (
        <AdminLayout 
          headerTitle="Tenmil Admin Portal"
          headerContent={headerContent}
          sidebarContent={sidebarContent}
        >
          <Routes>
            <Route 
              path="/login" 
              element={<LoginPage />} 
            />
            <Route 
              path="/change-password" 
              element={
                <ProtectedRoute requirePasswordChange={true}>
                  <ChangePasswordPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <AdminDashboard 
                    isDarkMode={isDarkMode} 
                    count={count} 
                    setCount={setCount} 
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/companies" 
              element={
                <ProtectedRoute requiredPermissions={['manage_companies']}>
                  <AdminComingSoon 
                    pageName="Company Management" 
                    description="Manage all companies in the system. Create, edit, and configure company settings, licenses, and permissions."
                    expectedDate="Q1 2024"
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute requiredPermissions={['manage_users']}>
                  <AdminComingSoon 
                    pageName="User Administration" 
                    description="Comprehensive user management across all companies. Manage roles, permissions, and user lifecycle."
                    expectedDate="Q1 2024"
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute requiredPermissions={['manage_settings']}>
                  <AdminComingSoon 
                    pageName="System Settings" 
                    description="Global system configuration, security settings, and administrative controls for the entire platform."
                    expectedDate="Q1 2024"
                  />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AdminLayout>
      );
    }

    // Default layout for wildcard subdomains (company/tenant portals)
    return (
      <Layout 
        headerTitle="Tenmil Dashboard"
        headerContent={headerContent}
        sidebarContent={sidebarContent}
      >
        <Routes>
          <Route 
            path="/login" 
            element={<LoginPage />} 
          />
          <Route 
            path="/change-password" 
            element={
              <ProtectedRoute requirePasswordChange={true}>
                <ChangePasswordPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard 
                  isDarkMode={isDarkMode} 
                  count={count} 
                  setCount={setCount} 
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assets" 
            element={
              <ProtectedRoute>
                <AssetsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/work-orders" 
            element={
              <ProtectedRoute>
                <WorkOrdersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/parts" 
            element={
              <ProtectedRoute>
                <PartsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/purchase-orders" 
            element={
              <ProtectedRoute>
                <PurchaseOrdersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/billing" 
            element={
              <ProtectedRoute>
                <ComingSoon 
                  pageName="Billing & Invoicing" 
                  description="Automated billing system with invoice generation, payment tracking, and financial reporting capabilities."
                  expectedDate="Q3 2024"
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <ComingSoon 
                  pageName="Analytics & Reports" 
                  description="Advanced analytics dashboard with customizable reports, KPI tracking, and performance insights."
                  expectedDate="Q2 2024"
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute requiredPermissions={['manage_users']}>
                <ComingSoon 
                  pageName="User Management" 
                  description="Manage user accounts, roles, and permissions. Control access level and track user activity."
                  expectedDate="Q1 2024"
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute requiredPermissions={['manage_settings']}>
                <ComingSoon 
                  pageName="System Settings" 
                  description="Configure system preferences, integrations, and customization options to fit your organization's needs."
                  expectedDate="Q1 2024"
                />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    );
  };

  return (
    <div className={isDarkMode ? 'main-content-dark' : ''} style={{ minHeight: '100vh' }}>
      {renderLayout()}
      <ToastContainer toasts={toasts} onClose={dismissToast} />
    </div>
  )
}

// Main App Component
function App() {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  )
}

export default App
