import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

export default function BrandSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    brandName: '',
    email: '',
    supportEmail: '',
    phone: '',
    contactPerson: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      // Note: This endpoint needs to be implemented in backend
      await authService.brandSignup({
        brand_name: form.brandName,
        email: form.email,
        support_email: form.supportEmail,
        phone: form.phone,
        contact_person: form.contactPerson,
        password: form.password
      });

      alert('Brand registered successfully! Please login with your credentials.');
      navigate('/brand/login');
    } catch (error) {
      setError(error.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authContainer}>
        <div style={styles.authCard}>
          <span style={styles.businessBadge}>BRAND REGISTRATION</span>
          
          <Link to="/" style={styles.backLink}>
            <span>←</span> Back to Home
          </Link>
          
          <div style={styles.authHeader}>
            <h2>Register Your Brand</h2>
            <p>Join ComplaintHub to manage customer feedback effectively</p>
          </div>
          
          {error && (
            <div style={styles.errorMessage}>
              <span>⚠️</span> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Brand Name</label>
                <input
                  type="text"
                  name="brandName"
                  value={form.brandName}
                  onChange={handleChange}
                  style={styles.formControl}
                  placeholder="Your Company Name"
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Contact Person</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                  style={styles.formControl}
                  placeholder="Full Name"
                  required
                />
              </div>
            </div>
            
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Business Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  style={styles.formControl}
                  placeholder="admin@company.com"
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Support Email</label>
                <input
                  type="email"
                  name="supportEmail"
                  value={form.supportEmail}
                  onChange={handleChange}
                  style={styles.formControl}
                  placeholder="support@company.com"
                  required
                />
              </div>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Business Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                style={styles.formControl}
                placeholder="+1-XXX-XXX-XXXX"
                required
              />
            </div>
            
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  style={styles.formControl}
                  placeholder="Min 8 characters"
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  style={styles.formControl}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
            
            <div style={styles.features}>
              <h3 style={styles.featuresTitle}>What you'll get:</h3>
              <ul style={styles.featuresList}>
                <li>✓ AI-powered complaint management system</li>
                <li>✓ Multi-channel support (Voice, WhatsApp, Web)</li>
                <li>✓ Real-time analytics and insights</li>
                <li>✓ CRM integration capabilities</li>
                <li>✓ 24-hour free resolution window</li>
              </ul>
            </div>
            
            <div style={styles.terms}>
              <input type="checkbox" id="terms" required style={styles.checkbox} />
              <label htmlFor="terms" style={styles.termsLabel}>
                I agree to the <Link to="/terms" style={styles.link}>Terms of Service</Link> and{' '}
                <Link to="/privacy" style={styles.link}>Privacy Policy</Link>
              </label>
            </div>
            
            <button 
              type="submit" 
              style={styles.btnPrimary}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register Brand'}
            </button>
          </form>
          
          <div style={styles.authFooter}>
            Already registered? <Link to="/brand/login" style={styles.link}>Login here</Link>
          </div>
          
          <div style={styles.securityInfo}>
            🔒 Enterprise-grade Security • SSL Encrypted • GDPR Compliant
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: '20px',
  },
  authContainer: {
    width: '100%',
    maxWidth: '600px',
  },
  authCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
  },
  businessBadge: {
    background: '#667eea',
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
    color: '#667eea',
    textDecoration: 'none',
    marginBottom: '30px',
    fontSize: '14px',
  },
  authHeader: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  errorMessage: {
    background: '#fee',
    color: '#c33',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  form: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formLabel: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '14px',
  },
  formControl: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e1e8ed',
    borderRadius: '8px',
    fontSize: '15px',
    transition: 'all 0.3s',
    outline: 'none',
    backgroundColor: '#f8f9fa',
    boxSizing: 'border-box',
  },
  features: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  featuresTitle: {
    fontSize: '16px',
    marginBottom: '10px',
    color: '#2c3e50',
  },
  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    color: '#495057',
    fontSize: '14px',
    lineHeight: '1.8',
  },
  terms: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    marginBottom: '20px',
  },
  checkbox: {
    marginTop: '4px',
    cursor: 'pointer',
  },
  termsLabel: {
    fontSize: '14px',
    color: '#7f8c8d',
    lineHeight: '1.5',
  },
  btnPrimary: {
    width: '100%',
    padding: '14px 24px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  authFooter: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#7f8c8d',
    marginTop: '20px',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
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