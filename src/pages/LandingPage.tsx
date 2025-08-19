import { useState } from 'react'
import { 
  Building, 
  Shield, 
  ArrowRight, 
  CheckCircle, 
  Wrench,
  BarChart3,
  Clock
} from 'lucide-react'

const LandingPage = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const features = [
    {
      icon: Wrench,
      title: "Asset Management",
      description: "Track and maintain your equipment with precision"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Data-driven insights for optimal performance"
    },
    {
      icon: Clock,
      title: "Real-time Monitoring",
      description: "Stay updated with live system status"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security for your sensitive data"
    }
  ]

  const stats = [
    { number: "10,000+", label: "Assets Managed" },
    { number: "500+", label: "Companies Trust Us" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "24/7", label: "Support Available" }
  ]

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="logo-section">
          <div className="logo-icon">
            <Building size={20} color="white" />
          </div>
          <h1 className="logo-text">
            Tenmil
          </h1>
        </div>
        
        <div className="header-actions">
          <a 
            href="http://admin.localhost:5174" 
            className="btn admin-portal-btn"
          >
            Admin Portal
          </a>
          <a 
            href="#get-started" 
            className="btn btn-primary get-started-btn"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          The Future of<br />Maintenance Management
        </h1>
        
        <p className="hero-subtitle">
          Streamline your operations with intelligent asset tracking, 
          predictive maintenance, and real-time analytics.
        </p>

        <div className="hero-actions">
          <a 
            href="#get-started" 
            className="btn btn-primary cta-primary"
          >
            Start Free Trial
            <ArrowRight size={18} />
          </a>
          <button className="btn cta-secondary">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">
                {stat.number}
              </div>
              <div className="stat-label">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2 className="features-title">
            Powerful Features for Modern Teams
          </h2>
          <p className="features-subtitle">
            Everything you need to manage your assets and optimize your operations
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div 
                key={index}
                className={`card feature-card ${hoveredCard === feature.title ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(feature.title)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="feature-icon">
                  <IconComponent size={32} color="#0F79BE" />
                </div>
                <h3 className="feature-title">
                  {feature.title}
                </h3>
                <p className="feature-description">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">
            Ready to Transform Your Operations?
          </h2>
          <p className="cta-subtitle">
            Join thousands of companies already using Tenmil to optimize their maintenance workflows
          </p>

          <div className="portal-cards">
            <div className="card portal-card company-portal">
              <h3 className="portal-title">
                <Building color="#0F79BE" size={24} />
                Company Portal
              </h3>
              <p className="portal-description">
                Access your company's maintenance management system
              </p>
              <div>
                <input 
                  type="text" 
                  placeholder="Enter your company subdomain"
                  className="portal-input"
                />
              </div>
              <button 
                className="btn portal-button"
                onClick={() => {
                  const input = document.querySelector('input') as HTMLInputElement
                  const subdomain = input?.value || 'demo'
                  window.location.href = `http://${subdomain}.localhost:5174`
                }}
              >
                Access Portal
              </button>
            </div>

            <div className="card portal-card admin-portal">
              <h3 className="portal-title">
                <Shield color="#FFCF64" size={24} />
                Admin Portal
              </h3>
              <p className="portal-description">
                System administration and company management
              </p>
              <ul className="portal-features">
                <li>
                  <CheckCircle size={16} color="#22c55e" />
                  Manage all companies
                </li>
                <li>
                  <CheckCircle size={16} color="#22c55e" />
                  User administration
                </li>
                <li>
                  <CheckCircle size={16} color="#22c55e" />
                  System settings
                </li>
              </ul>
              <a 
                href="http://admin.localhost:5174"
                className="btn portal-button"
              >
                Admin Login
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-logo">
            <Building size={20} color="#0F79BE" />
            <span>Tenmil</span>
          </div>
          
          <div className="footer-copyright">
            © 2024 Tenmil. All rights reserved.
          </div>
          
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
