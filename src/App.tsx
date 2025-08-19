import { useState } from 'react'
import { Layout } from './components/layout'
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

  return (
    <div className={isDarkMode ? 'main-content-dark' : ''}>
      <Layout 
        headerTitle="Tenmil Dashboard"
        headerContent={headerContent}
        sidebarContent={sidebarContent}
      >
        <div className="card">
        <div className="card-header">
          <h2>Welcome to Tenmil</h2>
        </div>
        <div className="card-body">
          <p>This is your main content area with <strong>smart viewport scaling</strong>. Everything scales smoothly until 1536x695, then locks to fixed sizes with overflow!</p>
          
          <div className="mb-lg">
            <h3>Typography & Spacing Showcase</h3>
            <p className="text-xs mb-xs">Extra small text (1.2vmin) - XS spacing</p>
            <p className="text-sm mb-sm">Small text (1.6vmin) - SM spacing</p>
            <p className="text-base mb-base">Base text (2vmin) - Base spacing</p>
            <p className="text-md mb-md">Medium text (2.4vmin) - MD spacing</p>
            <p className="text-lg mb-lg">Large text (3.2vmin) - LG spacing</p>
          </div>

          <div className="p-md card" style={{ backgroundColor: 'rgba(100, 108, 255, 0.1)' }}>
            <h4>Spacing Examples</h4>
            <div className="mt-base">
              <span className="p-xs" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', marginRight: '0.5rem' }}>XS padding</span>
              <span className="p-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', marginRight: '0.5rem' }}>SM padding</span>
              <span className="p-base" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>Base padding</span>
            </div>
          </div>

          <div className="mt-lg mb-lg">
            <h4>System Information</h4>
            <p>Current subdomain type: <span className="text-primary font-semibold">{apiService.getSubdomainType()}</span></p>
            <p>API Base URL: <code className="text-sm font-medium">{apiService.getBaseURL()}</code></p>
            <p className="text-muted text-sm">Responsive scaling ≥1536x695, fixed sizes with overflow below that</p>
          </div>
          
          <div className="mt-xl gap-base" style={{ display: 'flex' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => setCount((count) => count + 1)}
            >
              Count is {count}
            </button>
            <button className="btn btn-secondary">
              Smart Scaling
            </button>
          </div>
        </div>
      </div>
      </Layout>
    </div>
  )
}

export default App
