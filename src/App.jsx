import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Services from './pages/Services';
import Adoption from './pages/Adoption';
import Booking from './pages/Booking';
import { ToastProvider, useToast } from './context/ToastContext';
import { PawPrint, User, LogIn, LayoutDashboard, LogOut } from 'lucide-react';

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const location = useLocation();
  const { addToast } = useToast();

  const handleLogout = () => {
    localStorage.clear();
    addToast('Logged out successfully!', 'info');
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🐾</span>
          <span className="logo-text">PetPal</span>
        </Link>
        <nav className="nav-links">
          <Link to="/services" style={{ color: location.pathname === '/services' ? 'var(--primary)' : 'inherit' }}>Services</Link>
          <Link to="/adoption" style={{ color: location.pathname === '/adoption' ? 'var(--primary)' : 'inherit' }}>Adoption</Link>
          <Link to="/book" className="btn btn-outline" style={{ padding: '10px 24px', borderRadius: '12px' }}>Book Now</Link>
        </nav>
        <div className="nav-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', cursor: 'default' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>{user.username}</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{user.role}</span>
              </div>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '0.85rem', color: '#0f172a' }}>
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="btn btn-outline" 
                style={{ padding: '10px 20px', fontSize: '0.85rem', color: '#ef4444', borderColor: '#fee2e2' }}
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '12px 28px' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '12px 28px' }}>Join Now</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: 'white', padding: '100px 0 60px' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '60px' }}>
        <div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-1px' }}>
            <span>🐾</span> PetPal
          </div>
          <p style={{ color: '#94a3b8', lineHeight: '1.8', maxWidth: '320px', fontSize: '1rem' }}>Providing world-class pet care since 2024. Your family is our family.</p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            {['Twitter', 'Instagram', 'Facebook'].map(social => (
              <div key={social} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: '10px' }}>{social[0]}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ marginBottom: '24px', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#4f46e5' }}>Services</h4>
          <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8', display: 'grid', gap: '16px' }}>
            <li><Link to="/services" style={{ color: 'inherit', textDecoration: 'none' }}>Pet Grooming</Link></li>
            <li><Link to="/services" style={{ color: 'inherit', textDecoration: 'none' }}>Luxury Boarding</Link></li>
            <li><Link to="/book" style={{ color: 'inherit', textDecoration: 'none' }}>Express Booking</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '24px', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#4f46e5' }}>Company</h4>
          <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8', display: 'grid', gap: '16px' }}>
            <li><Link to="/register" style={{ color: 'inherit', textDecoration: 'none' }}>Join Member</Link></li>
            <li><Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Member Login</Link></li>
            <li><Link to="/adoption" style={{ color: 'inherit', textDecoration: 'none' }}>Adopt a Friend</Link></li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '80px', paddingTop: '40px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        &copy; 2026 PetPal Premier Care Services. All rights reserved.
      </div>
    </footer>
  );
}

function PageWrapper({ children }) {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <PageWrapper>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/services" element={<Services />} />
                <Route path="/adoption" element={<Adoption />} />
                <Route path="/book" element={<Booking />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </PageWrapper>
      </Router>
    </ToastProvider>
  );
}

export default App;
