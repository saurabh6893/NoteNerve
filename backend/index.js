require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://notenerve.onrender.com'];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
  '/pdf.worker.js',
  express.static(path.join(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.js')),
);

app.use(express.json());

const chatRoutes = require('./routes/chatRoutes.js');


app.use('/api/chat', chatRoutes);

const pdfRoutes = require('./routes/pdfRoutes.js');
app.use('/api/pdf', pdfRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => res.send('Backend is up'));
app.get('/api/health', (req, res) => res.send('Backend is up'));

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});
