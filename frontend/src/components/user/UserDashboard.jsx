import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import ticketService from '../../services/ticketService';
import authService from '../../services/authService';

export default function UserDashboard() {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [rating, setRating] = useState(0);

  // Debug: Log user data
  useEffect(() => {
    console.log('Current user in dashboard:', user);
  }, [user]);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await ticketService.listTickets();
      setTickets(data);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  // Add to UserDashboard.jsx for actual voice recording
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];
    
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      await ticketService.uploadVoiceComplaint(blob, { 
        brand_id: selectedBrand,
        channel: 'voice'
      });
    };
    
    mediaRecorder.start();
    setMediaRecorder(mediaRecorder);
  } catch (error) {
    console.error('Failed to start recording:', error);
  }
};


 // Add WebSocket service
const websocketService = {
  connect: (userId) => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle real-time updates
      if (data.type === 'ticket_update') {
        // Update ticket in UI
      }
    };
    
    return ws;
  }
};

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording logic
      console.log('Starting recording...');
    } else {
      // Stop recording logic
      console.log('Stopping recording...');
      alert('Recording saved! Your complaint will be processed.');
      setShowVoiceModal(false);
    }
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const submitRating = async () => {
    if (selectedTicket && rating > 0) {
      try {
        await ticketService.rateTicket(selectedTicket.id, rating, '');
        alert('Thank you for your feedback!');
        setShowRatingModal(false);
        setRating(0);
        loadTickets();
      } catch (error) {
        console.error('Failed to submit rating:', error);
      }
    }
  };

  const getStatusBadgeStyle = (status) => {
    const baseStyle = {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
    };

    switch (status) {
      case 'progress':
        return { ...baseStyle, background: '#cce5ff', color: '#004085' };
      case 'resolved':
        return { ...baseStyle, background: '#d4edda', color: '#155724' };
      case 'new':
        return { ...baseStyle, background: '#fff3cd', color: '#856404' };
      default:
        return baseStyle;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.logo}>ComplaintHub</div>
          <div style={styles.headerNav}>
            <div style={styles.notificationBell}>
              🔔 <span style={styles.notificationBadge}>3</span>
            </div>
            <div style={styles.userMenu}>
              <div style={styles.userName}>
                {user ? `Hello, ${user.name}` : "Loading..."}
              </div>
              <button style={styles.btnSecondary}>Settings</button>
              <button onClick={handleLogout} style={styles.btnPrimary}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.mainContent}>
        <div style={styles.welcomeSection}>
          <h1>Welcome back, {user?.name || 'User'}!</h1>
          <p>Track and manage all your complaints in one place</p>
        </div>

        <div style={styles.actionButtons}>
          <button 
            style={styles.btnLarge} 
            onClick={() => setShowVoiceModal(true)}
          >
            📞 New Voice Complaint
          </button>
          <button style={styles.btnLarge}>
            💬 New Chat Complaint
          </button>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>8</div>
            <div style={styles.statLabel}>Total Complaints</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>5</div>
            <div style={styles.statLabel}>Resolved</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>2</div>
            <div style={styles.statLabel}>In Progress</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>1</div>
            <div style={styles.statLabel}>Pending</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Recent Activity</h3>
            <a href="/user/tickets" style={styles.btnSecondary}>View All</a>
          </div>

          {loading ? (
            <p>Loading tickets...</p>
          ) : (
            <table style={styles.dataTable}>
              <thead>
                <tr>
                  <th style={styles.th}>Ticket ID</th>
                  <th style={styles.th}>Brand</th>
                  <th style={styles.th}>Issue</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} style={styles.tr}>
                    <td style={styles.td}>#{ticket.id}</td>
                    <td style={styles.td}>{ticket.brand_name || 'Unknown'}</td>
                    <td style={styles.td}>{ticket.description.substring(0, 50)}...</td>
                    <td style={styles.td}>
                      <span style={getStatusBadgeStyle(ticket.status)}>
                        {ticket.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>
                      {ticket.status === 'resolved' ? (
                        <button 
                          style={styles.btnPrimary}
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowRatingModal(true);
                          }}
                        >
                          Rate
                        </button>
                      ) : (
                        <a href={`/user/ticket/${ticket.id}`} style={styles.btnPrimary}>
                          View
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Voice Modal */}
      {showVoiceModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>🎤 Record Your Complaint</h3>
              <button 
                style={styles.modalClose}
                onClick={() => setShowVoiceModal(false)}
              >
                ×
              </button>
            </div>
            
            <p>Click the button below to start recording your complaint. Speak clearly and include:</p>
            <ul style={{ margin: '20px 0', paddingLeft: '20px' }}>
              <li>Brand name</li>
              <li>Product/Service details</li>
              <li>Description of the issue</li>
              <li>What resolution you expect</li>
            </ul>
            
            <button 
              style={isRecording ? styles.btnRecordActive : styles.btnRecord}
              onClick={toggleRecording}
            >
              {isRecording ? '⏹\nStop Recording' : '🎤\nStart Recording'}
            </button>
            
            <p style={{ textAlign: 'center', color: '#6c757d' }}>
              Maximum recording time: 3 minutes
            </p>
            
            <div style={styles.tollFreeSection}>
              <p style={{ textAlign: 'center' }}>Need help? Call our toll-free number:</p>
              <p style={styles.tollFreeNumber}>1-800-COMPLAIN</p>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Rate Your Experience</h3>
              <button 
                style={styles.modalClose}
                onClick={() => {
                  setShowRatingModal(false);
                  setRating(0);
                }}
              >
                ×
              </button>
            </div>
            
            <p>How satisfied are you with the resolution of your complaint?</p>
            
            <div style={styles.starRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleRating(star)}
                  style={{
                    ...styles.star,
                    color: star <= rating ? '#f39c12' : '#ccc',
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: '10px', color: '#6c757d' }}>
              (Click to rate)
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={styles.label}>Tell us more (Optional)</label>
              <textarea 
                style={styles.textarea}
                rows="3"
                placeholder="Your feedback helps brands improve..."
              />
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <button 
                style={{ ...styles.btnSecondary, marginRight: '10px' }}
                onClick={() => {
                  setShowRatingModal(false);
                  setRating(0);
                }}
              >
                Skip
              </button>
              <button 
                style={styles.btnPrimary}
                onClick={submitRating}
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
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
    padding: '15px 0',
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
  headerNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  notificationBell: {
    position: 'relative',
    cursor: 'pointer',
    fontSize: '20px',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    background: '#e74c3c',
    color: 'white',
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '10px',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userName: {
    fontWeight: '600',
    color: '#2c3e50',
    marginRight: '15px',
    fontSize: '15px',
  },
  mainContent: {
    marginTop: '80px',
    padding: '20px',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  welcomeSection: {
    marginBottom: '30px',
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
  },
  btnLarge: {
    padding: '12px 24px',
    fontSize: '16px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '5px',
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  section: {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    marginBottom: '20px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
  },
  dataTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    background: '#f8f9fa',
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#495057',
    borderBottom: '2px solid #dee2e6',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #dee2e6',
  },
  tr: {
    transition: 'background 0.2s',
  },
  btnPrimary: {
    padding: '8px 16px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  btnSecondary: {
    padding: '8px 16px',
    background: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  modal: {
    display: 'flex',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.5)',
    zIndex: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#6c757d',
    cursor: 'pointer',
  },
  btnRecord: {
    padding: '20px 40px',
    fontSize: '18px',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '150px',
    height: '150px',
    margin: '20px auto',
    display: 'block',
    cursor: 'pointer',
    transition: 'all 0.3s',
    whiteSpace: 'pre-line',
    textAlign: 'center',
  },
  btnRecordActive: {
    padding: '20px 40px',
    fontSize: '18px',
    background: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '150px',
    height: '150px',
    margin: '20px auto',
    display: 'block',
    cursor: 'pointer',
    animation: 'pulse 1.5s infinite',
    whiteSpace: 'pre-line',
    textAlign: 'center',
  },
  tollFreeSection: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #dee2e6',
  },
  tollFreeNumber: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: '700',
    color: '#3498db',
  },
  starRating: {
    textAlign: 'center',
    margin: '30px 0',
    fontSize: '36px',
    cursor: 'pointer',
  },
  star: {
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '600',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
  },
};