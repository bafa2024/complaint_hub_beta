import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import authService from '../../services/authService';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);

  useEffect(() => {
    loadTicket();
  }, [id]);

  const loadTicket = async () => {
    try {
      const data = await ticketService.getTicket(id);
      setTicket(data);
    } catch (error) {
      console.error('Failed to load ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResponse = async () => {
    if (!message.trim()) return;
    
    try {
      await ticketService.addTicketResponse(id, message);
      setMessage('');
      loadTicket(); // Reload to show new response
    } catch (error) {
      console.error('Failed to add response:', error);
    }
  };

  const handleReopen = async () => {
    try {
      await ticketService.updateTicketStatus(id, 'new');
      setShowReopenModal(false);
      loadTicket();
    } catch (error) {
      console.error('Failed to reopen ticket:', error);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      console.log('Starting voice recording...');
    } else {
      console.log('Stopping voice recording...');
      alert('Voice message added to ticket');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: '#f39c12',
      progress: '#3498db',
      resolved: '#27ae60',
    };
    return colors[status] || '#95a5a6';
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

  if (loading) {
    return <div style={styles.loading}>Loading ticket details...</div>;
  }

  if (!ticket) {
    return <div style={styles.error}>Ticket not found</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.breadcrumb}>
            <a href="/user/dashboard" style={styles.breadcrumbLink}>Dashboard</a>
            <span style={styles.breadcrumbSeparator}>/</span>
            <span>Ticket #{ticket.id}</span>
          </div>
          <button onClick={() => authService.logout()} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.mainContent}>
        <div style={styles.ticketContainer}>
          {/* Ticket Header */}
          <div style={styles.ticketHeader}>
            <div>
              <h1 style={styles.ticketTitle}>
                {getCategoryIcon(ticket.category)} Ticket #{ticket.id}
              </h1>
              <div style={styles.ticketMeta}>
                <span style={styles.brandName}>Brand: {ticket.brand_name || 'Unknown'}</span>
                <span style={styles.separator}>•</span>
                <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div style={styles.statusBadge} data-status={ticket.status}>
              <div style={styles.statusDot} style={{ backgroundColor: getStatusColor(ticket.status) }}></div>
              {ticket.status.toUpperCase()}
            </div>
          </div>

          {/* Ticket Content */}
          <div style={styles.ticketBody}>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Description</h3>
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

            {/* Ticket Info */}
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Channel</span>
                <span style={styles.infoValue}>{ticket.channel}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Category</span>
                <span style={styles.infoValue}>{ticket.category}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Urgency</span>
                <span style={styles.infoValue}>Level {ticket.urgency}</span>
              </div>
              {ticket.resolved_at && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Resolved</span>
                  <span style={styles.infoValue}>
                    {new Date(ticket.resolved_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Response Thread */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Updates & Responses</h3>
              <div style={styles.timeline}>
                {/* Mock responses - replace with actual data */}
                <div style={styles.timelineItem}>
                  <div style={styles.timelineDot}></div>
                  <div style={styles.timelineContent}>
                    <div style={styles.timelineHeader}>
                      <strong>Support Team</strong>
                      <span style={styles.timelineDate}>2 days ago</span>
                    </div>
                    <p>We've received your complaint and are looking into it.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Response */}
            {ticket.status !== 'resolved' && (
              <div style={styles.responseSection}>
                <h3 style={styles.sectionTitle}>Add Update</h3>
                <textarea
                  style={styles.textarea}
                  placeholder="Add additional information or respond to updates..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
                <div style={styles.responseActions}>
                  <button 
                    style={isRecording ? styles.recordingBtn : styles.voiceBtn}
                    onClick={toggleRecording}
                  >
                    {isRecording ? '⏹ Stop Recording' : '🎤 Add Voice Message'}
                  </button>
                  <button 
                    style={styles.sendBtn}
                    onClick={handleAddResponse}
                    disabled={!message.trim()}
                  >
                    Send Update
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={styles.actionSection}>
              {ticket.status === 'resolved' ? (
                <>
                  <button 
                    style={styles.reopenBtn}
                    onClick={() => setShowReopenModal(true)}
                  >
                    Reopen Ticket
                  </button>
                  <button style={styles.rateBtn}>
                    Rate Resolution
                  </button>
                </>
              ) : (
                <button style={styles.closeBtn}>
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Reopen Modal */}
      {showReopenModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Reopen Ticket?</h3>
            <p>Are you sure you want to reopen this ticket? Please provide a reason.</p>
            <textarea
              style={styles.modalTextarea}
              placeholder="Reason for reopening..."
              rows={3}
            />
            <div style={styles.modalActions}>
              <button 
                style={styles.cancelBtn}
                onClick={() => setShowReopenModal(false)}
              >
                Cancel
              </button>
              <button 
                style={styles.confirmBtn}
                onClick={handleReopen}
              >
                Reopen Ticket
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
    padding: '20px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    position: 'sticky',
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
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#7f8c8d',
  },
  breadcrumbLink: {
    color: '#3498db',
    textDecoration: 'none',
  },
  breadcrumbSeparator: {
    color: '#bdc3c7',
  },
  logoutBtn: {
    padding: '8px 20px',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
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
    maxWidth: '900px',
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
  ticketTitle: {
    fontSize: '28px',
    color: '#2c3e50',
    margin: '0 0 10px 0',
  },
  ticketMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#7f8c8d',
    fontSize: '14px',
  },
  brandName: {
    fontWeight: '600',
  },
  separator: {
    color: '#bdc3c7',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: '#f8f9fa',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  ticketBody: {
    padding: '30px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  description: {
    color: '#495057',
    lineHeight: 1.8,
    fontSize: '16px',
  },
  audioSection: {
    marginTop: '20px',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  audioPlayer: {
    width: '100%',
    marginTop: '10px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  infoLabel: {
    fontSize: '12px',
    color: '#7f8c8d',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: '16px',
    color: '#2c3e50',
    fontWeight: '600',
  },
  timeline: {
    position: 'relative',
    paddingLeft: '30px',
  },
  timelineItem: {
    position: 'relative',
    paddingBottom: '20px',
  },
  timelineDot: {
    position: 'absolute',
    left: '-25px',
    top: '5px',
    width: '10px',
    height: '10px',
    background: '#3498db',
    borderRadius: '50%',
  },
  timelineContent: {
    background: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
  },
  timelineHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  timelineDate: {
    fontSize: '12px',
    color: '#7f8c8d',
  },
  responseSection: {
    marginTop: '30px',
    paddingTop: '30px',
    borderTop: '1px solid #ecf0f1',
  },
  textarea: {
    width: '100%',
    padding: '15px',
    border: '2px solid #ecf0f1',
    borderRadius: '8px',
    fontSize: '15px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  responseActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  voiceBtn: {
    padding: '10px 20px',
    background: '#9b59b6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  recordingBtn: {
    padding: '10px 20px',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    animation: 'pulse 1.5s infinite',
  },
  sendBtn: {
    padding: '10px 20px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    flex: 1,
  },
  actionSection: {
    display: 'flex',
    gap: '10px',
    marginTop: '30px',
    paddingTop: '30px',
    borderTop: '1px solid #ecf0f1',
  },
  reopenBtn: {
    padding: '12px 30px',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    flex: 1,
  },
  rateBtn: {
    padding: '12px 30px',
    background: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    flex: 1,
  },
  closeBtn: {
    padding: '12px 30px',
    background: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    flex: 1,
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  modalContent: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
  },
  modalTitle: {
    fontSize: '24px',
    marginBottom: '15px',
    color: '#2c3e50',
  },
  modalTextarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    marginTop: '15px',
    fontFamily: 'inherit',
  },
  modalActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  cancelBtn: {
    flex: 1,
    padding: '10px 20px',
    border: '1px solid #ddd',
    background: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    padding: '10px 20px',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
};