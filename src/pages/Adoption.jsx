import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Filter, Dog, Cat, Bird, ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

export default function Adoption() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pets');
      setPets(response.data);
    } catch (err) {
      addToast('Failed to load pets.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = filter === 'all' ? pets : pets.filter(p => p.type === filter);

  const handleAdopt = (pet) => {
    addToast(`Interested in ${pet.name}! Let's check availability...`, 'info');
    localStorage.setItem('selected_pet', JSON.stringify({ name: pet.name, type: pet.type }));
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
      {/* Search & Filter Header */}
      <section style={{ padding: '60px 0', background: 'white', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <h1 style={{ fontSize: '3rem', margin: 0 }}>Find Your <span className="gradient-text">Companion.</span></h1>
            <p style={{ marginTop: '12px', fontSize: '1.2rem' }}>We have {pets.length} loving souls waiting for a second chance at life.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', background: '#f1f5f9', padding: '8px', borderRadius: '16px' }}>
            {[
              { id: 'all', label: 'All Pets', icon: <Heart size={18} /> },
              { id: 'dog', label: 'Dogs', icon: <Dog size={18} /> },
              { id: 'cat', label: 'Cats', icon: <Cat size={18} /> },
              { id: 'other', label: 'Other', icon: <Bird size={18} /> }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: filter === f.id ? 'white' : 'transparent',
                  color: filter === f.id ? 'var(--primary)' : '#64748b',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: filter === f.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                  transition: '0.3s'
                }}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '80px 0 120px' }}>
        <motion.div 
          layout
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '40px' }}
        >
          <AnimatePresence mode='popLayout'>
            {filteredPets.map((pet) => (
              <motion.div 
                key={pet.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="premium-card"
                style={{ padding: '0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ height: '300px', position: 'relative', overflow: 'hidden' }}>
                  <img src={pet.img} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', cursor: 'pointer' }}>
                      <Heart size={20} />
                    </div>
                  </div>
                </div>

                <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{pet.name}</h3>
                    <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary)', background: 'var(--primary-soft)', padding: '6px 12px', borderRadius: '100px' }}>{pet.age}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>{pet.breed}</span>
                    <span style={{ color: '#e2e8f0' }}>•</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>{pet.char}</span>
                  </div>

                  <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', marginBottom: '32px', lineHeight: '1.6' }}>{pet.description}</p>

                  <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '12px' }}>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', color: '#64748b' }}><Info size={20} /></div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAdopt(pet)}
                      className="btn btn-primary" 
                      style={{ height: '52px', fontWeight: '800' }}
                    >
                      Enquire About {pet.name}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
