import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalBrands: 156,
    totalUsers: 3420,
    totalComplaints: 8934,
    resolvedToday: 142,
    avgResolutionTime: '14.5h',
    revenue: 245600,
  });

  const renderOverview = () => (
    <div>
      <h2 style={styles.title}>System Overview</h2>
      
      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏢</div>
          <div style={styles.statValue}>{stats.totalBrands}</div>
          <div style={styles.statLabel}>Total Brands</div>
          <div style={styles.statChange}>+12% this month</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statValue}>{stats.totalUsers.toLocaleString()}</div>
          <div style={styles.statLabel}>Total Users</div>
          <div style={styles.statChange}>+23% this month</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📋</div>
          <div style={styles.statValue}>{stats.totalComplaints.toLocaleString()}</div>
          <div style={styles.statLabel}>Total Complaints</div>
          <div style={styles.statChange}>+18% this month</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statValue}>{stats.resolvedToday}</div>
          <div style={styles.statLabel}>Resolved Today</div>
          <div style={styles.statChange}>Above average</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⏱️</div>
          <div style={styles.statValue}>{stats.avgResolutionTime}</div>
          <div style={styles.statLabel}>Avg. Resolution Time</div>
          <div style={styles.statChange}>-2h improvement</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statValue}>₹{stats.revenue.toLocaleString()}</div>
          <div style={styles.statLabel}>Revenue (Month)</div>
          <div style={styles.statChange}>+34% this month</div>
        </div>
      </div>

      {/* Activity Chart Placeholder */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Activity Overview</h3>
        <div style={styles.chartPlaceholder}>
          <p>📊 Complaint trends chart would be displayed here</p>
          <p>Showing daily complaints over the last 30 days</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Recent System Activity</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Event</th>
              <th style={styles.th}>User/Brand</th>
              <th style={styles.th}>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>2 min ago</td>
              <td style={styles.td}>New Brand Registered</td>
              <td style={styles.td}>TechCorp Solutions</td>
              <td style={styles.td}>Premium Plan</td>
            </tr>
            <tr>
              <td style={styles.td}>15 min ago</td>
              <td style={styles.td}>Complaint Escalated</td>
              <td style={styles.td}>User #3421</td>
              <td style={styles.td}>24h limit exceeded</td>
            </tr>
            <tr>
              <td style={styles.td}>1 hour ago</td>
              <td style={styles.td}>Credit Top-up</td>
              <td style={styles.td}>RetailMart</td>
              <td style={styles.td}>₹5,000 added</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBrands = () => (
    <div>
      <div style={styles.sectionHeader}>
        <h2 style={styles.title}>Brand Management</h2>
        <button style={styles.addButton}>+ Add New Brand</button>
      </div>
      
      <div style={styles.filterBar}>
        <input 
          type="text" 
          placeholder="Search brands..." 
          style={styles.searchInput}
        />
        <select style={styles.filterSelect}>
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Suspended</option>
        </select>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Brand Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Phone Number</th>
            <th style={styles.th}>Credits</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}>TechGiant Electronics</td>
            <td style={styles.td}>support@techgiant.com</td>
            <td style={styles.td}>+1-800-TECH-123</td>
            <td style={styles.td}>₹2,450</td>
            <td style={styles.td}>
              <span style={styles.statusActive}>Active</span>
            </td>
            <td style={styles.td}>
              <button style={styles.actionBtn}>Edit</button>
              <button style={styles.actionBtn}>View</button>
            </td>
          </tr>
          <tr>
            <td style={styles.td}>RetailMart</td>
            <td style={styles.td}>care@retailmart.com</td>
            <td style={styles.td}>+1-888-SHOP-456</td>
            <td style={styles.td}>₹8,200</td>
            <td style={styles.td}>
              <span style={styles.statusActive}>Active</span>
            </td>
            <td style={styles.td}>
              <button style={styles.actionBtn}>Edit</button>
              <button style={styles.actionBtn}>View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderUsers = () => (
    <div>
      <div style={styles.sectionHeader}>
        <h2 style={styles.title}>User Management</h2>
        <div style={styles.userStats}>
          <span>Total Users: {stats.totalUsers.toLocaleString()}</span>
          <span>Active Today: 892</span>
        </div>
      </div>

      <div style={styles.filterBar}>
        <input 
          type="text" 
          placeholder="Search users by name, email, or phone..." 
          style={styles.searchInput}
        />
        <select style={styles.filterSelect}>
          <option>All Users</option>
          <option>Active</option>
          <option>Banned</option>
        </select>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>User ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Phone</th>
            <th style={styles.th}>Complaints</th>
            <th style={styles.th}>Joined</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}>#3421</td>
            <td style={styles.td}>John Doe</td>
            <td style={styles.td}>john.doe@email.com</td>
            <td style={styles.td}>+91-9876543210</td>
            <td style={styles.td}>12</td>
            <td style={styles.td}>Jan 15, 2024</td>
            <td style={styles.td}>
              <button style={styles.actionBtn}>View</button>
              <button style={styles.actionBtn}>Ban</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderSettings = () => (
    <div>
      <h2 style={styles.title}>System Settings</h2>
      
      <div style={styles.settingsGrid}>
        <div style={styles.settingsCard}>
          <h3 style={styles.settingsTitle}>General Configuration</h3>
          
          <div style={styles.settingsItem}>
            <label style={styles.settingsLabel}>Complaint Charge Amount</label>
            <input 
              type="number" 
              defaultValue="50" 
              style={styles.settingsInput}
            />
            <span style={styles.settingsHelp}>Amount in INR charged after 24 hours</span>
          </div>
          
          <div style={styles.settingsItem}>
            <label style={styles.settingsLabel}>Free Resolution Window</label>
            <input 
              type="number" 
              defaultValue="24" 
              style={styles.settingsInput}
            />
            <span style={styles.settingsHelp}>Hours before charges apply</span>
          </div>
          
          <div style={styles.settingsItem}>
            <label style={styles.settingsLabel}>Auto-close Period</label>
            <input 
              type="number" 
              defaultValue="48" 
              style={styles.settingsInput}
            />
            <span style={styles.settingsHelp}>Hours after resolution to auto-close</span>
          </div>
          
          <button style={styles.saveButton}>Save Changes</button>
        </div>

        <div style={styles.settingsCard}>
          <h3 style={styles.settingsTitle}>API Credentials</h3>
          
          <div style={styles.settingsItem}>
            <label style={styles.settingsLabel}>OpenAI API Key</label>
            <input 
              type="password" 
              placeholder="sk-..." 
              style={styles.settingsInput}
            />
          </div>
          
          <div style={styles.settingsItem}>
            <label style={styles.settingsLabel}>Deepgram API Key</label>
            <input 
              type="password" 
              placeholder="Enter API key" 
              style={styles.settingsInput}
            />
          </div>
          
          <div style={styles.settingsItem}>
            <label style={styles.settingsLabel}>Twilio Account SID</label>
            <input 
              type="text" 
              placeholder="AC..." 
              style={styles.settingsInput}
            />
          </div>
          
          <button style={styles.saveButton}>Update Credentials</button>
        </div>

        <div style={styles.settingsCard}>
          <h3 style={styles.settingsTitle}>Email Configuration</h3>
          
          <div style={styles.settingsItem}>
            <label style={styles.settingsLabel}>SMTP Host</label>
            <input 
              type="text" 
              defaultValue="smtp.gmail.com" 
              style={styles.settingsInput}
            />
          </div>
          
          <div style={styles.settingsItem}>
            <label style={styles.settingsLabel}>SMTP Port</label>
            <input 
              type="number" 
              defaultValue="587" 
              style={styles.settingsInput}
            />
          </div>
          
          <div style={styles.settingsItem}>
            <label style={styles.settingsLabel}>From Email</label>
            <input 
              type="email" 
              placeholder="noreply@complainthub.com" 
              style={styles.settingsInput}
            />
          </div>
          
          <button style={styles.saveButton}>Save Email Settings</button>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div>
      <h2 style={styles.title}>Reports & Analytics</h2>
      
      <div style={styles.reportCards}>
        <div style={styles.reportCard}>
          <h3>Monthly Summary Report</h3>
          <p>Complete overview of system performance</p>
          <button style={styles.downloadBtn}>Download PDF</button>
        </div>
        
        <div style={styles.reportCard}>
          <h3>Brand Performance Report</h3>
          <p>Resolution rates and satisfaction scores by brand</p>
          <button style={styles.downloadBtn}>Download CSV</button>
        </div>
        
        <div style={styles.reportCard}>
          <h3>Financial Report</h3>
          <p>Revenue, charges, and credit transactions</p>
          <button style={styles.downloadBtn}>Download Excel</button>
        </div>
        
        <div style={styles.reportCard}>
          <h3>User Activity Report</h3>
          <p>User engagement and complaint patterns</p>
          <button style={styles.downloadBtn}>Generate Report</button>
        </div>
      </div>
      
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Quick Stats</h3>
        <div style={styles.quickStats}>
          <div>
            <strong>Resolution Rate:</strong> 87.3%
          </div>
          <div>
            <strong>Average Satisfaction:</strong> 4.2/5
          </div>
          <div>
            <strong>Revenue Growth:</strong> +34% MoM
          </div>
          <div>
            <strong>Active Brands:</strong> 142/156
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.logo}>
            ComplaintHub Admin
          </div>
          <div style={styles.headerRight}>
            <span style={styles.adminName}>Admin User</span>
            <button onClick={() => authService.logout()} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <button 
            style={activeTab === 'overview' ? styles.navTabActive : styles.navTab}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            style={activeTab === 'brands' ? styles.navTabActive : styles.navTab}
            onClick={() => setActiveTab('brands')}
          >
            Brands
          </button>
          <button 
            style={activeTab === 'users' ? styles.navTabActive : styles.navTab}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            style={activeTab === 'settings' ? styles.navTabActive : styles.navTab}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          <button 
            style={activeTab === 'reports' ? styles.navTabActive : styles.navTab}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'brands' && renderBrands()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'reports' && renderReports()}
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
    background: '#2c3e50',
    color: 'white',
    padding: '15px 0',
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
  logo: {
    fontSize: '24px',
    fontWeight: '700',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  adminName: {
    fontWeight: '500',
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
  nav: {
    background: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    marginTop: '60px',
    position: 'sticky',
    top: '60px',
    zIndex: 90,
  },
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
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
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '30px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    textAlign: 'center',
  },
  statIcon: {
    fontSize: '36px',
    marginBottom: '10px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '5px',
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: '10px',
  },
  statChange: {
    fontSize: '12px',
    color: '#27ae60',
    fontWeight: '600',
  },
  section: {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  addButton: {
    padding: '10px 20px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  chartPlaceholder: {
    background: '#f8f9fa',
    padding: '60px',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#7f8c8d',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
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
  statusActive: {
    background: '#d4edda',
    color: '#155724',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  actionBtn: {
    padding: '6px 12px',
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '5px',
  },
  filterBar: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
  },
  filterSelect: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    background: 'white',
    cursor: 'pointer',
  },
  userStats: {
    display: 'flex',
    gap: '20px',
    fontSize: '14px',
    color: '#7f8c8d',
  },
  settingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
  },
  settingsCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  settingsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  settingsItem: {
    marginBottom: '20px',
  },
  settingsLabel: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '600',
    color: '#495057',
    fontSize: '14px',
  },
  settingsInput: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  settingsHelp: {
    display: 'block',
    fontSize: '12px',
    color: '#7f8c8d',
    marginTop: '5px',
  },
  saveButton: {
    padding: '10px 20px',
    background: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '10px',
  },
  reportCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  reportCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    textAlign: 'center',
  },
  downloadBtn: {
    padding: '10px 20px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '15px',
  },
  quickStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
};