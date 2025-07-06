const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Koneksi ke MySQL
const db = mysql.createPool({
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'voting_app',
  connectionLimit: 10
});

// Inisialisasi tabel jika belum ada
db.query(`
  CREATE TABLE IF NOT EXISTS votes (
    candidate VARCHAR(255) PRIMARY KEY,
    count INT DEFAULT 0
)`, (err) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    // Inisialisasi data kandidat jika kosong
    const candidates = ['candidateA', 'candidateB', 'candidateC'];
    candidates.forEach(candidate => {
      db.query(
        'INSERT IGNORE INTO votes (candidate, count) VALUES (?, 0)',
        [candidate]
      );
    });
    console.log('Voting table initialized.');
  }
});

// Endpoint root
app.get('/', (req, res) => {
  res.send('Voting API is running.');
});

// Ambil hasil voting
app.get('/votes', (req, res) => {
  db.query('SELECT * FROM votes', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    const formatted = {};
    results.forEach(row => {
      formatted[row.candidate] = row.count;
    });
    res.json(formatted);
  });
});

// Kirim vote
app.post('/vote', (req, res) => {
  const { candidate } = req.body;
  db.query(
    'UPDATE votes SET count = count + 1 WHERE candidate = ?',
    [candidate],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (result.affectedRows === 0) {
        return res.status(400).json({ error: 'Invalid candidate' });
      }
      res.json({ message: 'Vote counted' });
    }
  );
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
