import React from 'react';
import { Link } from 'react-router-dom';
import NotFoundImg from '../assets/img/404.webp'

const NotFoundPage: React.FC = () => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '100vh' }}>
      
      {/* Illustration */}
      <img 
        src={NotFoundImg}
        alt="Page Not Found Illustration"
        className="img-fluid mb-4"
        style={{ maxWidth: '300px' }}
      />

      {/* Text */}
      <h1 className="display-4 text-primary mb-3 fade-in-up-404">404 - Page Not Found</h1>
      <p className="text-muted fs-5 mb-4 fade-in-up-404">We couldn't find what you were looking for.</p>

      {/* Action Buttons */}
      <div className="d-flex gap-3">
        <Link to="/" className="btn btn-primary btn-lg">Go Home</Link>
        <a href="mailto:contact@tenmil.com" className="btn btn-outline-primary btn-lg">Contact Support</a>
      </div>
    </div>
  );
};

export default NotFoundPage;
