// Middleware to protect routes - checks if user is authenticated
const authMiddleware = (req, res, next) => {
  // Check if session exists and user is stored in session
  if (req.session && req.session.user) {
    next(); // User is authenticated, proceed to next middleware/route
  } else {
    res.status(401).json({
      success: false,
      message: "Access Denied! Please login first"
    });
  }
};

module.exports = authMiddleware;
