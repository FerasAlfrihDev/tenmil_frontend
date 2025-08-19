import { Clock, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ComingSoonProps {
  pageName: string
  description?: string
  expectedDate?: string
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
  pageName, 
  description = "We're working hard to bring you this feature.",
  expectedDate = "Q2 2024"
}) => {
  return (
    <div className="coming-soon-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center'
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body">
          <div className="coming-soon-icon mb-lg" style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2vmin'
          }}>
            <div style={{
              backgroundColor: 'rgba(100, 108, 255, 0.1)',
              color: '#646cff',
              padding: '2vmin',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={48} />
            </div>
          </div>
          
          <h1 className="text-xl mb-base">{pageName}</h1>
          <h2 className="text-lg mb-lg" style={{ color: 'rgba(100, 108, 255, 0.8)' }}>Coming Soon</h2>
          
          <p className="text-base mb-lg text-muted">{description}</p>
          
          <div className="mb-lg">
            <div className="text-sm text-muted mb-xs">Expected Release</div>
            <div className="text-base font-semibold">{expectedDate}</div>
          </div>
          
          <div className="coming-soon-actions">
            <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              <ArrowLeft size={16} style={{ marginRight: '0.5vmin' }} />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="mt-lg">
            <p className="text-xs text-muted">
              Want to be notified when this feature is ready? 
              <br />
              <strong>Contact your system administrator</strong>
            </p>
          </div>
        </div>
      </div>
      
      {/* Additional info section */}
      <div className="mt-lg" style={{ maxWidth: '400px' }}>
        <div className="card">
          <div className="card-body">
            <h4 className="mb-base">What's Coming</h4>
            <ul className="text-sm text-muted" style={{ 
              listStyle: 'none', 
              padding: 0,
              lineHeight: '1.6'
            }}>
              <li style={{ marginBottom: '0.5vmin' }}><p>✨ Modern, intuitive interface</p></li>
              <li style={{ marginBottom: '0.5vmin' }}><p>📊 Advanced analytics and reporting</p></li>
              <li style={{ marginBottom: '0.5vmin' }}><p>🔄 Real-time data synchronization</p></li>
              <li style={{ marginBottom: '0.5vmin' }}><p>📱 Mobile-responsive design</p></li>
              <li><p>🔐 Enhanced security features</p></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon
