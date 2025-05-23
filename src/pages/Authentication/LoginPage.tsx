// pages/public/LoginPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FooterSection } from '../../layouts/PublicLayout';
import { apiCall } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const { tenant } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const res = await apiCall<any>('/users/login', 'POST', JSON.stringify({
        email,
        password,
        is_admin: isAdmin,
      }));
      
      // Store tokens
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      
      // Redirect back to next page or home
      const next = new URLSearchParams(window.location.search).get('next');
      const safeNext = next && next.startsWith('/') ? next : '/';
      navigate(safeNext);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center bg-light min-vh-100 min-vw-100">
      <div className="text-center mb-4">
        <h1 className="text-primary fw-bold">Tenmil</h1>
        <h1 className="text-muted">
          {isAdmin
            ? 'Platform Admin Login'
            : tenant?.name
              ? `${tenant.name} Login`
              : 'Tenant Login'}
        </h1>
      </div>

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

          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
      <FooterSection />
    </div>
  );
};

export default LoginPage;
