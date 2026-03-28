import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Frontend Files
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  // Restrict admin registration
  const finalRole = (role === 'admin') ? 'user' : (role || 'user');
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [username, email, hashedPassword, finalRole]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Booking Routes
app.post('/api/bookings', authenticateToken, async (req, res) => {
  const { pet_name, pet_type, service, booking_date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO bookings (user_id, pet_name, pet_type, service, booking_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, pet_name, pet_type, service, booking_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Booking failed' });
  }
});

app.get('/api/bookings/my', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch your bookings' });
  }
});

app.get('/api/bookings', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT b.*, u.username as owner_name FROM bookings b JOIN users u ON b.user_id = u.id ORDER BY b.created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.patch('/api/bookings/:id', authenticateToken, isAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// User Management (Admin)
app.get('/api/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.patch('/api/users/:id', authenticateToken, isAdmin, async (req, res) => {
  const { username, email, role } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, username, email, role',
      [username, email, role, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Pets Management
app.get('/api/pets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pets ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pets' });
  }
});

app.post('/api/pets', authenticateToken, isAdmin, async (req, res) => {
  const { name, type, breed, age, char, img, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO pets (name, type, breed, age, char, img, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, type, breed, age, char, img, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create pet' });
  }
});

app.patch('/api/pets/:id', authenticateToken, isAdmin, async (req, res) => {
  const { name, type, breed, age, char, img, description, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE pets SET name = $1, type = $2, breed = $3, age = $4, char = $5, img = $6, description = $7, status = $8 WHERE id = $9 RETURNING *',
      [name, type, breed, age, char, img, description, status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update pet' });
  }
});

app.delete('/api/pets/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM pets WHERE id = $1', [req.params.id]);
    res.json({ message: 'Pet deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete pet' });
  }
});

// Services Management
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.post('/api/services', authenticateToken, isAdmin, async (req, res) => {
  const { title, icon, price, description, features } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO services (title, icon, price, description, features) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, icon, price, description, features]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

app.patch('/api/services/:id', authenticateToken, isAdmin, async (req, res) => {
  const { title, icon, price, description, features } = req.body;
  try {
    const result = await pool.query(
      'UPDATE services SET title = $1, icon = $2, price = $3, description = $4, features = $5 WHERE id = $6 RETURNING *',
      [title, icon, price, description, features, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Settings Management
app.get('/api/settings', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings');
    const settingsObj = result.rows.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.patch('/api/settings', authenticateToken, isAdmin, async (req, res) => {
  const settings = req.body; // Expecting { key: value, ... }
  try {
    for (const [key, value] of Object.entries(settings)) {
      await pool.query(
        'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
        [key, value]
      );
    }
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// For any other request, send the index.html file (client-side routing)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
