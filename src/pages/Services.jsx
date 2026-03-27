import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Scissors, Hotel, PlayCircle, GraduationCap, 
  Heart, Shield, CheckCircle2, ChevronRight, 
  Waves, Thermometer, UserCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const iconMap = {
  Scissors: <Scissors size={32} />,
  Hotel: <Hotel size={32} />,
  PlayCircle: <PlayCircle size={32} />,
  GraduationCap: <GraduationCap size={32} />,
  Waves: <Waves size={32} />,
  UserCheck: <UserCheck size={32} />,
  Thermometer: <Thermometer size={32} />,
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services');
      setServices(response.data);
    } catch (err) {
      addToast('Failed to load services.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (s) => {
    addToast(`${s.title} selected! Redirecting to booking...`, 'success');
    localStorage.setItem('selected_service', s.id);
    setTimeout(() => {
      navigate('/book');
      window.scrollTo(0, 0);
    }, 800);
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
      <header style={{ padding: '80px 0', textAlign: 'center', background: 'white', marginBottom: '60px' }}>
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '24px' }}
          >
            World-Class Pet <span className="gradient-text">Care Services.</span>
          </motion.h1>
          <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem' }}>
            From luxury spa treatments to advanced hydrotherapy, discover our range of premium services designed to keep your pet happy, healthy, and thriving.
          </p>
        </div>
      </header>

      <section className="container" style={{ paddingBottom: '120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
          {services.map((s, i) => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="premium-card"
              style={{ padding: '48px', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  {iconMap[s.icon] || <CheckCircle2 size={32} />}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '4px' }}>Starting From</div>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--dark)' }}>${s.price}</div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.75rem', marginBottom: '16px' }}>{s.title}</h3>
              <p style={{ marginBottom: '32px', flex: 1 }}>{s.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '40px' }}>
                {s.features && s.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: '600' }}>
                    <CheckCircle2 size={16} color="var(--primary)" />
                    {f}
                  </div>
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(s)}
                className="btn btn-primary" 
                style={{ width: '100%', height: '56px', fontSize: '1.1rem' }}
              >
                Book {s.title} <ChevronRight size={18} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Experience Our Packages */}
      <section style={{ padding: '120px 0', background: 'var(--dark)', color: 'white' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: 'white', marginBottom: '32px', fontSize: '3.5rem' }}>The PetPal <span style={{ color: 'var(--primary)' }}>Standards.</span></h2>
            <div style={{ display: 'grid', gap: '32px' }}>
              {[
                { title: 'Certified Specialists', desc: 'Every service is performed by industry-certified experts who prioritize your pet\'s safety.' },
                { title: 'Hygiene Protocols', desc: 'Surgical-grade sanitation between every grooming session and daycare transition.' },
                { title: 'AI Monitoring', desc: 'Behavioral analysis tools to ensure playgroups are always safe and harmonious.' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 style={{ color: 'white', marginBottom: '8px' }}>{item.title}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderRadius: '32px', overflow: 'hidden', transform: 'rotate(2deg)', border: '12px solid rgba(255,255,255,0.02)' }}>
            <img 
              src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=1000" 
              alt="Premium Service" 
              style={{ width: '100%', display: 'block' }} 
            />
          </div>
        </div>
      </section>
    </div>
  );
}
