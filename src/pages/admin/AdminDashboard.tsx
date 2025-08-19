import { useState } from 'react'
import apiService from '../../services/api'
import { 
  Building, Users as UsersIcon, Activity, Shield
} from 'lucide-react'

interface AdminDashboardProps {
  isDarkMode?: boolean
  count?: number
  setCount?: (count: number | ((prev: number) => number)) => void
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  count = 0, 
  setCount 
}) => {
  const [localCount, setLocalCount] = useState(0)
  
  // Use provided setCount or local state
  const currentCount = setCount ? count : localCount
  const handleCountChange = setCount ? setCount : setLocalCount

  return (
    <div className="admin-dashboard-container">
      {/* Admin Stats Cards */}
      <div className="stats-grid mb-lg" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5vmin' 
      }}>
        <div className="card">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1vmin' }}>
            <div className="stat-icon" style={{ 
              backgroundColor: 'rgba(34, 197, 94, 0.1)', 
              color: '#22c55e',
              padding: '1vmin',
              borderRadius: '0.5vmin'
            }}>
              <Building size={24} />
            </div>
            <div>
              <div className="text-lg font-semibold">47</div>
              <div className="text-sm text-muted">Active Companies</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1vmin' }}>
            <div className="stat-icon" style={{ 
              backgroundColor: 'rgba(59, 130, 246, 0.1)', 
              color: '#3b82f6',
              padding: '1vmin',
              borderRadius: '0.5vmin'
            }}>
              <UsersIcon size={24} />
            </div>
            <div>
              <div className="text-lg font-semibold">1,249</div>
              <div className="text-sm text-muted">Total Users</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1vmin' }}>
            <div className="stat-icon" style={{ 
              backgroundColor: 'rgba(245, 158, 11, 0.1)', 
              color: '#f59e0b',
              padding: '1vmin',
              borderRadius: '0.5vmin'
            }}>
              <Activity size={24} />
            </div>
            <div>
              <div className="text-lg font-semibold">98.7%</div>
              <div className="text-sm text-muted">System Uptime</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1vmin' }}>
            <div className="stat-icon" style={{ 
              backgroundColor: 'rgba(168, 85, 247, 0.1)', 
              color: '#a855f7',
              padding: '1vmin',
              borderRadius: '0.5vmin'
            }}>
              <Shield size={24} />
            </div>
            <div>
              <div className="text-lg font-semibold">12</div>
              <div className="text-sm text-muted">Security Events</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      <div className="admin-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '1.5vmin',
        alignItems: 'start'
      }}>
        {/* Left Column - Main Content */}
        <div className="admin-main">
          <div className="card mb-lg">
            <div className="card-header">
              <h2>Admin Control Center</h2>
            </div>
            <div className="card-body">
              <p>Welcome to the <strong>Tenmil Admin Dashboard</strong>. Manage companies, users, and system settings from this central administration panel.</p>
              
              <div className="mt-lg mb-lg">
                <h4>Quick Admin Actions</h4>
                <div className="mt-base gap-base" style={{ display: 'flex', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleCountChange((prev) => prev + 1)}
                  >
                    Admin Counter: {currentCount}
                  </button>
                  <button className="btn btn-secondary">
                    Add New Company
                  </button>
                  <button className="btn" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                    Create User
                  </button>
                  <button className="btn" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                    System Settings
                  </button>
                </div>
              </div>

              <div className="mt-lg">
                <h4>System Information</h4>
                <p>Environment: <span className="text-primary font-semibold">Admin Portal</span></p>
                <p>Subdomain: <span className="text-primary font-semibold">{apiService.getSubdomainType()}</span></p>
                <p>API Base URL: <code className="text-sm font-medium">{apiService.getBaseURL()}</code></p>
                <p className="text-muted text-sm">Administrative interface with enhanced security and controls</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Recent Admin Activity</h3>
            </div>
            <div className="card-body">
              <div className="activity-list">
                <div className="activity-item mb-base">
                  <strong>New company "TechCorp Solutions" registered</strong>
                  <div className="text-sm text-muted">Company setup with 25 user licenses</div>
                  <div className="text-xs text-muted">1 hour ago</div>
                </div>
                <div className="activity-item mb-base">
                  <strong>User permissions updated</strong>
                  <div className="text-sm text-muted">Admin role assigned to john.doe@techcorp.com</div>
                  <div className="text-xs text-muted">3 hours ago</div>
                </div>
                <div className="activity-item mb-base">
                  <strong>System maintenance completed</strong>
                  <div className="text-sm text-muted">Database optimization and security updates applied</div>
                  <div className="text-xs text-muted">6 hours ago</div>
                </div>
                <div className="activity-item mb-base">
                  <strong>Security alert resolved</strong>
                  <div className="text-sm text-muted">Suspicious login attempt blocked from IP 192.168.1.100</div>
                  <div className="text-xs text-muted">12 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Admin Sidebar Content */}
        <div className="admin-sidebar">
          <div className="card mb-lg">
            <div className="card-header">
              <h4>Priority Alerts</h4>
            </div>
            <div className="card-body">
              <div className="alert-list">
                <div className="alert-item mb-sm" style={{ 
                  padding: '0.5vmin',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '0.5vmin',
                  borderLeft: '3px solid #ef4444'
                }}>
                  <div className="text-sm font-semibold">License expiring soon</div>
                  <div className="text-xs text-muted">Company: ABC Manufacturing (3 days)</div>
                </div>
                <div className="alert-item mb-sm" style={{ 
                  padding: '0.5vmin',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '0.5vmin',
                  borderLeft: '3px solid #f59e0b'
                }}>
                  <div className="text-sm font-semibold">Storage usage high</div>
                  <div className="text-xs text-muted">85% of allocated space used</div>
                </div>
                <div className="alert-item" style={{ 
                  padding: '0.5vmin',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '0.5vmin',
                  borderLeft: '3px solid #3b82f6'
                }}>
                  <div className="text-sm font-semibold">Pending user approvals</div>
                  <div className="text-xs text-muted">7 new users awaiting activation</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-lg">
            <div className="card-header">
              <h4>System Health</h4>
            </div>
            <div className="card-body">
              <div className="health-list">
                <div className="health-item mb-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-sm">API Gateway</span>
                  <span className="status-indicator" style={{ 
                    backgroundColor: '#22c55e', 
                    color: 'white', 
                    padding: '0.2vmin 0.5vmin',
                    borderRadius: '0.3vmin',
                    fontSize: '0.7rem'
                  }}>
                    Healthy
                  </span>
                </div>
                <div className="health-item mb-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-sm">Database Cluster</span>
                  <span className="status-indicator" style={{ 
                    backgroundColor: '#22c55e', 
                    color: 'white', 
                    padding: '0.2vmin 0.5vmin',
                    borderRadius: '0.3vmin',
                    fontSize: '0.7rem'
                  }}>
                    Healthy
                  </span>
                </div>
                <div className="health-item mb-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-sm">Cache Layer</span>
                  <span className="status-indicator" style={{ 
                    backgroundColor: '#22c55e', 
                    color: 'white', 
                    padding: '0.2vmin 0.5vmin',
                    borderRadius: '0.3vmin',
                    fontSize: '0.7rem'
                  }}>
                    Healthy
                  </span>
                </div>
                <div className="health-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-sm">Email Service</span>
                  <span className="status-indicator" style={{ 
                    backgroundColor: '#f59e0b', 
                    color: 'white', 
                    padding: '0.2vmin 0.5vmin',
                    borderRadius: '0.3vmin',
                    fontSize: '0.7rem'
                  }}>
                    Degraded
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4>Quick Stats</h4>
            </div>
            <div className="card-body">
              <div className="quick-stats">
                <div className="stat-row mb-sm" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-sm">Online Users</span>
                  <span className="text-sm font-semibold">342</span>
                </div>
                <div className="stat-row mb-sm" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-sm">API Calls (24h)</span>
                  <span className="text-sm font-semibold">48,392</span>
                </div>
                <div className="stat-row mb-sm" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-sm">Storage Used</span>
                  <span className="text-sm font-semibold">2.4 TB</span>
                </div>
                <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-sm">Active Sessions</span>
                  <span className="text-sm font-semibold">156</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
