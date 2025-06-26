import React, { useState } from 'react';
import authService from '../../services/authService';

export default function UserSignup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(form.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      await authService.userRegister({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      });
      
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/user/login';
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authContainer}>
        <div style={styles.authCard}>
          <a href="/" style={styles.backLink}>
            <span>←</span> Back to Home
          </a>
          
          <div style={styles.authHeader}>
            <h2>Create Your Account</h2>
            <p>Join thousands of users making their voices heard</p>
          </div>
          
          {message && (
            <div style={message.includes('successful') ? styles.successMessage : styles.errorMessage}>
              {message}
            </div>
          )}
          
          <div style={styles.formContainer}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                style={errors.name ? { ...styles.formControl, ...styles.formControlError } : styles.formControl}
                placeholder="John Doe"
                required
              />
              {errors.name && <span style={styles.errorText}>{errors.name}</span>}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={errors.email ? { ...styles.formControl, ...styles.formControlError } : styles.formControl}
                placeholder="you@example.com"
                required
              />
              {errors.email && <span style={styles.errorText}>{errors.email}</span>}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                style={errors.phone ? { ...styles.formControl, ...styles.formControlError } : styles.formControl}
                placeholder="+91 98765 43210"
                required
              />
              {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                style={errors.password ? { ...styles.formControl, ...styles.formControlError } : styles.formControl}
                placeholder="Create a strong password"
                required
              />
              {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                style={errors.confirmPassword ? { ...styles.formControl, ...styles.formControlError } : styles.formControl}
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
            </div>
            
            <div style={styles.termsCheckbox}>
              <input type="checkbox" id="terms" style={styles.checkbox} required />
              <label htmlFor="terms" style={styles.checkboxLabel}>
                I agree to the <a href="/terms" style={styles.link}>Terms of Service</a> and{' '}
                <a href="/privacy" style={styles.link}>Privacy Policy</a>
              </label>
            </div>
            
            <button 
              onClick={handleSubmit}
              style={styles.btnPrimary}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <div style={styles.divider}>
              <span style={styles.dividerText}>OR</span>
            </div>
            
            <div style={styles.authFooter}>
              Already have an account? <a href="/user/login" style={styles.loginLink}>Login</a>
            </div>
            
            <div style={styles.brandCTA}>
              <p>Are you a brand?</p>
              <a href="/brand/login" style={styles.brandLink}>Register your business →</a>
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
    maxWidth: '480px',
    margin: '20px',
  },
  authCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
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
  successMessage: {
    background: '#d4edda',
    color: '#155724',
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
  formControlError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block',
  },
  termsCheckbox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    marginBottom: '20px',
  },
  checkbox: {
    marginTop: '3px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: 1.5,
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
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
  divider: {
    textAlign: 'center',
    margin: '25px 0',
    position: 'relative',
  },
  dividerText: {
    background: 'white',
    padding: '0 10px',
    color: '#6c757d',
    fontSize: '14px',
    position: 'relative',
    zIndex: 1,
  },
  authFooter: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6c757d',
  },
  loginLink: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '600',
  },
  brandCTA: {
    textAlign: 'center',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e9ecef',
    fontSize: '14px',
    color: '#6c757d',
  },
  brandLink: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '600',
  },
};