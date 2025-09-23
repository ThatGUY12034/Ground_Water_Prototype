// proxy-server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for your Expo web app
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:19006'],
  credentials: true
}));

// Proxy middleware for India WRIS API
app.use('/api/groundwater', createProxyMiddleware({
  target: 'https://indiawris.gov.in',
  changeOrigin: true,
  pathRewrite: {
    '^/api/groundwater': '/Dataset/Ground Water Level',
  },
  onProxyReq: (proxyReq, req, res) => {
    // Add any necessary headers
    proxyReq.setHeader('Accept', 'application/json');
    console.log('Proxying request:', req.url);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Add CORS headers to response
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Proxy server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`🌐 Proxy endpoint: http://localhost:${PORT}/api/groundwater`);
});