import React, { useState } from 'react';
import authService from '../../services/authService';

export default function BrandLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Note: brandLogin endpoint needs to be implemented in backend
      await authService.brandLogin(form.email, form.password);
      window.location.href = '/brand/dashboard';
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // For demo purposes
    setForm({ email: 'demo@techgiant.com', password: 'demo123' });
    setMessage('Use these demo credentials to explore the brand portal');
  };

  return (
    <div style={styles.container}>
      <div style={styles.authContainer}>
        <div style={styles.authCard}>
          <span style={styles.businessBadge}>BUSINESS PORTAL</span>
          
          <a href="/" style={styles.backLink}>
            <span>←</span> Back to Home
          </a>
          
          <div style={styles.authHeader}>
            <h2>Brand Login</h2>
            <p>Access your business dashboard</p>
          </div>
          
          {message && (
            <div style={styles.errorMessage}>{message}</div>
          )}
          
          <div style={styles.formContainer}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Business Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={styles.formControl}
                placeholder="admin@yourcompany.com"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                style={styles.formControl}
                placeholder="Enter password"
                required
              />
              <a href="/brand/forgot-password" style={styles.forgotLink}>
                Forgot Password?
              </a>
            </div>
            
            <div style={styles.formCheckbox}>
              <input type="checkbox" id="remember" style={styles.checkbox} />
              <label htmlFor="remember" style={styles.checkboxLabel}>
                Remember this device
              </label>
            </div>
            
            <button 
              onClick={handleSubmit}
              style={styles.btnPrimary}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
            
            <div style={styles.helpLinks}>
              <a href="/help" style={styles.helpLink}>Need Help?</a>
              <a href="/contact" style={styles.helpLink}>Contact Support</a>
            </div>
            
            <div style={styles.authFooter}>
              New to ComplaintHub? <a href="/brand/signup" style={styles.signupLink}>Register Your Brand</a>
            </div>
            
            <div style={styles.demoSection}>
              <button onClick={handleDemoLogin} style={styles.demoButton}>
                Load Demo Credentials
              </button>
            </div>
            
            <div style={styles.securityInfo}>
              🔒 Secure Business Portal • Enterprise-grade Security • SSL Encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  authContainer: {
    width: '100%',
    maxWidth: '440px',
    margin: '20px',
  },
  authCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  },
  businessBadge: {
    background: '#3498db',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
    marginBottom: '20px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    color: '#3498db',
    textDecoration: 'none',
    marginBottom: '30px',
    fontSize: '14px',
  },
  authHeader: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  errorMessage: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  formContainer: {
    marginTop: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formLabel: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#495057',
    fontSize: '14px',
  },
  formControl: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'all 0.3s',
  },
  forgotLink: {
    display: 'block',
    textAlign: 'right',
    marginTop: '5px',
    fontSize: '14px',
    color: '#3498db',
    textDecoration: 'none',
  },
  formCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#495057',
    cursor: 'pointer',
  },
  btnPrimary: {
    width: '100%',
    padding: '12px 24px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  helpLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
    fontSize: '14px',
  },
  helpLink: {
    color: '#3498db',
    textDecoration: 'none',
  },
  authFooter: {
    textAlign: 'center',
    marginTop: '25px',
    fontSize: '14px',
    color: '#6c757d',
  },
  signupLink: {
    color: '#3498db',
    textDecoration: 'none',
  },
  demoSection: {
    textAlign: 'center',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #e9ecef',
  },
  demoButton: {
    background: 'transparent',
    border: '1px solid #3498db',
    color: '#3498db',
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  securityInfo: {
    background: '#f8f9fa',
    padding: '15px',
    borderRadius: '6px',
    marginTop: '20px',
    fontSize: '12px',
    color: '#6c757d',
    textAlign: 'center',
  },
};