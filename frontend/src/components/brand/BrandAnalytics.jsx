import React, { useState, useEffect } from 'react';
import brandService from '../../services/brandService';

export default function BrandAnalytics() {
  const [dateRange, setDateRange] = useState('last30days');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      // Mock data for now
      setAnalyticsData({
        totalTickets: 234,
        resolvedTickets: 198,
        avgResolutionTime: 16.5,
        satisfactionScore: 4.2,
        categoryBreakdown: {
          complaint: 120,
          feedback: 60,
          suggestion: 30,
          support: 24
        },
        channelBreakdown: {
          voice: 100,
          whatsapp: 80,
          web: 54
        },
        dailyTrends: [
          { date: '2024-12-01', count: 8 },
          { date: '2024-12-02', count: 12 },
          { date: '2024-12-03', count: 6 },
          { date: '2024-12-04', count: 15 },
          { date: '2024-12-05', count: 10 },
        ]
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (value, total) => {
    return ((value / total) * 100).toFixed(1);
  };

  if (loading) {
    return <div style={styles.loading}>Loading analytics...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Date Range Selector */}
      <div style={styles.controls}>
        <select 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)}
          style={styles.dateSelector}
        >
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="last3months">Last 3 Months</option>
          <option value="custom">Custom Range</option>
        </select>
        <button style={styles.exportBtn}>📊 Export Report</button>
      </div>

      {/* Key Metrics */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricIcon}>📊</div>
          <div style={styles.metricValue}>{analyticsData.totalTickets}</div>
          <div style={styles.metricLabel}>Total Tickets</div>
          <div style={styles.metricChange}>+12% from last period</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricIcon}>✅</div>
          <div style={styles.metricValue}>{analyticsData.resolvedTickets}</div>
          <div style={styles.metricLabel}>Resolved</div>
          <div style={styles.metricChange}>
            {calculatePercentage(analyticsData.resolvedTickets, analyticsData.totalTickets)}% resolution rate
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricIcon}>⏱️</div>
          <div style={styles.metricValue}>{analyticsData.avgResolutionTime}h</div>
          <div style={styles.metricLabel}>Avg. Resolution Time</div>
          <div style={styles.metricChange}>-2.5h improvement</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricIcon}>⭐</div>
          <div style={styles.metricValue}>{analyticsData.satisfactionScore}/5</div>
          <div style={styles.metricLabel}>Satisfaction Score</div>
          <div style={styles.metricChange}>+0.3 from last period</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={styles.chartsGrid}>
        {/* Ticket Trends Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Daily Ticket Trends</h3>
          <div style={styles.chartPlaceholder}>
            <div style={styles.miniChart}>
              {analyticsData.dailyTrends.map((day, index) => (
                <div key={index} style={styles.barContainer}>
                  <div 
                    style={{
                      ...styles.bar,
                      height: `${(day.count / 15) * 100}%`
                    }}
                  />
                  <span style={styles.barLabel}>{day.date.slice(-2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Tickets by Category</h3>
          <div style={styles.breakdown}>
            {Object.entries(analyticsData.categoryBreakdown).map(([category, count]) => (
              <div key={category} style={styles.breakdownItem}>
                <div style={styles.breakdownHeader}>
                  <span style={styles.categoryName}>{category}</span>
                  <span style={styles.categoryCount}>{count}</span>
                </div>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${calculatePercentage(count, analyticsData.totalTickets)}%`,
                      backgroundColor: getCategoryColor(category)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Distribution */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Channel Distribution</h3>
          <div style={styles.channelGrid}>
            {Object.entries(analyticsData.channelBreakdown).map(([channel, count]) => (
              <div key={channel} style={styles.channelItem}>
                <div style={styles.channelIcon}>{getChannelIcon(channel)}</div>
                <div style={styles.channelName}>{channel}</div>
                <div style={styles.channelCount}>{count}</div>
                <div style={styles.channelPercent}>
                  {calculatePercentage(count, analyticsData.totalTickets)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Performance Metrics</h3>
          <div style={styles.performanceMetrics}>
            <div style={styles.performanceItem}>
              <span style={styles.performanceLabel}>First Response Time</span>
              <span style={styles.performanceValue}>2.3 hours</span>
            </div>
            <div style={styles.performanceItem}>
              <span style={styles.performanceLabel}>Complaints > 24h</span>
              <span style={styles.performanceValue}>12 (5.1%)</span>
            </div>
            <div style={styles.performanceItem}>
              <span style={styles.performanceLabel}>Reopened Tickets</span>
              <span style={styles.performanceValue}>8 (3.4%)</span>
            </div>
            <div style={styles.performanceItem}>
              <span style={styles.performanceLabel}>Avg. Messages/Ticket</span>
              <span style={styles.performanceValue}>3.2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div style={styles.insightsSection}>
        <h3 style={styles.sectionTitle}>AI-Generated Insights</h3>
        <div style={styles.insightsList}>
          <div style={styles.insightItem}>
            <span style={styles.insightIcon}>💡</span>
            <p>Product quality complaints increased by 25% this week. Consider reviewing recent batches.</p>
          </div>
          <div style={styles.insightItem}>
            <span style={styles.insightIcon}>⚡</span>
            <p>WhatsApp channel shows 40% faster resolution time compared to voice calls.</p>
          </div>
          <div style={styles.insightItem}>
            <span style={styles.insightIcon}>🎯</span>
            <p>Customer satisfaction drops significantly when resolution exceeds 20 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(category) {
  const colors = {
    complaint: '#e74c3c',
    feedback: '#3498db',
    suggestion: '#f39c12',
    support: '#27ae60'
  };
  return colors[category] || '#95a5a6';
}

function getChannelIcon(channel) {
  const icons = {
    voice: '📞',
    whatsapp: '💬',
    web: '🌐'
  };
  return icons[channel] || '📧';
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    fontSize: '18px',
    color: '#7f8c8d',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '30px',
  },
  dateSelector: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    background: 'white',
    cursor: 'pointer',
  },
  exportBtn: {
    padding: '10px 20px',
    background: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  metricCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    textAlign: 'center',
    transition: 'transform 0.3s',
  },
  metricIcon: {
    fontSize: '36px',
    marginBottom: '10px',
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '5px',
  },
  metricLabel: {
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: '10px',
  },
  metricChange: {
    fontSize: '12px',
    color: '#27ae60',
    fontWeight: '600',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  chartCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  chartPlaceholder: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    minHeight: '200px',
  },
  miniChart: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '160px',
  },
  barContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: '30px',
    background: '#3498db',
    borderRadius: '4px 4px 0 0',
    transition: 'all 0.3s',
  },
  barLabel: {
    fontSize: '12px',
    color: '#7f8c8d',
    marginTop: '5px',
  },
  breakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  breakdownItem: {
    marginBottom: '10px',
  },
  breakdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  categoryName: {
    textTransform: 'capitalize',
    fontSize: '14px',
    color: '#495057',
  },
  categoryCount: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#2c3e50',
  },
  progressBar: {
    height: '8px',
    background: '#ecf0f1',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.5s ease',
  },
  channelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '15px',
  },
  channelItem: {
    textAlign: 'center',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  channelIcon: {
    fontSize: '32px',
    marginBottom: '5px',
  },
  channelName: {
    fontSize: '14px',
    color: '#495057',
    textTransform: 'capitalize',
    marginBottom: '5px',
  },
  channelCount: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2c3e50',
  },
  channelPercent: {
    fontSize: '12px',
    color: '#7f8c8d',
  },
  performanceMetrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  performanceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #ecf0f1',
  },
  performanceLabel: {
    color: '#495057',
    fontSize: '14px',
  },
  performanceValue: {
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '14px',
  },
  insightsSection: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  insightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  insightItem: {
    display: 'flex',
    gap: '15px',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  insightIcon: {
    fontSize: '24px',
  },
};