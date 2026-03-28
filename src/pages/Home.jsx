import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Shield, Star, CheckCircle2, ChevronRight,
  Dog, Cat, Bird, ArrowRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const services = [
  { id: 'grooming', icon: <Dog size={32} />, title: "Grooming", price: "45", desc: "Full-service spa treatments, baths, and stylish haircuts." },
  { id: 'boarding', icon: <Dog size={32} />, title: "Luxury Boarding", price: "60", desc: "Climate-controlled suites with 24/7 care." },
  { id: 'daycare', icon: <Dog size={32} />, title: "Pet Daycare", price: "30", desc: "Socialization and play in a safe environment." },
];

const pets = [
  { id: 1, name: 'Bella', breed: 'Golden Retriever', age: '2 Years', char: 'Friendly', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Luna', breed: 'Siamese Cat', age: '1 Year', char: 'Quiet', img: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Charlie', breed: 'Beagle', age: '3 Years', char: 'Curious', img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400' },
];

function Hero() {
  const navigate = useNavigate();
  return (
    <section className="responsive-section" style={{ 
      minHeight: '90vh', 
      display: 'flex', 
      alignItems: 'center',
      background: 'radial-gradient(circle at 10% 20%, rgba(92, 124, 250, 0.03) 0%, transparent 40%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container grid-2" style={{ alignItems: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '10px', 
            padding: '8px 16px', 
            background: 'white', 
            borderRadius: '100px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            marginBottom: '24px',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'var(--primary)'
          }}>
            <span style={{ fontSize: '1.2rem' }}>⭐</span> Trusted by 5,000+ Pet Owners
          </div>
          <h1 style={{ marginBottom: '24px' }}>
            Where Every Pet <br />
            Is Treated Like <span className="gradient-text">Family.</span>
          </h1>
          <p style={{ maxWidth: '540px', marginBottom: '40px', fontSize: '1.1rem' }}>
            Premium boarding, grooming, and daycare services tailored to your pet's unique personality. Experience why we're the city's favorite pet sanctuary.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/book')}
              className="btn btn-primary" 
              style={{ padding: '18px 40px', fontSize: '1.1rem' }}
            >
              Book Now <ChevronRight size={20} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/services')}
              className="btn btn-outline" 
              style={{ padding: '18px 40px', fontSize: '1.1rem' }}
            >
              Our Services
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ position: 'relative' }}
        >
          <div style={{ 
            borderRadius: '40px', 
            overflow: 'hidden', 
            boxShadow: '0 30px 60px rgba(0,0,0,0.1)', 
            transform: 'rotate(2deg)',
            border: '8px solid white'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=1000" 
              alt="Happy Dog" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            style={{ 
              position: 'absolute', 
              bottom: '40px', 
              left: '-40px', 
              background: 'white', 
              padding: '24px', 
              borderRadius: '24px', 
              boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              zIndex: 10
            }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
              <Heart fill="currentColor" />
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>100% Care</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Happiness Guaranteed</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <main>
      <Hero />

      {/* Services Preview Section */}
      <section className="responsive-section" style={{ background: 'white' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'flex-end', marginBottom: '80px' }}>
            <div style={{ maxWidth: '600px' }}>
              <h2 style={{ marginBottom: '24px' }}>Premier Pet Care <span className="gradient-text">Excellence.</span></h2>
              <p>Tailored treatments in a safe, loving environment.</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/services" className="btn btn-outline" style={{ borderRadius: '12px' }}>
                View All Services <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {services.map((service, index) => (
              <motion.div 
                key={index} 
                className="premium-card"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                onClick={() => { localStorage.setItem('selected_service', service.id); navigate('/book'); }}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '24px' }}>
                  {service.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{service.title}</h3>
                <p style={{ marginBottom: '24px' }}>{service.desc}</p>
                <div style={{ color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Book Now <ChevronRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Adoption Preview Section */}
      <section className="responsive-section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ marginBottom: '24px' }}>Find Your Forever <span className="gradient-text">Friend.</span></h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}> Loving companions waiting for a home. Start your journey today.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '40px', marginBottom: '60px' }}>
            {pets.map((pet, index) => (
              <motion.div 
                key={pet.id} 
                className="premium-card"
                style={{ padding: '0', overflow: 'hidden' }}
              >
                <img src={pet.img} alt={pet.name} style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
                <div style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{pet.name}</h3>
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{pet.age}</span>
                  </div>
                  <p style={{ marginBottom: '32px', color: '#64748b' }}>A wonderful {pet.breed} looking for love.</p>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { localStorage.setItem('selected_pet', JSON.stringify({ name: pet.name, type: pet.breed.toLowerCase().includes('cat') ? 'cat' : 'dog' })); navigate('/book'); }}
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                  >
                    Adopt Me
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/adoption" className="btn btn-outline" style={{ padding: '18px 48px', borderRadius: '16px' }}>
              View All Pets <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="responsive-section" style={{ background: '#0f172a', color: 'white' }}>
        <div className="container grid-2">
          <div>
            <h2 style={{ color: 'white', marginBottom: '40px' }}>Experience World-Class <span style={{ color: 'var(--primary)' }}>Pet Care.</span></h2>
            <div style={{ display: 'grid', gap: '32px' }}>
              {[
                { title: 'Safety First', desc: 'Our facility meets the highest international safety standards.' },
                { title: 'Global Standards', desc: 'Every staff member is a certified professional.' },
                { title: 'Smart Tracking', desc: 'Get HD photos and video updates of your pet.' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 style={{ color: 'white', marginBottom: '8px' }}>{item.title}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderRadius: '40px', overflow: 'hidden', transform: 'rotate(-2deg)' }}>
            <img src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=1200" alt="Pet Care" style={{ width: '100%' }} />
          </div>
        </div>
      </section>

      {/* Modern CTA */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ background: 'var(--primary)', padding: '80px', borderRadius: '40px', textAlign: 'center', color: 'white' }}>
            <h2 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '24px' }}>Ready to Get Started?</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.25rem', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>Join thousands of happy pet owners and experience the PetPal difference today.</p>
            <div className="grid-2" style={{ gap: '20px', justifyContent: 'center' }}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="btn" 
                style={{ background: 'white', color: 'var(--primary)', padding: '20px 48px' }}
              >
                Join Now
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/book')}
                className="btn btn-outline" 
                style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'white', background: 'transparent', padding: '20px 48px' }}
              >
                Book a Stay
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
