require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const connectDB = require('./config/database');
const { startRtmpServer } = require('./services/rtmpServer');

// Routes
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
const streamRoutes = require('./routes/stream');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy arkasında çalışıyoruz (nginx-proxy)
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());

// Stream Proxy (HTTP-FLV & HLS)
app.use('/live', createProxyMiddleware({
  target: 'http://127.0.0.1:8000',
  changeOrigin: true,
  ws: true
}));

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes (auth gerekli)
app.use('/api/accounts', auth, accountRoutes);
app.use('/api/stream', auth, streamRoutes);

// Frontend (production)
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Sunucu hatası' });
});

// Start server
const startServer = async () => {
  try {
    // MongoDB bağlantısı
    await connectDB();

    // RTMP Sunucusu başlat
    startRtmpServer();

    // Express sunucusu başlat
    app.listen(PORT, () => {
      console.log(`[API] Server running on http://localhost:${PORT}`);
      console.log(`[API] Endpoints:`);
      console.log(`      - GET  /api/health`);
      console.log(`      - GET  /api/accounts`);
      console.log(`      - POST /api/accounts`);
      console.log(`      - GET  /api/stream/status`);
      console.log(`      - POST /api/stream/start`);
      console.log(`      - POST /api/stream/stop`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();
