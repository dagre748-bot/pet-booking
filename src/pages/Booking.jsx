import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, ChevronRight, User, Calendar, 
  MapPin, Clock, Heart, Shield, LogIn, UserPlus 
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Booking() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    pet_name: '',
    pet_type: 'dog',
    service: '',
    booking_date: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services');
      setServices(response.data);
      
      // Handle pre-selection or default
      const selectedService = localStorage.getItem('selected_service');
      const selectedPet = JSON.parse(localStorage.getItem('selected_pet') || 'null');

      if (selectedPet) {
        setFormData(prev => ({ 
          ...prev, 
          pet_name: selectedPet.name, 
          pet_type: selectedPet.type,
          service: response.data[0]?.id || ''
        }));
        localStorage.removeItem('selected_pet');
      } else {
        setFormData(prev => ({ 
          ...prev, 
          service: selectedService || response.data[0]?.id || '' 
        }));
        localStorage.removeItem('selected_service');
      }
    } catch (err) {
      addToast('Failed to load services.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setStep(4); // Auth Gate
      return;
    }
    
    setSubmitLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/bookings', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast('Booking confirmed successfully!', 'success');
      setStep(3);
    } catch (err) {
      addToast(err.response?.data?.error || 'Booking failed. Try again.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg)' }}>
        <div className="spin" style={{ width: '40px', height: '40px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container" style={{ maxWidth: '1000px', paddingBottom: '120px' }}>
        
        {/* Progress Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '24px', left: 0, right: 0, height: '2px', background: '#e2e8f0', zIndex: 0 }} />
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              style={{ 
                zIndex: 1, 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                background: step >= s ? 'var(--primary)' : 'white', 
                color: step >= s ? 'white' : '#cbd5e1', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: '900', 
                border: `2px solid ${step >= s ? 'var(--primary)' : '#e2e8f0'}`,
                transition: '0.3s'
              }}
            >
              {step > s || (step === 3 && s === 3) ? <CheckCircle2 size={24} /> : s}
            </div>
          ))}
        </div>

        <div className="premium-card" style={{ padding: '0', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1.2fr 1fr' }}>
          <div style={{ padding: '60px', background: 'white' }}>
            <AnimatePresence mode='wait'>
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Tell us about your pet</h2>
                  <p style={{ color: '#64748b', marginBottom: '40px' }}>Start with the basics so we can prepare the perfect stay.</p>
                  
                  <div className="form-group" style={{ marginBottom: '32px' }}>
                    <label style={{ fontWeight: '700', marginBottom: '12px', display: 'block' }}>Pet Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Luna"
                      value={formData.pet_name}
                      onChange={(e) => setFormData({...formData, pet_name: e.target.value})}
                      style={{ padding: '18px 24px' }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontWeight: '700', marginBottom: '12px', display: 'block' }}>Pet Type</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      {['dog', 'cat', 'other'].map(type => (
                        <button
                          key={type}
                          onClick={() => setFormData({...formData, pet_type: type})}
                          style={{
                            padding: '20px',
                            borderRadius: '16px',
                            border: `2px solid ${formData.pet_type === type ? 'var(--primary)' : '#f1f5f9'}`,
                            background: formData.pet_type === type ? 'var(--primary-soft)' : '#f8fafc',
                            color: formData.pet_type === type ? 'var(--primary)' : '#64748b',
                            fontWeight: '700',
                            textTransform: 'capitalize'
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!formData.pet_name}
                    onClick={() => { setStep(2); addToast('Continuing to Step 2...', 'info'); }}
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '48px', height: '60px' }}
                  >
                    Next Step <ChevronRight size={20} />
                  </motion.button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Service & Date</h2>
                  <p style={{ color: '#64748b', marginBottom: '40px' }}>When should we expect {formData.pet_name}?</p>

                  <div className="form-group" style={{ marginBottom: '32px' }}>
                    <label style={{ fontWeight: '700', marginBottom: '12px', display: 'block' }}>Choose Service</label>
                    <select 
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                      style={{ padding: '18px 24px' }}
                    >
                      {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ fontWeight: '700', marginBottom: '12px', display: 'block' }}>Preferred Date</label>
                    <input 
                      type="date"
                      value={formData.booking_date}
                      onChange={(e) => setFormData({...formData, booking_date: e.target.value})}
                      style={{ padding: '18px 24px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginTop: '48px' }}>
                    <button onClick={() => setStep(1)} className="btn btn-outline" style={{ height: '60px' }}>Back</button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={submitLoading || !formData.booking_date}
                      onClick={handleSubmit}
                      className="btn btn-primary" 
                      style={{ height: '60px' }}
                    >
                      {submitLoading ? 'Confirming...' : 'Complete Booking'}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '40px 0' }}
                >
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>All Set!</h2>
                  <p style={{ color: '#64748b', marginBottom: '40px', fontSize: '1.1rem' }}>We've received your request for <strong>{formData.pet_name}</strong>. Our team will review and confirm shortly via email.</p>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/')}
                    className="btn btn-primary" 
                    style={{ padding: '16px 48px' }}
                  >
                    Return Home
                  </motion.button>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{ width: '70px', height: '70px', borderRadius: '24px', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                    <Heart size={36} fill="currentColor" />
                  </div>
                  <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Ready to Book?</h2>
                  <p style={{ color: '#64748b', marginBottom: '48px' }}>Join the PetPal family to complete your reservation. It only takes a minute!</p>
                  
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <Link to="/register" className="btn btn-primary" style={{ width: '100%', height: '56px' }}>
                      <UserPlus size={20} /> Create New Account
                    </Link>
                    <Link to="/login" className="btn btn-outline" style={{ width: '100%', height: '56px', border: 'none', background: '#f8fafc' }}>
                      <LogIn size={20} /> Login to Existing
                    </Link>
                    <button onClick={() => setStep(2)} style={{ marginTop: '12px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer' }}>Go Back</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ background: '#0f172a', padding: '60px', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '32px' }}>Booking Summary</h3>
            
            <div style={{ display: 'grid', gap: '24px', flex: 1 }}>
              <div style={{ opacity: formData.pet_name ? 1 : 0.3, display: 'flex', gap: '16px' }}>
                <div style={{ color: 'var(--primary)' }}><User size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Pet Companion</div>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{formData.pet_name || 'Not yet named'}</div>
                </div>
              </div>

              <div style={{ opacity: formData.booking_date ? 1 : 0.3, display: 'flex', gap: '16px' }}>
                <div style={{ color: 'var(--primary)' }}><Calendar size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Service Date</div>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{formData.booking_date ? new Date(formData.booking_date).toLocaleDateString() : 'Pick a date'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ color: 'var(--primary)' }}><Shield size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Selected Service</div>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{services.find(s => s.id === formData.service)?.title}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} color="#10b981" />
                No cancellation fees
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', fontSize: '0.9rem', marginTop: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" />
                24/7 Support included
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
