require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => res.send('Backend is up'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
