import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function UserLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/user/dashboard", { replace: true });
    } catch (e) {
      setError(e.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authContainer}>
        <div style={styles.authCard}>
          <Link to="/" style={styles.backLink}>
            <span>&larr;</span> Back to Home
          </Link>
          
          <div style={styles.logoSection}>
            <div style={styles.logo}>ComplaintHub</div>
            <p style={styles.tagline}>Voice Your Concerns</p>
          </div>
          
          <div style={styles.authHeader}>
            <h2 style={styles.title}>Welcome Back</h2>
            <p style={styles.subtitle}>Login to track and manage your complaints</p>
          </div>
          
          {error && (
            <div style={styles.errorMessage}>
              <span style={styles.errorIcon}>⚠️</span> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel} htmlFor="email">
                Email Address
              </label>
              <input
                style={styles.formControl}
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel} htmlFor="password">
                Password
              </label>
              <input
                style={styles.formControl}
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <Link to="/forgot-password" style={styles.forgotLink}>
                Forgot Password?
              </Link>
            </div>
            
            <button 
              type="submit" 
              style={styles.btnPrimary}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div style={styles.divider}>
            <span style={styles.dividerText}>OR</span>
          </div>
          
          <div style={styles.socialLogin}>
            <button style={styles.socialBtn}>
              <span>📱</span> Continue with Phone
            </button>
          </div>
          
          <div style={styles.authFooter}>
            Don't have an account? <Link to="/user/signup" style={styles.link}>Sign up</Link>
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
    background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: '20px',
  },
  authContainer: {
    width: '100%',
    maxWidth: '440px',
  },
  authCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#3498db',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '30px',
    transition: 'all 0.3s',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  logo: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#3498db',
    marginBottom: '5px',
  },
  tagline: {
    color: '#7f8c8d',
    fontSize: '14px',
  },
  authHeader: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '24px',
    color: '#2c3e50',
    marginBottom: '8px',
    fontWeight: '700',
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '15px',
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
  errorIcon: {
    fontSize: '16px',
  },
  form: {
    marginBottom: '20px',
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
  forgotLink: {
    display: 'block',
    textAlign: 'right',
    marginTop: '8px',
    fontSize: '14px',
    color: '#3498db',
    textDecoration: 'none',
  },
  btnPrimary: {
    width: '100%',
    padding: '14px 24px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '10px',
  },
  divider: {
    textAlign: 'center',
    position: 'relative',
    margin: '25px 0',
  },
  dividerText: {
    background: 'white',
    padding: '0 15px',
    color: '#95a5a6',
    fontSize: '14px',
    position: 'relative',
    display: 'inline-block',
  },
  socialLogin: {
    marginBottom: '25px',
  },
  socialBtn: {
    width: '100%',
    padding: '12px 24px',
    background: 'white',
    color: '#2c3e50',
    border: '2px solid #e1e8ed',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  authFooter: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#7f8c8d',
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '600',
  },
};