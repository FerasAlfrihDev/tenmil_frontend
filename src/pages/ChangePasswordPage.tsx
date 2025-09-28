import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Form from '../components/ui/Form';
import Input from '../components/ui/Input';
import { Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import './ChangePasswordPage.scss';

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, changePassword, logout } = useUser();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validatePassword = (password: string): string | undefined => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return 'Password must contain at least one special character (@$!%*?&)';
    }
    return undefined;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    const errors: typeof validationErrors = {};
    
    if (!formData.currentPassword) {
      setError('Please enter your current password');
      return;
    }
    
    if (!formData.newPassword) {
      setError('Please enter a new password');
      return;
    }
    
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      errors.newPassword = passwordError;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.currentPassword === formData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await changePassword(formData.currentPassword, formData.newPassword);
      
      if (result.success) {
        // Navigate to dashboard after successful password change
        navigate('/');
      } else {
        setError(result.message || 'Failed to change password');
      }
    } catch (err: any) {
      console.error('Change password error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="change-password-page">
      <div className="change-password-container">
        <div className="change-password-header">
          <div className="change-password-icon">
            <AlertTriangle size={48} className="warning-icon" />
          </div>
          <h2 className="change-password-title">Password Change Required</h2>
          <p className="change-password-subtitle">
            For security reasons, you must change your password before continuing.
          </p>
          {state.user && (
            <p className="change-password-user">
              Welcome, <strong>{state.user.name}</strong>
            </p>
          )}
        </div>

        <div className="change-password-form-wrapper">
          <Form
            onSubmit={handleSubmit}
            submitText="Change Password"
            loading={loading}
            disabled={loading}
            showSubmit={true}
            showCancel={true}
            cancelText="Logout"
            onCancel={handleLogout}
            className="change-password-form"
          >
            <Input
              type={showPasswords.current ? 'text' : 'password'}
              label="Current Password"
              placeholder="Enter your current password"
              value={formData.currentPassword}
              onChange={handleInputChange('currentPassword')}
              required
              fullWidth
              size="large"
              startIcon={<Lock size={20} />}
              endIcon={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="password-toggle"
                  disabled={loading}
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
              disabled={loading}
            />

            <Input
              type={showPasswords.new ? 'text' : 'password'}
              label="New Password"
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={handleInputChange('newPassword')}
              required
              fullWidth
              size="large"
              startIcon={<Lock size={20} />}
              endIcon={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="password-toggle"
                  disabled={loading}
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
              error={validationErrors.newPassword}
              disabled={loading}
            />

            <Input
              type={showPasswords.confirm ? 'text' : 'password'}
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              required
              fullWidth
              size="large"
              startIcon={<Lock size={20} />}
              endIcon={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="password-toggle"
                  disabled={loading}
                >
                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
              error={validationErrors.confirmPassword}
              disabled={loading}
            />

            {error && (
              <div className="change-password-error">
                {error}
              </div>
            )}
          </Form>
        </div>

        <div className="change-password-requirements">
          <h4>Password Requirements:</h4>
          <ul>
            <li>At least 8 characters long</li>
            <li>Contains at least one lowercase letter (a-z)</li>
            <li>Contains at least one uppercase letter (A-Z)</li>
            <li>Contains at least one number (0-9)</li>
            <li>Contains at least one special character (@$!%*?&)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
