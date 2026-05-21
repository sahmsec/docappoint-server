const auth = require('../config/auth');

const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token string" });
    }

    // Verify token using the Better Auth API
    const result = await auth.api.verifyJWT({
      body: { token }
    });
    
    if (!result || !result.payload) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
    }

    // Better Auth JWT payload includes the user object and sub
    req.user = {
      _id: result.payload.sub,
      email: result.payload.email,
      name: result.payload.name,
    };

    if (!req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token payload" });
    }

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = verifyJWT;
