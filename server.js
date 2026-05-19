const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./src/config/db');

// Connect to MongoDB
connectDB();

const app = express();

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DocAppoint API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
