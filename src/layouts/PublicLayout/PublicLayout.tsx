import React, { useEffect } from 'react';
import TenMilImg from '../../assets/img/10mm.png';
import FooterSection from './FooterSection';

const PublicLayout: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    });

    const elements = document.querySelectorAll('.fade-in-up');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">
      {/* Hero Section */}
      <header className="row flex-grow-1 align-items-center justify-content-center text-center hero-gradient">
        <div className="col-md-8">
          <h1 className="display-4 fw-bold mb-4">
            Simplify Your Maintenance Operations
          </h1>
          <h5 className="mb-4">
            Tenmil CMMS — precision maintenance at your fingertips.
          </h5>
          <a href="mailto:contact@tenmil.com" className="btn btn-warning btn-lg">
            Request a Demo
          </a>
        </div>
      </header>
      {/* Features Section */}
      <section className="container py-5 fade-in-up bg-light" id="features">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6 text-warning">Why Choose Tenmil?</h2>
          <p className="text-muted fs-5">Reliable maintenance management, precision-crafted for you.</p>
        </div>

        <div className="row">
          {/* Feature 1 */}
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 hover-lift">
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-gear-fill fs-1 text-primary"></i> {/* Bootstrap Icon */}
                </div>
                <h5 className="card-title fw-bold mb-3">Asset Management</h5>
                <p className="card-text text-muted">
                  Keep full control over your assets and extend their operational life with smart tracking.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 hover-lift">
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-tools fs-1 text-primary"></i>
                </div>
                <h5 className="card-title fw-bold mb-3">Work Orders</h5>
                <p className="card-text text-muted">
                  Create, assign, and monitor work orders efficiently to maximize team productivity.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 hover-lift">
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-bar-chart-line-fill fs-1 text-primary"></i>
                </div>
                <h5 className="card-title fw-bold mb-3">Reporting & Insights</h5>
                <p className="card-text text-muted">
                  Unlock insights with detailed reports to drive smarter, faster maintenance decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section className="container py-5 fade-in-up bg-light" id="pricing">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6 text-warning">Pricing Plans</h2>
          <p className="text-muted fs-5">Choose a plan that's right for your team.</p>
        </div>

        <div className="row g-4">
          {/* Starter Plan */}
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 text-center">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">Starter</h5>
                <h6 className="card-price my-3">$0/month</h6>
                <p className="card-text text-secondary mb-4">Perfect for small teams starting out.</p>
                <a href="#" className="btn btn-outline-primary mt-auto">Get Started</a>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-primary border-2 text-center">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-primary">Pro</h5>
                <h6 className="card-price my-3">$49/month</h6>
                <p className="card-text text-secondary mb-4">For growing teams that need more power.</p>
                <a href="#" className="btn btn-primary mt-auto">Choose Pro</a>
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 text-center">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">Enterprise</h5>
                <h6 className="card-price my-3">Custom</h6>
                <p className="card-text text-secondary mb-4">Tailored solutions for complex operations.</p>
                <a href="#" className="btn btn-outline-primary mt-auto">Contact Sales</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Story Section */}
      <section className="container py-5 fade-in-up bg-light" id="story">
        <div className="row align-items-center g-5">
          <div className="col-md-6">
            <img
              src={TenMilImg} 
              alt="Lost 10mm Wrench"
              className="img-fluid rounded"
            />
          </div>

          <div className="col-md-6">
            <h2 className="fw-bold display-6 text-warning">Why "Tenmil"?</h2>
            <p className="text-muted fs-5 mb-4">
              If you've ever worked with tools, you know the legendary story — the 10mm socket, 
              the wrench that always goes missing when you need it most.
            </p>
            <p className="text-muted fs-5 mb-4">
              That small, missing piece can delay an entire project. 
              In maintenance management, it's the same: small oversights cause big headaches.
            </p>
            <p className="text-muted fs-5">
              <strong>Tenmil CMMS</strong> was built to bring order to the chaos. 
              We help you track, organize, and maintain — so nothing essential goes missing again.
            </p>
          </div>
        </div>
      </section>
      {/* Contact CTA Section */}
      <section className="contact-us-section text-white text-center py-5 fade-in-up" id="contact">
        <div className="container">
          <h2 className="fw-bold mb-4 text-warning">Ready to Take Control of Your Maintenance?</h2>
          <p className="mb-4 fs-5 text-light">
            Join the teams that trust Tenmil to streamline their operations.
          </p>
          <a href="mailto:contact@tenmil.com" className="btn btn-warning btn-lg px-5">
            Contact Us
          </a>
        </div>
      </section>
      {/* Footer Section */}
      <FooterSection/>
    </div>
  );
};

export default PublicLayout;