import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import brandService from '../../services/brandService';

export default function BrandTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    loadTicket();
  }, [id]);

  const loadTicket = async () => {
    try {
      const data = await ticketService.getTicket(id);
      setTicket(data);
      setStatus(data.status);
      setAssignedTo(data.assigned_to || '');
    } catch (error) {
      console.error('Failed to load ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await ticketService.updateTicketStatus(id, status);
      alert('Status updated successfully!');
      loadTicket();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const handleAddResponse = async () => {
    if (!response.trim()) return;
    
    try {
      await ticketService.addTicketResponse(id, response);
      setResponse('');
      alert('Response added successfully!');
      loadTicket();
    } catch (error) {
      console.error('Failed to add response:', error);
      alert('Failed to add response');
    }
  };

  const handleAssign = async () => {
    try {
      await brandService.assignTicket(id, assignedTo);
      alert('Ticket assigned successfully!');
      loadTicket();
    } catch (error) {
      console.error('Failed to assign ticket:', error);
      alert('Failed to assign ticket');
    }
  };

  const getTimeRemaining = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const hoursElapsed = Math.floor((now - created) / (1000 * 60 * 60));
    const hoursLeft = 24 - hoursElapsed;
    
    if (hoursLeft <= 0) return { text: 'Charge Applied', color: '#e74c3c' };
    if (hoursLeft <= 3) return { text: `${hoursLeft}h left`, color: '#f39c12' };
    return { text: `${hoursLeft}h left`, color: '#27ae60' };
  };

  const getCategoryIcon = (category) => {
    const icons = {
      complaint: '😠',
      feedback: '💭',
      suggestion: '💡',
      support: '❓',
    };
    return icons[category] || '📋';
  };

  const getSentimentIndicator = (score) => {
    if (score < -0.3) return { text: 'Negative', color: '#e74c3c' };
    if (score > 0.3) return { text: 'Positive', color: '#27ae60' };
    return { text: 'Neutral', color: '#95a5a6' };
  };

  if (loading) {
    return <div style={styles.loading}>Loading ticket details...</div>;
  }

  if (!ticket) {
    return <div style={styles.error}>Ticket not found</div>;
  }

  const timeInfo = ticket.category === 'complaint' ? getTimeRemaining(ticket.created_at) : null;
  const sentiment = getSentimentIndicator(ticket.sentiment_score || 0);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <button 
            onClick={() => navigate('/brand/tickets')}
            style={styles.backButton}
          >
            ← Back to Tickets
          </button>
          <div style={styles.ticketId}>
            Ticket #{ticket.id}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.mainContent}>
        <div style={styles.ticketContainer}>
          {/* Ticket Header */}
          <div style={styles.ticketHeader}>
            <div style={styles.ticketTitleSection}>
              <h1 style={styles.ticketTitle}>
                {getCategoryIcon(ticket.category)} {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
              </h1>
              <div style={styles.ticketMeta}>
                <span>Channel: {ticket.channel}</span>
                <span>•</span>
                <span>Created: {new Date(ticket.created_at).toLocaleString()}</span>
                {timeInfo && ticket.status !== 'resolved' && (
                  <>
                    <span>•</span>
                    <span style={{ color: timeInfo.color }}>
                      {timeInfo.text}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <div style={styles.indicators}>
              <div style={styles.urgencyBadge} data-urgency={ticket.urgency}>
                Urgency: Level {ticket.urgency}
              </div>
              <div style={{ ...styles.sentimentBadge, backgroundColor: sentiment.color }}>
                {sentiment.text}
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Customer Information</h3>
            <div style={styles.customerInfo}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>User ID:</span>
                <span>#{ticket.user_id}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Contact:</span>
                <span>User****{String(ticket.user_id || '').slice(-3)}</span>
              </div>
            </div>
          </div>

          {/* Complaint Details */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Details</h3>
            <div style={styles.complaintContent}>
              <p style={styles.description}>{ticket.description}</p>
              
              {ticket.audio_file_path && (
                <div style={styles.audioSection}>
                  <h4>Voice Recording</h4>
                  <audio controls style={styles.audioPlayer}>
                    <source src={ticket.audio_file_path} type="audio/webm" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </div>

          {/* Management Controls */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Ticket Management</h3>
            <div style={styles.controlsGrid}>
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  style={styles.select}
                >
                  <option value="new">New</option>
                  <option value="progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <button 
                  onClick={handleStatusUpdate}
                  style={styles.updateButton}
                >
                  Update Status
                </button>
              </div>
              
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>Assign To</label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="Enter team member ID"
                  style={styles.input}
                />
                <button 
                  onClick={handleAssign}
                  style={styles.updateButton}
                >
                  Assign
                </button>
              </div>
            </div>
          </div>

          {/* Response Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Add Response</h3>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response to the customer..."
              style={styles.responseTextarea}
              rows={5}
            />
            <button 
              onClick={handleAddResponse}
              style={styles.sendButton}
              disabled={!response.trim()}
            >
              Send Response
            </button>
          </div>

          {/* Warnings */}
          {ticket.category === 'complaint' && ticket.status !== 'resolved' && (
            <div style={styles.warningBox}>
              <span style={styles.warningIcon}>⚠️</span>
              <div>
                <strong>Important:</strong> Complaints not resolved within 24 hours will incur a ₹50 charge.
                {timeInfo && timeInfo.text === 'Charge Applied' && (
                  <p style={{ margin: '5px 0 0 0' }}>
                    This complaint has exceeded the 24-hour window and has been charged.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
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
  },
  headerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '8px 16px',
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  ticketId: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#7f8c8d',
  },
  error: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#e74c3c',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '0 20px',
  },
  ticketContainer: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  ticketHeader: {
    padding: '30px',
    borderBottom: '1px solid #ecf0f1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ticketTitleSection: {
    flex: 1,
  },
  ticketTitle: {
    fontSize: '28px',
    color: '#2c3e50',
    margin: '0 0 10px 0',
  },
  ticketMeta: {
    display: 'flex',
    gap: '15px',
    color: '#7f8c8d',
    fontSize: '14px',
  },
  indicators: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  urgencyBadge: {
    padding: '6px 12px',
    background: '#f8f9fa',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
  },
  sentimentBadge: {
    padding: '6px 12px',
    color: 'white',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
  },
  section: {
    padding: '30px',
    borderBottom: '1px solid #ecf0f1',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  customerInfo: {
    display: 'flex',
    gap: '30px',
  },
  infoItem: {
    display: 'flex',
    gap: '10px',
  },
  infoLabel: {
    fontWeight: '600',
    color: '#495057',
  },
  complaintContent: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
  },
  description: {
    color: '#495057',
    lineHeight: 1.8,
    margin: 0,
  },
  audioSection: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #dee2e6',
  },
  audioPlayer: {
    width: '100%',
    marginTop: '10px',
  },
  controlsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  controlGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end',
  },
  controlLabel: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '600',
    color: '#495057',
    fontSize: '14px',
  },
  select: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '14px',
    background: 'white',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '14px',
  },
  updateButton: {
    padding: '10px 20px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  responseTextarea: {
    width: '100%',
    padding: '15px',
    border: '2px solid #ecf0f1',
    borderRadius: '8px',
    fontSize: '15px',
    resize: 'vertical',
    fontFamily: 'inherit',
    marginBottom: '15px',
  },
  sendButton: {
    padding: '12px 30px',
    background: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
  },
  warningBox: {
    margin: '30px',
    padding: '20px',
    background: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '8px',
    display: 'flex',
    gap: '15px',
  },
  warningIcon: {
    fontSize: '24px',
  },
};