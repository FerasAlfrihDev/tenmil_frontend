import { useState } from 'react'
import apiService from '../services/api'
import { TrendingUp, DollarSign, Package, AlertTriangle } from 'lucide-react'

interface DashboardProps {
  isDarkMode?: boolean
  count?: number
  setCount?: (count: number | ((prev: number) => number)) => void
}

const Dashboard: React.FC<DashboardProps> = ({ count = 0, setCount }) => {
  const [localCount, setLocalCount] = useState(0)
  
  // Use provided setCount or local state
  const currentCount = setCount ? count : localCount
  const handleCountChange = setCount ? setCount : setLocalCount

  return (
    <div className="dashboard-container">
      {/* Dashboard Stats Cards */}
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
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="text-lg font-semibold">$24,780</div>
              <div className="text-sm text-muted">Monthly Revenue</div>
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
              <Package size={24} />
            </div>
            <div>
              <div className="text-lg font-semibold">156</div>
              <div className="text-sm text-muted">Active Assets</div>
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
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="text-lg font-semibold">12</div>
              <div className="text-sm text-muted">Pending Work Orders</div>
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
              <DollarSign size={24} />
            </div>
            <div>
              <div className="text-lg font-semibold">$8,432</div>
              <div className="text-sm text-muted">Outstanding Invoices</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '1.5vmin',
        alignItems: 'start'
      }}>
        {/* Left Column - Main Content */}
        <div className="dashboard-main">
          <div className="card mb-lg">
            <div className="card-header">
              <h2>Welcome to Tenmil Dashboard</h2>
            </div>
            <div className="card-body">
              <p>Your comprehensive maintenance management system with <strong>smart viewport scaling</strong>. Track assets, manage work orders, and monitor your operations from one central location.</p>
              
              <div className="mt-lg mb-lg">
                <h4>Quick Actions</h4>
                <div className="mt-base gap-base" style={{ display: 'flex', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleCountChange((prev) => prev + 1)}
                  >
                    Interactive Counter: {currentCount}
                  </button>
                  <button className="btn btn-secondary">
                    Create Work Order
                  </button>
                  <button className="btn" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                    Add Asset
                  </button>
                </div>
              </div>

              <div className="mt-lg">
                <h4>System Information</h4>
                <p>Current subdomain: <span className="text-primary font-semibold">{apiService.getSubdomainType()}</span></p>
                <p>API Base URL: <code className="text-sm font-medium">{apiService.getBaseURL()}</code></p>
                <p className="text-muted text-sm">Smart responsive scaling ≥1536x695px, fixed sizes with overflow below</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Recent Activity</h3>
            </div>
            <div className="card-body">
              <div className="activity-list">
                <div className="activity-item mb-base">
                  <strong>Work Order #WO-2024-001 completed</strong>
                  <div className="text-sm text-muted">HVAC maintenance completed by John Smith</div>
                  <div className="text-xs text-muted">2 hours ago</div>
                </div>
                <div className="activity-item mb-base">
                  <strong>New asset registered</strong>
                  <div className="text-sm text-muted">Generator Unit GU-205 added to inventory</div>
                  <div className="text-xs text-muted">4 hours ago</div>
                </div>
                <div className="activity-item mb-base">
                  <strong>Purchase order approved</strong>
                  <div className="text-sm text-muted">PO-2024-034 for $2,450 approved</div>
                  <div className="text-xs text-muted">6 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar Content */}
        <div className="dashboard-sidebar">
          <div className="card mb-lg">
            <div className="card-header">
              <h4>Urgent Tasks</h4>
            </div>
            <div className="card-body">
              <div className="task-list">
                <div className="task-item mb-sm" style={{ 
                  padding: '0.5vmin',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '0.5vmin',
                  borderLeft: '3px solid #ef4444'
                }}>
                  <div className="text-sm font-semibold">Critical: Boiler Inspection</div>
                  <div className="text-xs text-muted">Due today</div>
                </div>
                <div className="task-item mb-sm" style={{ 
                  padding: '0.5vmin',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '0.5vmin',
                  borderLeft: '3px solid #f59e0b'
                }}>
                  <div className="text-sm font-semibold">Parts order arrival</div>
                  <div className="text-xs text-muted">Tomorrow</div>
                </div>
                <div className="task-item" style={{ 
                  padding: '0.5vmin',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '0.5vmin',
                  borderLeft: '3px solid #22c55e'
                }}>
                  <div className="text-sm font-semibold">Quarterly review</div>
                  <div className="text-xs text-muted">Next week</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4>System Status</h4>
            </div>
            <div className="card-body">
              <div className="status-list">
                <div className="status-item mb-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-sm">Database</span>
                  <span className="status-indicator" style={{ 
                    backgroundColor: '#22c55e', 
                    color: 'white', 
                    padding: '0.2vmin 0.5vmin',
                    borderRadius: '0.3vmin',
                    fontSize: '0.7rem'
                  }}>
                    Online
                  </span>
                </div>
                <div className="status-item mb-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-sm">API Services</span>
                  <span className="status-indicator" style={{ 
                    backgroundColor: '#22c55e', 
                    color: 'white', 
                    padding: '0.2vmin 0.5vmin',
                    borderRadius: '0.3vmin',
                    fontSize: '0.7rem'
                  }}>
                    Online
                  </span>
                </div>
                <div className="status-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-sm">Backup System</span>
                  <span className="status-indicator" style={{ 
                    backgroundColor: '#f59e0b', 
                    color: 'white', 
                    padding: '0.2vmin 0.5vmin',
                    borderRadius: '0.3vmin',
                    fontSize: '0.7rem'
                  }}>
                    Syncing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
