const express = require('express');
const session = require('express-session');
const authMiddleware = require('./middleware/auth');

const app = express();

// Dummy user
const DUMMY_USER = {
  username: 'admin',
  password: '1234'
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// 🔥 (yahan se extra "/" hata diya gaya hai)

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required"
    });
  }

  if (username === DUMMY_USER.username && password === DUMMY_USER.password) {
    req.session.user = {
      username: username,
      loginTime: new Date()
    };

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: req.session.user
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials"
    });
  }
});

// Protected route
app.get('/dashboard', authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Dashboard",
    user: req.session.user
  });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error logging out",
        error: err.message
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  });
});

// Home route
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Session Authentication Server",
    endpoints: {
      login: "POST /login (body: {username, password})",
      dashboard: "GET /dashboard (requires login)",
      logout: "GET /logout"
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});