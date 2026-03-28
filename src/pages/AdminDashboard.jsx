import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Calendar, CheckCircle, Clock, Trash2, 
  Search, RefreshCw, LayoutDashboard, Settings, 
  LogOut, ShieldCheck, Plus, Pencil, Dog, Briefcase, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [data, setData] = useState({ bookings: [], users: [], pets: [], settings: {} });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // { type: 'user' | 'pet', data: {} }
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      fetchAllData();
    }
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [bookingsRes, usersRes, petsRes, settingsRes] = await Promise.all([
        axios.get('/api/bookings', { headers }),
        axios.get('/api/users', { headers }),
        axios.get('/api/pets'),
        axios.get('/api/settings', { headers })
      ]);

      setData({
        bookings: bookingsRes.data,
        users: usersRes.data,
        pets: petsRes.data,
        settings: settingsRes.data
      });
    } catch (err) {
      addToast('Failed to sync administrative data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (type, id, updates) => {
    setProcessingId(id);
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'user' ? `users/${id}` : type === 'booking' ? `bookings/${id}` : `pets/${id}`;
      await axios.patch(`/api/${endpoint}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast('Update successful!', 'success');
      setEditingItem(null);
      fetchAllData();
    } catch (err) {
      addToast('Update failed.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handlePetSubmit = async (petData) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      if (petData.id) {
        await axios.patch(`/api/pets/${petData.id}`, petData, { headers });
      } else {
        await axios.post('/api/pets', petData, { headers });
      }
      addToast('Pet data saved!', 'success');
      setEditingItem(null);
      fetchAllData();
    } catch (err) {
      addToast('Failed to save pet data.', 'error');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/${type}s/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast('Deleted successfully.', 'success');
      fetchAllData();
    } catch (err) {
      addToast('Delete failed.', 'error');
    }
  };

  const handleSaveSettings = async (settings) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch('/api/settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast('Settings saved!', 'success');
      fetchAllData();
    } catch (err) {
      addToast('Failed to save settings.', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    addToast('Admin signed out.', 'info');
    setTimeout(() => navigate('/login'), 500);
  };

  const menuItems = [
    { id: 'bookings', label: 'Bookings', icon: <Calendar size={20} /> },
    { id: 'clients', label: 'Clients', icon: <Users size={16} /> },
    { id: 'pets', label: 'Pets & Gallery', icon: <Dog size={16} /> },
    { id: 'settings', label: 'Site Settings', icon: <Settings size={16} /> },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar Toggle for Mobile */}
      <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? <X size={24} /> : <LayoutDashboard size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'active' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-1px' }}>
          <ShieldCheck color="#4f46e5" size={28} />
          <span>Staff Portal</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map(item => (
            <div
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                cursor: 'pointer',
                backgroundColor: activeTab === item.id ? '#4f46e5' : 'transparent',
                color: activeTab === item.id ? 'white' : '#94a3b8',
                fontWeight: activeTab === item.id ? '700' : '600',
                transition: '0.2s',
                fontSize: '0.9rem'
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', width: '100%', fontWeight: '600', padding: 0 }}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '8px', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px' }}>
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
            <p style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}>Administrative Control Center</p>
          </div>
          <button 
            onClick={fetchAllData} 
            className="btn btn-outline" 
            style={{ borderRadius: '12px', padding: '10px 20px', fontSize: '0.9rem' }}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} /> Sync
          </button>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'bookings' && (
            <motion.div key="bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <StatCard label="Requests" value={data.bookings.length} color="#4f46e5" />
                <StatCard label="Pending" value={data.bookings.filter(b => b.status === 'pending').length} color="#f59e0b" />
                <StatCard label="Done" value={data.bookings.filter(b => b.status === 'completed').length} color="#10b981" />
              </div>
              <div className="table-responsive">
                <Table 
                  headers={['Owner / Pet', 'Service', 'Date', 'Status', 'Actions']}
                  data={data.bookings}
                  renderRow={(b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.9rem' }}>{b.owner_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.pet_name} • {b.pet_type}</div>
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: '600', color: '#0f172a', fontSize: '0.9rem' }}>{b.service}</td>
                      <td style={{ padding: '16px 24px', color: '#475569', fontSize: '0.85rem' }}>{new Date(b.booking_date).toLocaleDateString()}</td>
                      <td style={{ padding: '16px 24px' }}><StatusBadge status={b.status} /></td>
                      <td style={{ padding: '16px 24px' }}>
                        <button 
                          disabled={processingId === b.id}
                          onClick={() => handleStatusUpdate('booking', b.id, { status: b.status === 'pending' ? 'completed' : 'pending' })}
                          className="btn btn-outline"
                          style={{ padding: '6px 12px', fontSize: '0.7rem', borderRadius: '8px' }}
                        >
                          {processingId === b.id ? <RefreshCw size={12} className="spin" /> : (b.status === 'pending' ? 'Approve' : 'Revert')}
                        </button>
                      </td>
                    </tr>
                  )}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'clients' && (
            <motion.div key="clients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-responsive">
              <Table 
                headers={['User', 'Email', 'Role', 'Actions']}
                data={data.users}
                renderRow={(u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 24px', fontWeight: '800', color: '#0f172a', fontSize: '0.9rem' }}>{u.username}</td>
                    <td style={{ padding: '16px 24px', color: '#475569', fontSize: '0.85rem' }}>{u.email}</td>
                    <td style={{ padding: '16px 24px' }}><span style={{ padding: '4px 10px', borderRadius: '100px', backgroundColor: u.role === 'admin' ? '#fee2e2' : '#f1f5f9', color: u.role === 'admin' ? '#991b1b' : '#475569', fontSize: '0.7rem', fontWeight: '800' }}>{u.role}</span></td>
                    <td style={{ padding: '16px 24px' }}>
                        <button onClick={() => setEditingItem({ type: 'user', data: u })} className="btn btn-outline" style={{ padding: '6px' }}><Pencil size={14} /></button>
                    </td>
                  </tr>
                )}
              />
            </motion.div>
          )}

          {activeTab === 'pets' && (
            <motion.div key="pets" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setEditingItem({ type: 'pet', data: { name: '', type: 'dog', breed: '', age: '', char: '', img: '', description: '', status: 'available' } })}
                  className="btn btn-primary" 
                  style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '0.9rem' }}
                >
                  <Plus size={18} /> Add Pet
                </button>
              </div>
              <div className="table-responsive">
                <Table 
                  headers={['Pet', 'Type/Breed', 'Status', 'Actions']}
                  data={data.pets}
                  renderRow={(p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={p.img} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.9rem' }}>{p.name}</div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#475569', fontSize: '0.85rem' }}>{p.type} / {p.breed}</td>
                      <td style={{ padding: '16px 24px' }}><StatusBadge status={p.status || 'available'} /></td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setEditingItem({ type: 'pet', data: p })} className="btn btn-outline" style={{ padding: '6px' }}><Pencil size={14} /></button>
                          <button onClick={() => handleDelete('pet', p.id)} className="btn btn-outline" style={{ padding: '6px', border: '1px solid #fee2e2', color: '#ef4444' }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  )}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SettingsForm settings={data.settings} onSave={(s) => handleSaveSettings(s)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        {editingItem && (
          <Modal onClose={() => setEditingItem(null)} title={editingItem.data.id ? `Edit ${editingItem.type}` : `Add New ${editingItem.type}`}>
            {editingItem.type === 'user' ? (
              <UserForm 
                user={editingItem.data} 
                onSave={(updates) => handleStatusUpdate('user', editingItem.data.id, updates)} 
              />
            ) : (
              <PetForm 
                pet={editingItem.data} 
                onSave={(petData) => handlePetSubmit(petData)} 
              />
            )}
          </Modal>
        )}
      </main>
    </div>
  );
}

function UserForm({ user, onSave }) {
  const [formData, setFormData] = useState({ ...user });
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div className="form-group">
        <label style={{ color: '#0f172a', fontWeight: '700' }}>Username</label>
        <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={inputStyle} />
      </div>
      <div className="form-group">
        <label style={{ color: '#0f172a', fontWeight: '700' }}>Email</label>
        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} />
      </div>
      <div className="form-group">
        <label style={{ color: '#0f172a', fontWeight: '700' }}>Role</label>
        <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={inputStyle}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button onClick={() => onSave(formData)} className="btn btn-primary" style={{ height: '52px', color: 'white' }}>Save Changes</button>
    </div>
  );
}

function PetForm({ pet, onSave }) {
  const [formData, setFormData] = useState({ ...pet });
  return (
    <div style={{ display: 'grid', gap: '16px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group">
          <label style={{ color: '#0f172a', fontWeight: '700' }}>Name</label>
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
        </div>
        <div className="form-group">
          <label style={{ color: '#0f172a', fontWeight: '700' }}>Type</label>
          <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={inputStyle}>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label style={{ color: '#0f172a', fontWeight: '700' }}>Breed</label>
        <input type="text" value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} style={inputStyle} />
      </div>
      <div className="form-group">
        <label style={{ color: '#0f172a', fontWeight: '700' }}>Image URL</label>
        <input type="text" value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} style={inputStyle} />
      </div>
      <div className="form-group">
        <label style={{ color: '#0f172a', fontWeight: '700' }}>Description</label>
        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ ...inputStyle, height: '100px', resize: 'none' }} />
      </div>
      <button onClick={() => onSave(formData)} className="btn btn-primary" style={{ height: '52px', marginTop: '12px', color: 'white' }}>Save Pet Data</button>
    </div>
  );
}

function SettingsForm({ settings, onSave }) {
  const [formData, setFormData] = useState({ ...settings });
  return (
    <div className="premium-card" style={{ padding: '40px', maxWidth: '600px' }}>
      <h3 style={{ marginBottom: '32px' }}>Platform Configuration</h3>
      <div style={{ display: 'grid', gap: '24px' }}>
          <div className="form-group">
              <label>Site Name</label>
              <input type="text" value={formData.site_name} onChange={e => setFormData({...formData, site_name: e.target.value})} style={inputStyle} />
          </div>
          <div className="form-group">
              <label>Contact Email</label>
              <input type="email" value={formData.contact_email} onChange={e => setFormData({...formData, contact_email: e.target.value})} style={inputStyle} />
          </div>
          <div className="form-group">
              <label>Platform Fee ($)</label>
              <input type="number" value={formData.platform_fee} onChange={e => setFormData({...formData, platform_fee: e.target.value})} style={inputStyle} />
          </div>
          <button onClick={() => onSave(formData)} className="btn btn-primary" style={{ height: '54px' }}>Save Settings</button>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '500px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#64748b' }}>&times;</button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.95rem', backgroundColor: '#f8fafc', color: '#0f172a' };

function StatCard({ label, value, color }) {
  return (
    <div className="premium-card" style={{ padding: '32px' }}>
      <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '3rem', fontWeight: '900', color }}>{value}</div>
    </div>
  );
}

function Table({ headers, data, renderRow }) {
  return (
    <div className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <tr>
            {headers.map(h => <th key={h} style={{ textAlign: 'left', padding: '24px', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#475569' }}>{h}</th>)}
          </tr>
        </thead>
        <tbody style={{ backgroundColor: 'white' }}>
          {data.length === 0 ? (
            <tr><td colSpan={headers.length} style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>No records found.</td></tr>
          ) : data.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const isComplete = status === 'completed' || status === 'available';
  return (
    <span style={{
      padding: '8px 16px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase',
      backgroundColor: isComplete ? '#ecfdf5' : '#fffbeb',
      color: isComplete ? '#047857' : '#b45309'
    }}>
      {status}
    </span>
  );
}
