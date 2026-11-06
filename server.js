const express = require('express');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy (Required for Render load balancer)
if (process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
}

// Ensure temporary data directory exists (Render Free tier fix for SQLite)
const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const dbPath = path.join(dataDir, 'restaurant.db');
const db = new Database(dbPath);
console.log(`Database connected successfully at: ${dbPath}`);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Explicit root route to serve the frontend login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', time: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} under timezone ${process.env.APP_TIMEZONE || 'UTC'}`);
});
