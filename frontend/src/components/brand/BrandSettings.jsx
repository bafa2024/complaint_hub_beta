import React, { useState, useEffect } from 'react';
import brandService from '../../services/brandService';

export default function BrandSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    brandName: '',
    supportEmail: '',
    phone: '',
    autoRouting: false,
    routingRules: '',
    crmSystem: '',
    crmEndpoint: '',
    crmApiKey: '',
    phoneProvider: 'twilio',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [generatingNumber, setGeneratingNumber] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load brand settings - mock data for now
      setSettings({
        brandName: 'TechGiant Electronics',
        supportEmail: 'support@techgiant.com',
        phone: '+1-800-TECH-123',
        autoRouting: true,
        routingRules: 'complaint:support-team, feedback:product-team',
        crmSystem: 'salesforce',
        crmEndpoint: 'https://api.salesforce.com/tickets',
        crmApiKey: '•••••••••••••••',
        phoneProvider: 'twilio',
        phoneNumber: '+1-800-TECH-123',
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save settings
      await brandService.updateBrandProfile(1, settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const generatePhoneNumber = async () => {
    setGeneratingNumber(true);
    try {
      const result = await brandService.generateTollFreeNumber(1, settings.phoneProvider);
      setSettings({ ...settings, phoneNumber: result.phone_number });
      alert(`New number generated: ${result.phone_number}`);
    } catch (error) {
      console.error('Failed to generate number:', error);
      alert('Failed to generate phone number');
    } finally {
      setGeneratingNumber(false);
    }
  };

  const renderGeneralSettings = () => (
    <div style={styles.tabContent}>
      <h3 style={styles.tabTitle}>General Settings</h3>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Brand Name</label>
        <input
          type="text"
          value={settings.brandName}
          onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
          style={styles.input}
        />
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Support Email</label>
        <input
          type="email"
          value={settings.supportEmail}
          onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
          style={styles.input}
        />
        <p style={styles.helpText}>This email will receive complaint notifications</p>
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Contact Phone</label>
        <input
          type="tel"
          value={settings.phone}
          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
          style={styles.input}
        />
      </div>
      
      <button onClick={handleSave} style={styles.saveButton} disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );

  const renderPhoneSettings = () => (
    <div style={styles.tabContent}>
      <h3 style={styles.tabTitle}>Phone System Settings</h3>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Phone Provider</label>
        <select
          value={settings.phoneProvider}
          onChange={(e) => setSettings({ ...settings, phoneProvider: e.target.value })}
          style={styles.select}
        >
          <option value="twilio">Twilio</option>
          <option value="knowlarity">Knowlarity</option>
          <option value="exotel">Exotel</option>
          <option value="ozonetel">Ozonetel</option>
          <option value="myoperator">MyOperator</option>
        </select>
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Toll-Free Number</label>
        <div style={styles.phoneNumberSection}>
          <input
            type="text"
            value={settings.phoneNumber}
            readOnly
            style={styles.phoneInput}
          />
          <button 
            onClick={generatePhoneNumber}
            style={styles.generateButton}
            disabled={generatingNumber}
          >
            {generatingNumber ? 'Generating...' : 'Generate New'}
          </button>
        </div>
      </div>
      
      <div style={styles.ivrSection}>
        <h4>IVR Configuration</h4>
        <div style={styles.ivrOption}>
          <input type="checkbox" id="multilingual" style={styles.checkbox} />
          <label htmlFor="multilingual">Enable multilingual support</label>
        </div>
        <div style={styles.ivrOption}>
          <input type="checkbox" id="voicemail" style={styles.checkbox} />
          <label htmlFor="voicemail">Enable voicemail for after-hours</label>
        </div>
        <div style={styles.ivrOption}>
          <input type="checkbox" id="callback" style={styles.checkbox} />
          <label htmlFor="callback">Enable callback queue</label>
        </div>
      </div>
      
      <button onClick={handleSave} style={styles.saveButton}>
        Save Phone Settings
      </button>
    </div>
  );

  const renderRoutingSettings = () => (
    <div style={styles.tabContent}>
      <h3 style={styles.tabTitle}>Auto-Routing Rules</h3>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>
          <input
            type="checkbox"
            checked={settings.autoRouting}
            onChange={(e) => setSettings({ ...settings, autoRouting: e.target.checked })}
            style={styles.checkbox}
          />
          Enable automatic ticket routing
        </label>
      </div>
      
      {settings.autoRouting && (
        <div style={styles.rulesSection}>
          <h4>Routing Rules</h4>
          <p style={styles.helpText}>
            Define rules in format: category:team or category:user@email
          </p>
          <textarea
            value={settings.routingRules}
            onChange={(e) => setSettings({ ...settings, routingRules: e.target.value })}
            style={styles.textarea}
            placeholder="complaint:support-team&#10;feedback:product-team&#10;suggestion:innovation@company.com"
            rows={6}
          />
          
          <div style={styles.presetRules}>
            <h5>Quick Templates:</h5>
            <button 
              style={styles.templateButton}
              onClick={() => setSettings({
                ...settings,
                routingRules: 'complaint:support-team\nfeedback:product-team\nsuggestion:innovation-team\nsupport:help-desk'
              })}
            >
              Standard Template
            </button>
            <button 
              style={styles.templateButton}
              onClick={() => setSettings({
                ...settings,
                routingRules: 'urgent:senior-support\nhigh-priority:support-lead\nmedium:support-team\nlow:support-queue'
              })}
            >
              Priority-Based
            </button>
          </div>
        </div>
      )}
      
      <button onClick={handleSave} style={styles.saveButton}>
        Save Routing Rules
      </button>
    </div>
  );

  const renderIntegrations = () => (
    <div style={styles.tabContent}>
      <h3 style={styles.tabTitle}>CRM Integration</h3>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>CRM System</label>
        <select
          value={settings.crmSystem}
          onChange={(e) => setSettings({ ...settings, crmSystem: e.target.value })}
          style={styles.select}
        >
          <option value="">Select CRM</option>
          <option value="salesforce">Salesforce</option>
          <option value="zoho">Zoho CRM</option>
          <option value="freshworks">Freshworks</option>
          <option value="kapture">Kapture CRM</option>
          <option value="leadsquared">LeadSquared</option>
        </select>
      </div>
      
      {settings.crmSystem && (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label}>API Endpoint</label>
            <input
              type="url"
              value={settings.crmEndpoint}
              onChange={(e) => setSettings({ ...settings, crmEndpoint: e.target.value })}
              style={styles.input}
              placeholder="https://api.yourcrm.com/tickets"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>API Key</label>
            <input
              type="password"
              value={settings.crmApiKey}
              onChange={(e) => setSettings({ ...settings, crmApiKey: e.target.value })}
              style={styles.input}
              placeholder="Enter your CRM API key"
            />
          </div>
          
          <div style={styles.testSection}>
            <button style={styles.testButton}>Test Connection</button>
            <span style={styles.testStatus}>Not tested</span>
          </div>
        </>
      )}
      
      <div style={styles.webhookSection}>
        <h4>Webhook Configuration</h4>
        <p style={styles.helpText}>
          Use this webhook URL in your CRM to sync updates:
        </p>
        <div style={styles.webhookUrl}>
          https://api.complainthub.com/webhook/brand/1/crm
        </div>
        <button style={styles.copyButton}>Copy URL</button>
      </div>
      
      <button onClick={handleSave} style={styles.saveButton}>
        Save Integration
      </button>
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Brand Settings</h2>
      
      <div style={styles.tabs}>
        <button
          style={activeTab === 'general' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button
          style={activeTab === 'phone' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('phone')}
        >
          Phone System
        </button>
        <button
          style={activeTab === 'routing' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('routing')}
        >
          Auto-Routing
        </button>
        <button
          style={activeTab === 'integrations' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('integrations')}
        >
          Integrations
        </button>
      </div>
      
      <div style={styles.content}>
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'phone' && renderPhoneSettings()}
        {activeTab === 'routing' && renderRoutingSettings()}
        {activeTab === 'integrations' && renderIntegrations()}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '30px',
  },
  tabs: {
    display: 'flex',
    gap: '0',
    borderBottom: '2px solid #ecf0f1',
    marginBottom: '30px',
  },
  tab: {
    padding: '12px 24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    color: '#7f8c8d',
    borderBottom: '3px solid transparent',
    transition: 'all 0.3s',
  },
  tabActive: {
    padding: '12px 24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    color: '#3498db',
    borderBottom: '3px solid #3498db',
  },
  content: {
    background: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  tabContent: {},
  tabTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '25px',
  },
  formGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#495057',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '14px',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '14px',
    background: 'white',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'monospace',
    resize: 'vertical',
  },
  checkbox: {
    marginRight: '8px',
    cursor: 'pointer',
  },
  helpText: {
    fontSize: '13px',
    color: '#6c757d',
    marginTop: '5px',
  },
  saveButton: {
    padding: '12px 30px',
    background: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px',
  },
  phoneNumberSection: {
    display: 'flex',
    gap: '10px',
  },
  phoneInput: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'monospace',
  },
  generateButton: {
    padding: '10px 20px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  ivrSection: {
    marginTop: '30px',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  ivrOption: {
    marginBottom: '15px',
  },
  rulesSection: {
    marginTop: '20px',
  },
  presetRules: {
    marginTop: '20px',
  },
  templateButton: {
    padding: '8px 16px',
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
    fontSize: '14px',
  },
  testSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '20px',
  },
  testButton: {
    padding: '8px 20px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  testStatus: {
    color: '#6c757d',
    fontSize: '14px',
  },
  webhookSection: {
    marginTop: '30px',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  webhookUrl: {
    padding: '10px',
    background: 'white',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '13px',
    marginTop: '10px',
    marginBottom: '10px',
  },
  copyButton: {
    padding: '6px 16px',
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};