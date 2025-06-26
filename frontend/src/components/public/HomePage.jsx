import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Add this import
import ticketService from '../../services/ticketService';

export default function HomePage() {
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentComplaints();
  }, []);

  const loadRecentComplaints = async () => {
    try {
      const data = await ticketService.getPublicComplaints(0, 3);
      setRecentComplaints(data);
    } catch (error) {
      console.error('Failed to load complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.logo}>ComplaintHub</div>
          <div style={styles.navButtons}>
            <Link to="/user/login" style={styles.btnOutline}>Login</Link>
            <Link to="/user/signup" style={styles.btnPrimary}>Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Voice Your Concerns</h1>
        <p style={styles.heroSubtitle}>Making Brands Accountable, One Voice at a Time</p>
        <div style={styles.heroButtons}>
          <Link to="/user/signup" style={styles.heroBtnPrimary}>Get Started</Link>
          <button onClick={scrollToFeatures} style={styles.heroBtnSecondary}>How It Works</button>
        </div>
      </section>

      {/* Rest of your component remains the same until CTA Section */}

      {/* CTA Section - Update this part */}
      <section style={styles.cta}>
        <h2>Ready to Make Your Voice Heard?</h2>
        <p style={styles.ctaSubtitle}>Join thousands of consumers who are getting their complaints resolved faster</p>
        <div style={styles.ctaButtons}>
          <Link to="/user/signup" style={styles.ctaBtnPrimary}>Join Now - It's Free</Link>
          <Link to="/brand/login" style={styles.ctaBtnSecondary}>For Brands</Link>
        </div>
      </section>

      {/* Footer - Update the links */}
      <footer style={styles.footer}>
        <div style={styles.footerLinks}>
          <Link to="/about" style={styles.footerLink}>About Us</Link>
          <Link to="/how-it-works" style={styles.footerLink}>How It Works</Link>
          <Link to="/privacy" style={styles.footerLink}>Privacy Policy</Link>
          <Link to="/terms" style={styles.footerLink}>Terms of Service</Link>
          <Link to="/contact" style={styles.footerLink}>Contact</Link>
        </div>
        <p style={styles.copyright}>&copy; 2024 ComplaintHub. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    margin: 0,
    padding: 0,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: '#f5f5f5',
    color: '#2c3e50',
    lineHeight: 1.6,
  },
  header: {
    background: 'white',
    padding: '20px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 100,
  },
  headerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#3498db',
  },
  navButtons: {
    display: 'flex',
    gap: '15px',
  },
  btnOutline: {
    padding: '10px 20px',
    border: '2px solid #3498db',
    borderRadius: '6px',
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s',
  },
  btnPrimary: {
    padding: '10px 20px',
    background: '#3498db',
    color: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s',
  },
  hero: {
    background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
    color: 'white',
    padding: '150px 20px 100px',
    textAlign: 'center',
    marginTop: '80px',
  },
  heroTitle: {
    fontSize: '48px',
    marginBottom: '20px',
    animation: 'fadeInUp 0.8s ease-out',
  },
  heroSubtitle: {
    fontSize: '20px',
    marginBottom: '30px',
    opacity: 0.9,
  },
  heroButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
  },
  heroBtnPrimary: {
    padding: '15px 30px',
    background: 'white',
    color: '#3498db',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s',
  },
  heroBtnSecondary: {
    padding: '15px 30px',
    background: 'transparent',
    color: 'white',
    border: '2px solid white',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  features: {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
  },
  featureCard: {
    background: 'white',
    padding: '40px 30px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s',
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  complaintsSection: {
    background: 'white',
    padding: '80px 20px',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  complaintsContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  complaintCard: {
    background: '#f8f9fa',
    padding: '25px',
    borderRadius: '8px',
    marginBottom: '20px',
    transition: 'all 0.3s',
    border: '1px solid #e9ecef',
  },
  brandName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  complaintSummary: {
    color: '#495057',
    marginBottom: '15px',
    lineHeight: 1.5,
  },
  complaintMeta: {
    display: 'flex',
    gap: '20px',
    fontSize: '14px',
    color: '#7f8c8d',
  },
  stats: {
    background: '#f8f9fa',
    padding: '60px 20px',
    textAlign: 'center',
  },
  statsContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
  },
  statItem: {},
  statValue: {
    fontSize: '36px',
    color: '#3498db',
    marginBottom: '10px',
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: '16px',
  },
  cta: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '80px 20px',
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: '18px',
    marginBottom: '30px',
    opacity: 0.9,
  },
  ctaButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
  },
  ctaBtnPrimary: {
    padding: '15px 30px',
    background: 'white',
    color: '#667eea',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
  },
  ctaBtnSecondary: {
    padding: '15px 30px',
    background: 'transparent',
    color: 'white',
    border: '2px solid white',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
  },
  footer: {
    background: '#2c3e50',
    color: 'white',
    padding: '40px 20px',
    textAlign: 'center',
  },
  footerLinks: {
    display: 'flex',
    gap: '30px',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  footerLink: {
    color: 'white',
    textDecoration: 'none',
    opacity: 0.8,
  },
  copyright: {
    opacity: 0.8,
  },
};