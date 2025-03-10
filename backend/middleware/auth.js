const jwt = require('jsonwebtoken');

const auth = (requireAdmin = false) => {
  return async (req, res, next) => {
    // Define public routes
    const publicRoutes = ['/api/auth/login', '/api/auth/register', '/api/services'];

    if (publicRoutes.includes(req.path)) {
      return next(); // Allow access to public routes
    }

    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Debugging log to check the decoded token

      console.log("Decoded token:", decoded); // Debugging log
      req.user = decoded.user; // Assign user information
      console.log("User information:", req.user); // Debugging log to check user information


      if (requireAdmin && !req.user.isAdmin) {
        console.log("Admin access required for user:", req.user.id); // Debugging log


        return res.status(403).json({ message: 'Admin access required' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};

module.exports = auth;
