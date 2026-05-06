# Session & Cookies Authentication System

A simple authentication system using Express + Session (NO JWT) with hardcoded dummy credentials.

## Features

✅ **Session-based authentication** using `express-session`  
✅ **Cookies** for session management (automatic)  
✅ **Protected routes** with authentication middleware  
✅ **Login/Logout** functionality  
✅ **Hardcoded dummy user** (admin/1234)

## Project Structure

```
.
├── server.js              # Main application file
├── middleware/
│   └── auth.js            # Authentication middleware for protected routes
├── package.json           # Dependencies
└── README.md              # This file
```

## Installation

1. Navigate to the project directory:
```bash
cd Lab_Practical_NodeJS1
```

2. Install dependencies:
```bash
npm install
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. Home Route
**GET** `/`
- Returns available endpoints

```bash
curl http://localhost:3000
```

### 2. Login Route
**POST** `/login`
- Authenticates user and creates session
- Stores user in session cookies

**Request Body:**
```json
{
  "username": "admin",
  "password": "1234"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login Successful",
  "user": {
    "username": "admin",
    "loginTime": "2024-01-15T10:30:00.000Z"
  }
}
```

**Failed Response (401):**
```json
{
  "success": false,
  "message": "Invalid Credentials"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"1234"}' \
  -c cookies.txt
```

### 3. Dashboard Route (Protected)
**GET** `/dashboard`
- Protected route - requires valid session
- Only accessible if user is logged in
- Returns user information

**Success Response (200):**
```json
{
  "success": true,
  "message": "Welcome to Dashboard",
  "user": {
    "username": "admin",
    "loginTime": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (401) - Not logged in:**
```json
{
  "success": false,
  "message": "Access Denied! Please login first"
}
```

**Example (with session cookies):**
```bash
curl http://localhost:3000/dashboard -b cookies.txt
```

### 4. Logout Route
**GET** `/logout`
- Destroys session
- Clears session data

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Example:**
```bash
curl http://localhost:3000/logout -b cookies.txt
```

## How It Works

### 1. **Session Configuration**
```javascript
app.use(session({
  secret: 'your-secret-key',        // Signing key for session ID
  resave: false,                      // Don't save if not modified
  saveUninitialized: false,           // Don't save empty sessions
  cookie: { 
    secure: false,                    // Set true for HTTPS
    maxAge: 1000 * 60 * 60 * 24      // 24 hour expiration
  }
}));
```

### 2. **Login Process**
- User submits username & password
- Server validates against dummy user (admin/1234)
- If valid:
  - User data stored in `req.session.user`
  - Session ID stored in cookie
  - Cookie automatically sent to client
- If invalid: Returns error

### 3. **Session Persistence**
- Cookies automatically sent with each request
- Server reads cookie and retrieves session
- Session data available in `req.session`

### 4. **Protected Routes**
```javascript
app.get('/dashboard', authMiddleware, (req, res) => {
  // Only executed if authMiddleware passes
});
```

The `authMiddleware` checks if `req.session.user` exists:
- If exists → Allow access (next())
- If missing → Return 401 error

### 5. **Logout Process**
- Session destroyed with `req.session.destroy()`
- Cookie cleared
- User must login again for access

## Testing with cURL

### Complete Flow:

```bash
# 1. Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"1234"}' \
  -c cookies.txt

# 2. Access Dashboard (with session)
curl http://localhost:3000/dashboard -b cookies.txt

# 3. Logout
curl http://localhost:3000/logout -b cookies.txt

# 4. Try accessing Dashboard after logout (should fail)
curl http://localhost:3000/dashboard -b cookies.txt
```

## Testing with Postman/Insomnia

1. **Login Request**
   - Method: POST
   - URL: `http://localhost:3000/login`
   - Body (JSON): `{"username":"admin","password":"1234"}`
   - Cookies will be automatically saved

2. **Dashboard Request**
   - Method: GET
   - URL: `http://localhost:3000/dashboard`
   - Cookies will be automatically sent

3. **Logout Request**
   - Method: GET
   - URL: `http://localhost:3000/logout`

## Key Technologies

- **Express.js** - Web framework
- **express-session** - Session management
- **Node.js** - Runtime environment

## Dummy User Credentials

```
Username: admin
Password: 1234
```

## Important Notes

⚠️ **Security Considerations:**
- This is for educational purposes only
- Passwords are hardcoded (never do this in production)
- Session secret should be changed in production
- Use HTTPS in production (set `secure: true` in cookie config)
- Use a proper session store (currently using memory - volatile)
- For production: Use databases, bcrypt for passwords, CSRF protection, etc.

## Troubleshooting

**Q: Dashboard returns "Access Denied"?**
- A: Make sure you're logged in first and cookies are being sent

**Q: Session expires immediately?**
- A: Check session configuration and cookie settings

**Q: Cookies not working across requests?**
- A: Ensure your client (browser/curl/Postman) supports cookies

## License

ISC