const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const configureDns = require('./src/config/dns');
configureDns();

const connectDB = require('./src/config/db');
const auth = require('./src/config/auth');
const buildAllowedOrigins = require('./src/config/allowedOrigins');
const { toNodeHandler } = require('better-auth/node');

// Connect to MongoDB
connectDB();

const app = express();

// Trust proxy (Required for Render and other load balancers for rate limiting and secure cookies)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: 'Too many auth attempts, please try again later'
});

// CORS configuration
const allowedOrigins = buildAllowedOrigins();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to Better Auth routes
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/doctors', require('./src/routes/doctors'));
app.use('/api/appointments', require('./src/routes/appointments'));

// Better Auth owns the auth surface.
app.all('/api/auth/*', toNodeHandler(auth));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DocAppoint API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Client URL: ${process.env.CLIENT_URL}`);
});
