const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./src/config/db');
const auth = require('./src/config/auth');
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
  max: 20, // limit each IP to 20 requests per windowMs
  message: 'Too many auth attempts, please try again later'
});

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004'
];

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

// Apply rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/google', authLimiter);

// Routes
app.use('/api/doctors', require('./src/routes/doctors'));
app.use('/api/appointments', require('./src/routes/appointments'));

// Better Auth handler MUST come before custom auth routes
// so it can handle /api/auth/sign-in/social, /api/auth/callback/google, etc.
app.all('/api/auth/*', toNodeHandler(auth));

// Custom auth routes (legacy login/register/me)
app.use('/api/auth', require('./src/routes/auth'));

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
