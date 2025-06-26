import React, { useState, useEffect } from 'react';
import brandService from '../../services/brandService';
import ticketService from '../../services/ticketService';
import authService from '../../services/authService';

export default function BrandDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({
    newComplaints: 0,
    totalActive: 0,
    avgRating: 0,
    avgResolutionTime: '0h',
  });
  const [urgentTickets, setUrgentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatedNumber, setGeneratedNumber] = useState('+1-800-HELP-234');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // For now, we'll use mock data since backend endpoints need to be implemented
      setDashboardData({
        newComplaints: 24,
        totalActive: 156,
        avgRating: 4.2,
        avgResolutionTime: '18h',
      });
      
      // Load urgent tickets
      const tickets = await ticketService.listTickets(0, 5);
      setUrgentTickets(tickets.filter(t => t.urgency > 0 || t.status === 'new'));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNumber = () => {
    const numbers = ['+1-800-HELP-567', '+1-888-CARE-123', '+1-877-HELP-890'];
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    setGeneratedNumber(randomNumber);
    alert('New number generated: ' + randomNumber);
  };

  const renderDashboard = () => (
    <>
      <h2 style={{ marginBottom: '20px' }}>Overview</h2>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{dashboardData.newComplaints}</div>
          <div style={styles.statLabel}>New Complaints</div>
          <span style={styles.statChangeNegative}>+15% from yesterday</span>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{dashboardData.totalActive}</div>
          <div style={styles.statLabel}>Total Active</div>
          <span style={styles.statChangePositive}>-8% from last week</span>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{dashboardData.avgRating}</div>
          <div style={styles.statLabel}>Avg. Rating</div>
          <span style={styles.statChangePositive}>+0.3 this month</span>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{dashboardData.avgResolutionTime}</div>
          <div style={styles.statLabel}>Avg. Resolution Time</div>
          <span style={styles.statChangePositive}>-2h improvement</span>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Recent Tickets Requiring Urgent Action</h3>
          <button 
            style={styles.btnSecondary}
            onClick={() => setActiveTab('tickets')}
          >
            View All
          </button>
        </div>
        
        <div style={styles.warningBox}>
          <span>⚠️</span>
          <span>3 complaints will incur charges if not resolved in the next 3 hours</span>
        </div>
        
        <table style={styles.dataTable}>
          <thead>
            <tr>
              <th style={styles.th}>Ticket ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Issue</th>
              <th style={styles.th}>Channel</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Time Left</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {urgentTickets.map((ticket, index) => (
              <tr key={ticket.id}>
                <td style={styles.td}><strong>#CMP-2024-{String(ticket.id).padStart(3, '0')}</strong></td>
                <td style={styles.td}>User****{String(ticket.user_id || '').slice(-3)}</td>
                <td style={styles.td}>{ticket.description.substring(0, 40)}...</td>
                <td style={styles.td}>{getChannelIcon(ticket.channel)} {ticket.channel}</td>
                <td style={styles.td}>
                  <span style={getStatusBadgeStyle(ticket.status)}>
                    {ticket.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={styles.urgencyTimer}>
                    {getTimeLeft(ticket.created_at)}
                  </span>
                </td>
                <td style={styles.td}>
                  <a href={`/brand/ticket/${ticket.id}`} style={styles.btnPrimary}>
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderTickets = () => (
    <>
      <h2 style={{ marginBottom: '20px' }}>Ticket Management</h2>
      
      <div style={styles.section}>
        <div style={{ marginBottom: '20px' }}>
          <input 
            type="text" 
            style={styles.searchInput}
            placeholder="Search tickets by ID, customer, or issue..."
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <select style={styles.filterDropdown}>
            <option>All Categories</option>
            <option>Complaints</option>
            <option>Feedback</option>
            <option>Suggestions</option>
          </select>
          <select style={styles.filterDropdown}>
            <option>All Status</option>
            <option>New</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <select style={styles.filterDropdown}>
            <option>All Channels</option>
            <option>Voice Call</option>
            <option>WhatsApp</option>
            <option>Web Chat</option>
          </select>
        </div>
        
        <p style={{ textAlign: 'center', padding: '40px' }}>
          Full ticket management interface would be implemented here
        </p>
      </div>
    </>
  );

  const renderAnalytics = () => (
    <>
      <h2 style={{ marginBottom: '20px' }}>Analytics & Reports</h2>
      
      <div style={styles.section}>
        <p>Analytics dashboard with charts will be implemented in Bubble.io</p>
        <ul>
          <li>Resolution time trends</li>
          <li>Complaint categories distribution</li>
          <li>Customer satisfaction trends</li>
          <li>Channel performance metrics</li>
        </ul>
      </div>
    </>
  );

  const renderSettings = () => (
    <>
      <h2 style={{ marginBottom: '20px' }}>Settings</h2>
      
      <div style={styles.settingsGrid}>
        <div style={styles.settingsSection}>
          <h3 style={{ marginBottom: '20px' }}>Complaint Hotline</h3>
          <div style={styles.numberGenerator}>
            <p style={{ color: '#7f8c8d' }}>Your dedicated toll-free number</p>
            <div style={styles.generatedNumber}>{generatedNumber}</div>
            <button style={styles.btnPrimary} onClick={generateNumber}>
              Generate New Number
            </button>
            <button style={{ ...styles.btnSecondary, marginLeft: '10px' }}>
              Configure IVR
            </button>
          </div>
        </div>
        
        <div style={styles.settingsSection}>
          <h3 style={{ marginBottom: '20px' }}>CRM Integration</h3>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>CRM System</label>
            <select style={styles.formControl}>
              <option>Select CRM</option>
              <option>Salesforce</option>
              <option>Zoho CRM</option>
              <option>Freshworks</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>API Endpoint</label>
            <input 
              type="text" 
              style={styles.formControl} 
              placeholder="https://api.yourcrm.com/tickets"
            />
          </div>
          <button style={styles.btnPrimary}>Save Integration</button>
        </div>
      </div>
    </>
  );

  const renderBilling = () => (
    <>
      <h2 style={{ marginBottom: '20px' }}>Billing & Credits</h2>
      
      <div style={styles.creditBalance}>
        <div style={styles.creditLabel}>Available Credits</div>
        <div style={styles.creditAmount}>₹ 2,450</div>
        <div>From complaint charges</div>
        <button style={styles.btnWhite}>Add Credits</button>
      </div>
      
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Recent Transactions</h3>
        <table style={styles.dataTable}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Ticket ID</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>Dec 15, 2024</td>
              <td style={styles.td}>Complaint charge - Exceeded 24h</td>
              <td style={styles.td}>#CMP-2024-089</td>
              <td style={{ ...styles.td, color: '#e74c3c' }}>-₹50</td>
              <td style={styles.td}>₹2,450</td>
            </tr>
            <tr>
              <td style={styles.td}>Dec 14, 2024</td>
              <td style={styles.td}>Credit top-up</td>
              <td style={styles.td}>-</td>
              <td style={{ ...styles.td, color: '#27ae60' }}>+₹500</td>
              <td style={styles.td}>₹2,500</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );

  const getChannelIcon = (channel) => {
    const icons = {
      voice: '📞',
      whatsapp: '💬',
      'web chat': '🌐',
      web: '🌐',
    };
    return icons[channel?.toLowerCase()] || '📧';
  };

  const getTimeLeft = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const hoursElapsed = Math.floor((now - created) / (1000 * 60 * 60));
    const hoursLeft = 24 - hoursElapsed;
    
    if (hoursLeft <= 0) return 'Expired';
    if (hoursLeft <= 3) return `${hoursLeft}h ${60 - (now.getMinutes() - created.getMinutes())}m`;
    return `${hoursLeft}h`;
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
      case 'urgent':
        return { ...baseStyle, background: '#f8d7da', color: '#721c24' };
      case 'new':
        return { ...baseStyle, background: '#fff3cd', color: '#856404' };
      case 'progress':
        return { ...baseStyle, background: '#cce5ff', color: '#004085' };
      case 'resolved':
        return { ...baseStyle, background: '#d4edda', color: '#155724' };
      default:
        return baseStyle;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.brandInfo}>
            <span style={styles.brandLogo}>🏢 TechGiant Electronics</span>
          </div>
          <div style={styles.userInfo}>
            <span>Welcome, John Doe</span>
            <span>|</span>
            <span>Support Manager</span>
            <button onClick={() => authService.logout()} style={styles.btnPrimary}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={styles.navTabs}>
        <div style={styles.navContainer}>
          <button 
            style={activeTab === 'dashboard' ? styles.navTabActive : styles.navTab}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            style={activeTab === 'tickets' ? styles.navTabActive : styles.navTab}
            onClick={() => setActiveTab('tickets')}
          >
            Tickets
          </button>
          <button 
            style={activeTab === 'analytics' ? styles.navTabActive : styles.navTab}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button 
            style={activeTab === 'settings' ? styles.navTabActive : styles.navTab}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          <button 
            style={activeTab === 'billing' ? styles.navTabActive : styles.navTab}
            onClick={() => setActiveTab('billing')}
          >
            Billing
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'tickets' && renderTickets()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'billing' && renderBilling()}
          </>
        )}
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
    padding: '15px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 100,
  },
  headerContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  brandLogo: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2c3e50',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    color: '#7f8c8d',
  },
  navTabs: {
    background: 'white',
    padding: '0 20px',
    marginTop: '60px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: '60px',
    zIndex: 90,
  },
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    gap: '0',
  },
  navTab: {
    padding: '15px 25px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#7f8c8d',
    fontWeight: '500',
    fontSize: '15px',
    transition: 'all 0.3s',
    borderBottom: '3px solid transparent',
  },
  navTabActive: {
    padding: '15px 25px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#3498db',
    fontWeight: '500',
    fontSize: '15px',
    borderBottom: '3px solid #3498db',
  },
  mainContent: {
    maxWidth: '1400px',
    margin: '20px auto',
    padding: '0 20px',
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
    transition: 'transform 0.3s',
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
  statChangePositive: {
    display: 'inline-block',
    marginTop: '10px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    background: '#d4edda',
    color: '#155724',
  },
  statChangeNegative: {
    display: 'inline-block',
    marginTop: '10px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    background: '#f8d7da',
    color: '#721c24',
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
  warningBox: {
    background: '#fff3cd',
    border: '1px solid #ffeaa7',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
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
  urgencyTimer: {
    color: '#e74c3c',
    fontWeight: '600',
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
  searchInput: {
    width: '100%',
    maxWidth: '400px',
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
  },
  filterDropdown: {
    padding: '8px 15px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    background: 'white',
    cursor: 'pointer',
  },
  settingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '30px',
  },
  settingsSection: {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  numberGenerator: {
    background: '#f8f9fa',
    padding: '30px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  generatedNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2c3e50',
    margin: '20px 0',
    fontFamily: "'Courier New', monospace",
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
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '14px',
  },
  creditBalance: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center',
    marginBottom: '30px',
  },
  creditLabel: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  creditAmount: {
    fontSize: '48px',
    fontWeight: '700',
    margin: '20px 0',
  },
  btnWhite: {
    background: 'white',
    color: '#667eea',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px',
  },
};