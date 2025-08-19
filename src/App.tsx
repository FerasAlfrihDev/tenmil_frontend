import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import { AdminLayout } from './components/layout/admin'
import { Dashboard, ComingSoon, LandingPage } from './pages'
import { AdminDashboard, AdminComingSoon } from './pages/admin'
import apiService from './services/api'
import { Moon, Sun, Globe, Bell } from 'lucide-react'

function App() {
  const [count, setCount] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

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
      <div className="header-username">
        John Smith
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
              path="/" 
              element={
                <AdminDashboard 
                  isDarkMode={isDarkMode} 
                  count={count} 
                  setCount={setCount} 
                />
              } 
            />
            <Route 
              path="/companies" 
              element={
                <AdminComingSoon 
                  pageName="Company Management" 
                  description="Manage all companies in the system. Create, edit, and configure company settings, licenses, and permissions."
                  expectedDate="Q1 2024"
                />
              } 
            />
            <Route 
              path="/users" 
              element={
                <AdminComingSoon 
                  pageName="User Administration" 
                  description="Comprehensive user management across all companies. Manage roles, permissions, and user lifecycle."
                  expectedDate="Q1 2024"
                />
              } 
            />
            <Route 
              path="/settings" 
              element={
                <AdminComingSoon 
                  pageName="System Settings" 
                  description="Global system configuration, security settings, and administrative controls for the entire platform."
                  expectedDate="Q1 2024"
                />
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
            path="/" 
            element={
              <Dashboard 
                isDarkMode={isDarkMode} 
                count={count} 
                setCount={setCount} 
              />
            } 
          />
          <Route 
            path="/assets" 
            element={
              <ComingSoon 
                pageName="Asset Management" 
                description="Comprehensive asset tracking and maintenance scheduling system. Manage your equipment lifecycle, track maintenance history, and optimize asset performance."
                expectedDate="Q2 2024"
              />
            } 
          />
          <Route 
            path="/work-orders" 
            element={
              <ComingSoon 
                pageName="Work Orders" 
                description="Create, assign, and track work orders. Streamline your maintenance workflow with automated scheduling and progress tracking."
                expectedDate="Q1 2024"
              />
            } 
          />
          <Route 
            path="/parts" 
            element={
              <ComingSoon 
                pageName="Parts Inventory" 
                description="Manage spare parts inventory, track stock levels, and automate reordering. Never run out of critical components again."
                expectedDate="Q2 2024"
              />
            } 
          />
          <Route 
            path="/purchase-orders" 
            element={
              <ComingSoon 
                pageName="Purchase Orders" 
                description="Streamline procurement with digital purchase orders. Track approvals, deliveries, and vendor performance."
                expectedDate="Q2 2024"
              />
            } 
          />
          <Route 
            path="/billing" 
            element={
              <ComingSoon 
                pageName="Billing & Invoicing" 
                description="Automated billing system with invoice generation, payment tracking, and financial reporting capabilities."
                expectedDate="Q3 2024"
              />
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ComingSoon 
                pageName="Analytics & Reports" 
                description="Advanced analytics dashboard with customizable reports, KPI tracking, and performance insights."
                expectedDate="Q2 2024"
              />
            } 
          />
          <Route 
            path="/users" 
            element={
              <ComingSoon 
                pageName="User Management" 
                description="Manage user accounts, roles, and permissions. Control access level and track user activity."
                expectedDate="Q1 2024"
              />
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ComingSoon 
                pageName="System Settings" 
                description="Configure system preferences, integrations, and customization options to fit your organization's needs."
                expectedDate="Q1 2024"
              />
            } 
          />
        </Routes>
      </Layout>
    );
  };

  return (
    <Router>
      <div className={isDarkMode ? 'main-content-dark' : ''} style={{ minHeight: '100vh' }}>
        {renderLayout()}
      </div>
    </Router>
  )
}

export default App
