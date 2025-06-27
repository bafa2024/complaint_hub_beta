import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../../services/ticketService';

export default function NewComplaint() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [complaintData, setComplaintData] = useState({
    brand: '',
    category: 'complaint',
    channel: 'web',
    description: '',
    productDetails: '',
    expectedResolution: '',
  });
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [loading, setLoading] = useState(false);

  const brands = [
    'TechGiant Electronics',
    'RetailMart',
    'QuickServe Restaurant',
    'MegaBank Financial',
    'HealthPlus Insurance',
    'Other',
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Please allow microphone access to record audio');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleTextSubmit = async () => {
    setLoading(true);
    try {
      const ticketData = {
        brand_id: 1, // In real app, get actual brand ID
        category: complaintData.category,
        channel: 'web',
        description: `${complaintData.description}\n\nProduct/Service: ${complaintData.productDetails}\n\nExpected Resolution: ${complaintData.expectedResolution}`,
      };
      
      await ticketService.createTicket(ticketData);
      alert('Complaint submitted successfully!');
      navigate('/user/dashboard');
    } catch (error) {
      console.error('Failed to submit complaint:', error);
      alert('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSubmit = async () => {
    if (!audioBlob) {
      alert('Please record your complaint first');
      return;
    }
    
    setLoading(true);
    try {
      await ticketService.uploadVoiceComplaint(audioBlob, {
        brand_id: 1,
        channel: 'voice',
      });
      alert('Voice complaint submitted successfully!');
      navigate('/user/dashboard');
    } catch (error) {
      console.error('Failed to submit voice complaint:', error);
      alert('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div style={styles.stepContent}>
      <h3 style={styles.stepTitle}>Select Brand & Category</h3>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Which brand is this complaint about?</label>
        <select
          value={complaintData.brand}
          onChange={(e) => setComplaintData({ ...complaintData, brand: e.target.value })}
          style={styles.select}
        >
          <option value="">Select a brand</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>What type of issue is this?</label>
        <div style={styles.categoryGrid}>
          <button
            style={complaintData.category === 'complaint' ? styles.categoryButtonActive : styles.categoryButton}
            onClick={() => setComplaintData({ ...complaintData, category: 'complaint' })}
          >
            <span style={styles.categoryIcon}>😠</span>
            <span>Complaint</span>
            <small>Report a problem</small>
          </button>
          <button
            style={complaintData.category === 'feedback' ? styles.categoryButtonActive : styles.categoryButton}
            onClick={() => setComplaintData({ ...complaintData, category: 'feedback' })}
          >
            <span style={styles.categoryIcon}>💭</span>
            <span>Feedback</span>
            <small>Share experience</small>
          </button>
          <button
            style={complaintData.category === 'suggestion' ? styles.categoryButtonActive : styles.categoryButton}
            onClick={() => setComplaintData({ ...complaintData, category: 'suggestion' })}
          >
            <span style={styles.categoryIcon}>💡</span>
            <span>Suggestion</span>
            <small>Propose improvement</small>
          </button>
          <button
            style={complaintData.category === 'support' ? styles.categoryButtonActive : styles.categoryButton}
            onClick={() => setComplaintData({ ...complaintData, category: 'support' })}
          >
            <span style={styles.categoryIcon}>❓</span>
            <span>Support</span>
            <small>Need help</small>
          </button>
        </div>
      </div>
      
      <div style={styles.navigationButtons}>
        <button
          onClick={() => navigate('/user/dashboard')}
          style={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          onClick={() => setStep(2)}
          style={styles.nextButton}
          disabled={!complaintData.brand || !complaintData.category}
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div style={styles.stepContent}>
      <h3 style={styles.stepTitle}>Choose How to Submit</h3>
      
      <div style={styles.channelOptions}>
        <div
          style={complaintData.channel === 'voice' ? styles.channelCardActive : styles.channelCard}
          onClick={() => setComplaintData({ ...complaintData, channel: 'voice' })}
        >
          <div style={styles.channelIcon}>🎤</div>
          <h4>Voice Recording</h4>
          <p>Record your complaint in your own words</p>
          <ul style={styles.channelFeatures}>
            <li>Express yourself naturally</li>
            <li>Faster than typing</li>
            <li>AI-powered transcription</li>
          </ul>
        </div>
        
        <div
          style={complaintData.channel === 'web' ? styles.channelCardActive : styles.channelCard}
          onClick={() => setComplaintData({ ...complaintData, channel: 'web' })}
        >
          <div style={styles.channelIcon}>⌨️</div>
          <h4>Text Form</h4>
          <p>Type out your complaint in detail</p>
          <ul style={styles.channelFeatures}>
            <li>Structured format</li>
            <li>Add specific details</li>
            <li>Review before sending</li>
          </ul>
        </div>
      </div>
      
      <div style={styles.alternativeOptions}>
        <p>Other ways to submit:</p>
        <div style={styles.contactMethods}>
          <div style={styles.contactMethod}>
            <span>📞</span>
            <div>
              <strong>Call Toll-Free</strong>
              <p>1-800-COMPLAIN</p>
            </div>
          </div>
          <div style={styles.contactMethod}>
            <span>💬</span>
            <div>
              <strong>WhatsApp</strong>
              <p>+91-9876543210</p>
            </div>
          </div>
        </div>
      </div>
      
      <div style={styles.navigationButtons}>
        <button
          onClick={() => setStep(1)}
          style={styles.backButton}
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          style={styles.nextButton}
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderStep3Text = () => (
    <div style={styles.stepContent}>
      <h3 style={styles.stepTitle}>Describe Your {complaintData.category}</h3>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>What happened?</label>
        <textarea
          value={complaintData.description}
          onChange={(e) => setComplaintData({ ...complaintData, description: e.target.value })}
          style={styles.textarea}
          placeholder="Please describe your issue in detail..."
          rows={6}
        />
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Product/Service Details</label>
        <input
          type="text"
          value={complaintData.productDetails}
          onChange={(e) => setComplaintData({ ...complaintData, productDetails: e.target.value })}
          style={styles.input}
          placeholder="e.g., Order #12345, Product name, Date of purchase"
        />
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>What resolution are you expecting?</label>
        <textarea
          value={complaintData.expectedResolution}
          onChange={(e) => setComplaintData({ ...complaintData, expectedResolution: e.target.value })}
          style={styles.textarea}
          placeholder="e.g., Refund, Replacement, Apology, etc."
          rows={3}
        />
      </div>
      
      <div style={styles.infoBox}>
        <p>📌 <strong>Important:</strong> Brands have 24 hours to resolve complaints without charge. After 24 hours, a ₹50 fee applies to encourage timely resolution.</p>
      </div>
      
      <div style={styles.navigationButtons}>
        <button
          onClick={() => setStep(2)}
          style={styles.backButton}
        >
          Back
        </button>
        <button
          onClick={handleTextSubmit}
          style={styles.submitButton}
          disabled={loading || !complaintData.description}
        >
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </div>
    </div>
  );

  const renderStep3Voice = () => (
    <div style={styles.stepContent}>
      <h3 style={styles.stepTitle}>Record Your {complaintData.category}</h3>
      
      <div style={styles.recordingInstructions}>
        <p>Click the microphone button below to start recording. Include:</p>
        <ul>
          <li>The product or service you're complaining about</li>
          <li>What went wrong</li>
          <li>When it happened</li>
          <li>What resolution you're expecting</li>
        </ul>
      </div>
      
      <div style={styles.recordingSection}>
        {!audioBlob ? (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            style={isRecording ? styles.recordingButtonActive : styles.recordingButton}
          >
            {isRecording ? (
              <>
                <span style={styles.recordingIcon}>⏹</span>
                <span>Stop Recording</span>
                <span style={styles.recordingTime}>Recording...</span>
              </>
            ) : (
              <>
                <span style={styles.recordingIcon}>🎤</span>
                <span>Start Recording</span>
              </>
            )}
          </button>
        ) : (
          <div style={styles.audioPreview}>
            <p style={styles.successMessage}>✅ Recording saved!</p>
            <audio controls style={styles.audioPlayer}>
              <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
            </audio>
            <button
              onClick={() => {
                setAudioBlob(null);
                setIsRecording(false);
              }}
              style={styles.rerecordButton}
            >
              🔄 Record Again
            </button>
          </div>
        )}
      </div>
      
      <div style={styles.infoBox}>
        <p>📌 <strong>Tip:</strong> Speak clearly and keep your recording under 3 minutes for best results.</p>
      </div>
      
      <div style={styles.navigationButtons}>
        <button
          onClick={() => setStep(2)}
          style={styles.backButton}
        >
          Back
        </button>
        <button
          onClick={handleVoiceSubmit}
          style={styles.submitButton}
          disabled={loading || !audioBlob}
        >
          {loading ? 'Submitting...' : 'Submit Voice Complaint'}
        </button>
      </div>
    </div>
  );

  const renderProgressBar = () => (
    <div style={styles.progressBar}>
      <div style={styles.progressStep}>
        <div style={step >= 1 ? styles.progressCircleActive : styles.progressCircle}>1</div>
        <span style={styles.progressLabel}>Select Brand</span>
      </div>
      <div style={step >= 2 ? styles.progressLineActive : styles.progressLine} />
      <div style={styles.progressStep}>
        <div style={step >= 2 ? styles.progressCircleActive : styles.progressCircle}>2</div>
        <span style={styles.progressLabel}>Choose Method</span>
      </div>
      <div style={step >= 3 ? styles.progressLineActive : styles.progressLine} />
      <div style={styles.progressStep}>
        <div style={step >= 3 ? styles.progressCircleActive : styles.progressCircle}>3</div>
        <span style={styles.progressLabel}>Submit Details</span>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.logo}>ComplaintHub</div>
          <button onClick={() => navigate('/user/dashboard')} style={styles.closeButton}>
            ✕ Close
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Submit New Complaint</h2>
          
          {renderProgressBar()}
          
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && complaintData.channel === 'web' && renderStep3Text()}
          {step === 3 && complaintData.channel === 'voice' && renderStep3Voice()}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f7fa',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  header: {
    background: 'white',
    padding: '20px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  headerContainer: {
    maxWidth: '800px',
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
  closeButton: {
    padding: '8px 16px',
    background: 'none',
    border: '1px solid #e1e8ed',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#7f8c8d',
    fontWeight: '500',
  },
  main: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '0 20px',
  },
  formContainer: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '30px',
    textAlign: 'center',
  },
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  progressCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#e1e8ed',
    color: '#7f8c8d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
  },
  progressCircleActive: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#3498db',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
  },
  progressLine: {
    width: '100px',
    height: '2px',
    background: '#e1e8ed',
    margin: '0 10px',
  },
  progressLineActive: {
    width: '100px',
    height: '2px',
    background: '#3498db',
    margin: '0 10px',
  },
  progressLabel: {
    fontSize: '12px',
    color: '#7f8c8d',
  },
  stepContent: {
    marginTop: '30px',
  },
  stepTitle: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '25px',
  },
  formGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '600',
    color: '#495057',
    fontSize: '15px',
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e1e8ed',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'pointer',
    background: 'white',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e1e8ed',
    borderRadius: '8px',
    fontSize: '15px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e1e8ed',
    borderRadius: '8px',
    fontSize: '15px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
  },
  categoryButton: {
    padding: '20px',
    border: '2px solid #e1e8ed',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.3s',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  categoryButtonActive: {
    padding: '20px',
    border: '2px solid #3498db',
    borderRadius: '8px',
    background: '#f0f8ff',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.3s',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  categoryIcon: {
    fontSize: '32px',
  },
  channelOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  channelCard: {
    padding: '25px',
    border: '2px solid #e1e8ed',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.3s',
  },
  channelCardActive: {
    padding: '25px',
    border: '2px solid #3498db',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'center',
    background: '#f0f8ff',
  },
  channelIcon: {
    fontSize: '48px',
    marginBottom: '15px',
  },
  channelFeatures: {
    listStyle: 'none',
    padding: 0,
    margin: '15px 0 0 0',
    textAlign: 'left',
    fontSize: '14px',
    color: '#7f8c8d',
  },
  alternativeOptions: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px',
  },
  contactMethods: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '15px',
  },
  contactMethod: {
    display: 'flex',
    gap: '15px',
    alignItems: 'flex-start',
  },
  recordingInstructions: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  recordingSection: {
    textAlign: 'center',
    margin: '40px 0',
  },
  recordingButton: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontSize: '18px',
    fontWeight: '600',
    transition: 'all 0.3s',
    margin: '0 auto',
  },
  recordingButtonActive: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: '#27ae60',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontSize: '18px',
    fontWeight: '600',
    animation: 'pulse 1.5s infinite',
    margin: '0 auto',
  },
  recordingIcon: {
    fontSize: '48px',
  },
  recordingTime: {
    fontSize: '14px',
    opacity: 0.9,
  },
  audioPreview: {
    textAlign: 'center',
  },
  successMessage: {
    color: '#27ae60',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
  },
  audioPlayer: {
    width: '100%',
    maxWidth: '400px',
    marginBottom: '20px',
  },
  rerecordButton: {
    padding: '10px 20px',
    background: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  infoBox: {
    background: '#fff3cd',
    border: '1px solid #ffeaa7',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  navigationButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px',
    marginTop: '30px',
  },
  backButton: {
    padding: '12px 30px',
    background: 'white',
    color: '#7f8c8d',
    border: '2px solid #e1e8ed',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
  },
  nextButton: {
    padding: '12px 30px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
  },
  cancelButton: {
    padding: '12px 30px',
    background: 'white',
    color: '#e74c3c',
    border: '2px solid #e74c3c',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
  },
  submitButton: {
    padding: '12px 30px',
    background: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
  },
};