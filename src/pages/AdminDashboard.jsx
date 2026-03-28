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
  const navigate = useNavigate();
  const { addToast } = useToast();

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
      // Fix: Use correct plural or singular based on API
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
    { id: 'clients', label: 'Clients', icon: <Users size={20} /> },
    { id: 'pets', label: 'Pets & Gallery', icon: <Dog size={20} /> },
    { id: 'settings', label: 'Site Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', backgroundColor: '#0f172a', color: 'white', padding: '40px 24px', position: 'fixed', height: '100vh', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-1px' }}>
          <ShieldCheck color="#4f46e5" size={32} />
          <span>Staff Portal</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map(item => (
            <motion.div
              key={item.id}
              whileHover={{ x: 5 }}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 20px',
                borderRadius: '16px',
                cursor: 'pointer',
                backgroundColor: activeTab === item.id ? '#4f46e5' : 'transparent',
                color: activeTab === item.id ? 'white' : 'inherit',
                fontWeight: activeTab === item.id ? '700' : '600',
                opacity: activeTab === item.id ? 1 : 0.6,
                transition: '0.2s'
              }}
            >
              <span style={{ color: activeTab === item.id ? 'white' : 'inherit' }}>{item.icon}</span>
              <span>{item.label}</span>
            </motion.div>
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
      <main style={{ marginLeft: '280px', flex: 1, padding: '140px 80px 80px', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
          <div>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '16px', fontWeight: '900', color: '#0f172a', letterSpacing: '-2px' }}>
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: '500' }}>Platform management and control center.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchAllData} 
            className="btn btn-outline" 
            style={{ borderRadius: '12px', padding: '12px 24px' }}
          >
            <RefreshCw size={18} className={loading ? 'spin' : ''} /> Sync Data
          </motion.button>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'bookings' && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginBottom: '60px' }}>
                <StatCard label="Total Requests" value={data.bookings.length} color="#4f46e5" />
                <StatCard label="Pending" value={data.bookings.filter(b => b.status === 'pending').length} color="#f59e0b" />
                <StatCard label="Completed" value={data.bookings.filter(b => b.status === 'completed').length} color="#10b981" />
              </div>
              <Table 
                headers={['Owner & Pet', 'Service', 'Date', 'Status', 'Actions']}
                data={data.bookings}
                renderRow={(b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '20px 32px' }}>
                      <div style={{ fontWeight: '800', color: '#0f172a' }}>{b.owner_name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{b.pet_name} • {b.pet_type}</div>
                    </td>
                    <td style={{ padding: '20px 32px', fontWeight: '600', color: '#0f172a' }}>{b.service}</td>
                    <td style={{ padding: '20px 32px', color: '#475569' }}>{new Date(b.booking_date).toLocaleDateString()}</td>
                    <td style={{ padding: '20px 32px' }}><StatusBadge status={b.status} /></td>
                    <td style={{ padding: '20px 32px' }}>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={processingId === b.id}
                        onClick={() => handleStatusUpdate('booking', b.id, { status: b.status === 'pending' ? 'completed' : 'pending' })}
                        className="btn btn-outline"
                        style={{ padding: '8px 16px', fontSize: '0.75rem', borderRadius: '10px' }}
                      >
                        {processingId === b.id ? <RefreshCw size={14} className="spin" /> : (b.status === 'pending' ? <ShieldCheck size={14} /> : <Clock size={14} />)}
                        <span style={{ marginLeft: '8px' }}>{b.status === 'pending' ? 'Approve' : 'Revert'}</span>
                      </motion.button>
                    </td>
                  </tr>
                )}
              />
            </motion.div>
          )}

          {activeTab === 'clients' && (
            <motion.div key="clients" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Table 
                headers={['Username', 'Email', 'Role', 'Joined', 'Actions']}
                data={data.users}
                renderRow={(u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '20px 32px', fontWeight: '800', color: '#0f172a' }}>{u.username}</td>
                    <td style={{ padding: '20px 32px', color: '#475569' }}>{u.email}</td>
                    <td style={{ padding: '20px 32px' }}><span style={{ padding: '4px 12px', borderRadius: '100px', backgroundColor: u.role === 'admin' ? '#fee2e2' : '#f1f5f9', color: u.role === 'admin' ? '#991b1b' : '#475569', fontSize: '0.75rem', fontWeight: '800' }}>{u.role}</span></td>
                    <td style={{ padding: '20px 32px', color: '#64748b' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '20px 32px' }}>
                        <button 
                          onClick={() => setEditingItem({ type: 'user', data: u })}
                          className="btn btn-outline" 
                          style={{ padding: '8px 12px' }}
                        >
                          <Pencil size={14} />
                        </button>
                    </td>
                  </tr>
                )}
              />
            </motion.div>
          )}

          {activeTab === 'pets' && (
            <motion.div key="pets" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setEditingItem({ type: 'pet', data: { name: '', type: 'dog', breed: '', age: '', char: '', img: '', description: '', status: 'available' } })}
                  className="btn btn-primary" 
                  style={{ padding: '12px 24px', borderRadius: '12px' }}
                >
                  <Plus size={18} /> Add New Pet
                </button>
              </div>
              <Table 
                headers={['Pet Info', 'Type/Breed', 'Status', 'Actions']}
                data={data.pets}
                renderRow={(p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '20px 32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img src={p.img} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: '800', color: '#0f172a' }}>{p.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.age} • {p.char}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '20px 32px', color: '#475569' }}>{p.type} / {p.breed}</td>
                    <td style={{ padding: '20px 32px' }}><StatusBadge status={p.status || 'available'} /></td>
                    <td style={{ padding: '20px 32px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => setEditingItem({ type: 'pet', data: p })}
                          className="btn btn-outline" 
                          style={{ padding: '8px' }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete('pet', p.id)}
                          className="btn btn-outline" 
                          style={{ padding: '8px', border: '1px solid #fee2e2', color: '#ef4444' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
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
