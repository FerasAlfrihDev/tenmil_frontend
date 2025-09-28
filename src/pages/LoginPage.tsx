import React, { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Form from '../components/ui/Form';
import Input from '../components/ui/Input';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import './LoginPage.scss';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: userState, login } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Redirect if already authenticated
  useEffect(() => {
    if (userState.isAuthenticated && !userState.requiresPasswordChange) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else if (userState.isAuthenticated && userState.requiresPasswordChange) {
      navigate('/change-password', { replace: true });
    }
  }, [userState.isAuthenticated, userState.requiresPasswordChange, navigate, location]);

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(formData);
      
      if (result.success) {
        if (result.requiresPasswordChange) {
          navigate('/change-password');
        } else {
          // Navigate to the intended destination or dashboard
          const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
          navigate(from);
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
          </div>
          <h2 className="login-title">Sign In</h2>
          <p className="login-subtitle">Welcome back! Please sign in to your account.</p>
        </div>

        <div className="login-form-wrapper">
          <Form
            onSubmit={handleSubmit}
            submitText="Sign In"
            loading={loading}
            disabled={loading}
            showSubmit={true}
            className="login-form"
          >
            <Input
              type="email"
              label="Username / Email"
              placeholder="Enter your username or email"
              value={formData.email}
              onChange={handleInputChange('email')}
              required
              fullWidth
              size="large"
              startIcon={<User size={20} />}
              disabled={loading}
            />

            <Input
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange('password')}
              required
              fullWidth
              size="large"
              startIcon={<Lock size={20} />}
              endIcon={
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
              disabled={loading}
            />

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}
          </Form>
        </div>

        <div className="login-footer">
          <p className="login-footer-text">
            Secure access to your Tenmil account
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
