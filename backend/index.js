import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fourai'
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

// Signup route (plain password)
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error.' });

    if (results.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    // eslint-disable-next-line no-unused-vars
    db.query(insertQuery, [username, email, password], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error registering user.' });

      res.status(201).json({ message: 'User registered successfully!' });
    });
  });
});

// Login route (plain text password)
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const loginQuery = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(loginQuery, [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Get user data from results (excluding password)
    const userData = {
      id: results[0].id,
      username: results[0].username,
      email: results[0].email
    };

    res.status(200).json({ 
      message: 'Login successful',
      user: userData
    });
  });
});

// Forgot password route (basic version)
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  // Simulate sending reset link
  res.json({ message: `Password reset link sent to ${email} (simulated)` });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});










