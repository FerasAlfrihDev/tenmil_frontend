import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FooterSection } from '../../layouts/PublicLayout';

const LoginPage: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { tenant } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Fake login
    login({
      id: 1,
      name: isAdmin ? 'Platform Admin' : 'Tenant User',
      email,
      role: isAdmin ? 'admin' : 'user'
    });

    navigate('/');
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center bg-light min-vh-100 min-vw-100">
      {/* Brand */}
      <div className="text-center mb-4">
        <h1 className="text-primary fw-bold">Tenmil</h1>
        <h1 className="text-muted">
          {isAdmin 
            ? 'Platform Admin Login' 
            : tenant?.name 
              ? `${tenant.name} Login`
              : 'Tenant Login'
          }
        </h1>
      </div>

      {/* Login Card */}
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
      <FooterSection/>
    </div>
  );
};

export default LoginPage;
