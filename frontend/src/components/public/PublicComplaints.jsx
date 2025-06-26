import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ticketService from '../../services/ticketService';

export default function PublicComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadComplaints();
  }, [currentPage, selectedBrand, sortBy]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * itemsPerPage;
      const data = await ticketService.getPublicComplaints(skip, itemsPerPage);
      setComplaints(data);
    } catch (error) {
      console.error('Failed to load complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const days = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <Link to="/" style={styles.logo}>ComplaintHub</Link>
          <div style={styles.navButtons}>
            <Link to="/user/login" style={styles.btnOutline}>Login</Link>
            <Link to="/user/signup" style={styles.btnPrimary}>Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Public Complaints Forum</h1>
        <p style={styles.heroSubtitle}>
          Transparency drives accountability. See unresolved complaints from real consumers.
        </p>
      </section>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Filters */}
        <div style={styles.filterSection}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Filter by Brand:</label>
            <select 
              style={styles.filterSelect}
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="all">All Brands</option>
              <option value="tech">Tech Companies</option>
              <option value="retail">Retail</option>
              <option value="services">Services</option>
            </select>
          </div>
          
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Sort by:</label>
            <select 
              style={styles.filterSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest Unresolved</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Complaints List */}
        {loading ? (
          <div style={styles.loading}>Loading complaints...</div>
        ) : (
          <div style={styles.complaintsGrid}>
            {complaints.map((complaint) => (
              <div key={complaint.id} style={styles.complaintCard}>
                <div style={styles.complaintHeader}>
                  <h3 style={styles.brandName}>{complaint.brand_name}</h3>
                  <span style={styles.unresolvedBadge}>
                    Unresolved for {complaint.days_unresolved} days
                  </span>
                </div>
                
                <p style={styles.complaintDescription}>
                  {complaint.description}
                </p>
                
                {complaint.audio_url && (
                  <button 
                    style={styles.playButton}
                    onClick={() => playAudio(complaint.audio_url)}
                  >
                    🔊 Play Voice Complaint
                  </button>
                )}
                
                <div style={styles.complaintFooter}>
                  <span style={styles.location}>📍 {complaint.location}</span>
                  <span style={styles.views}>👁 {complaint.views} views</span>
                  <span style={styles.date}>{getTimeAgo(complaint.created_at)}</span>
                </div>
                
                <div style={styles.actions}>
                  <button style={styles.shareButton}>Share</button>
                  <button style={styles.supportButton}>Support</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div style={styles.pagination}>
          <button 
            style={styles.pageButton}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span style={styles.pageInfo}>Page {currentPage}</span>
          <button 
            style={styles.pageButton}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={complaints.length < itemsPerPage}
          >
            Next
          </button>
        </div>

        {/* CTA Section */}
        <div style={styles.ctaSection}>
          <h2>Have a complaint?</h2>
          <p>Join thousands who are getting their voices heard</p>
          <Link to="/user/signup" style={styles.ctaButton}>
            Submit Your Complaint
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&copy; 2024 ComplaintHub. Making brands accountable.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: '#f5f5f5',
    minHeight: '100vh',
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
    textDecoration: 'none',
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
  },
  btnPrimary: {
    padding: '10px 20px',
    background: '#3498db',
    color: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
  },
  hero: {
    background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    color: 'white',
    padding: '120px 20px 60px',
    textAlign: 'center',
    marginTop: '80px',
  },
  heroTitle: {
    fontSize: '36px',
    marginBottom: '15px',
  },
  heroSubtitle: {
    fontSize: '18px',
    opacity: 0.9,
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  filterSection: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  filterLabel: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  filterSelect: {
    padding: '8px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    background: 'white',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '18px',
    color: '#7f8c8d',
  },
  complaintsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  complaintCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  complaintHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  brandName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2c3e50',
    margin: 0,
  },
  unresolvedBadge: {
    background: '#e74c3c',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  complaintDescription: {
    color: '#495057',
    lineHeight: 1.6,
    marginBottom: '15px',
  },
  playButton: {
    background: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '15px',
    fontWeight: '600',
  },
  complaintFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#7f8c8d',
    marginBottom: '15px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  location: {},
  views: {},
  date: {},
  actions: {
    display: 'flex',
    gap: '10px',
  },
  shareButton: {
    flex: 1,
    padding: '8px 16px',
    border: '1px solid #ddd',
    background: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  supportButton: {
    flex: 1,
    padding: '8px 16px',
    background: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '60px',
  },
  pageButton: {
    padding: '10px 20px',
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  pageInfo: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  ctaSection: {
    background: 'white',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  ctaButton: {
    display: 'inline-block',
    padding: '12px 30px',
    background: '#3498db',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    marginTop: '20px',
  },
  footer: {
    background: '#2c3e50',
    color: 'white',
    padding: '30px 20px',
    textAlign: 'center',
  },
};