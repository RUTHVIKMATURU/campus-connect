const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided'
      });
    }

    // Check if token format is correct
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    const token = authHeader.split(' ')[1];

    // For admin tokens (which are base64 encoded timestamps), decode and verify
    if (token.startsWith('YWRtaW4t')) {
      const decodedTime = atob(token.split('-')[1]);
      const tokenAge = Date.now() - parseInt(decodedTime);
      
      // Token expires after 24 hours (86400000 milliseconds)
      if (tokenAge > 86400000) {
        return res.status(401).json({
          success: false,
          message: 'Admin token expired'
        });
      }
      
      req.isAdmin = true;
      return next();
    }

    // If not an admin token, verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
