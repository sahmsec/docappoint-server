const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../config/auth');

// Convert Express headers to standard Web Headers object for Better Auth
const getAuthHeaders = (req) => {
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => headers.append(key, v));
    } else if (value) {
      headers.set(key, value);
    }
  });
  return headers;
};

const jwtVerify = async (req, res, next) => {
  try {
    // 1. Check for Better Auth session first
    const authHeaders = getAuthHeaders(req);
    const session = await auth.api.getSession({
      headers: authHeaders
    });

    if (session && session.user) {
      // Map Better Auth session user to the structure expected by downstream handlers (_id and photoURL)
      req.user = {
        _id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        photoURL: session.user.image || '',
        ...session.user
      };
      return next();
    }

    // 2. Fallback to custom JWT token verification (for backward compatibility during migration)
    let token;

    // Check for Bearer token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Also check for token in cookies (if any)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no session or token found' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

module.exports = jwtVerify;

