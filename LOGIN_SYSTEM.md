# Secure Login System - Implementation Guide

## ✅ System Overview

A fully functional, secure authentication system with:
- **User Registration**: Email + username validation, password hashing
- **Secure Login**: PBKDF2 password hashing with SHA-256
- **Predefined Admin Account**: Pre-created with elevated privileges
- **Error Handling**: Comprehensive validation and user feedback
- **Secure Storage**: Passwords hashed and salted in localStorage

---

## 🔐 Security Features

### Password Hashing
- **Algorithm**: PBKDF2 with SHA-256
- **Iterations**: 100,000 (industry standard)
- **Salt**: 16-byte random salt per password
- **Format**: `salt$hash` stored in localStorage

### Validation
- **Email**: RFC-compliant format validation
- **Username**: 3-20 chars, alphanumeric + underscore/hyphen
- **Password**: Minimum 6 characters
- **Confirmation**: Password confirmation on signup

### Data Protection
- Passwords never stored in plaintext
- User credentials isolated in `spwn_users` localStorage key
- Session user data stored in `spwn_user` localStorage key
- Async password verification prevents timing attacks

---

## 👤 Predefined Admin Account

**Auto-created on first app launch:**
```
Email: admin@spwn.dev
Password: admin123
Role: admin
```

**Quick login button in LoginView:**
- "Try Admin (admin123)" button auto-fills credentials
- Useful for testing admin features

---

## 📝 Signup Process

### User Input
1. Username (3-20 chars)
2. Email (valid format)
3. Password (6+ chars)
4. Confirm Password (must match)
5. Terms of Service agreement (required)

### Validation Flow
```
Input → Validate → Check Duplicates → Hash Password → Store → Success
```

### Error Handling
- "Username is required"
- "Email already registered"
- "Username already taken"
- "Passwords do not match"
- "Please agree to Terms of Service"

---

## 🔑 Login Process

### User Input
1. Email
2. Password
3. Optional: "Try Admin" quick-fill

### Verification Flow
```
Input → Find User → Verify Password → Create Session → Success
```

### Error Handling
- "Invalid email or password" (generic for security)
- "Authentication failed"
- All errors deliberately vague to prevent user enumeration

---

## 🛠️ Technical Architecture

### File Structure
```
src/
├── app/
│   ├── utils/
│   │   ├── auth.ts              # Password hashing & verification
│   │   └── validation.ts        # Form validation rules
│   ├── context/
│   │   └── AppContext.tsx       # Auth state management
│   └── components/
│       └── auth/
│           └── AuthPage.tsx     # Login/Signup UI
```

### LocalStorage Keys
```
spwn_users       → Array of StoredUser objects
spwn_user        → Current session User object
spwn_dark        → Dark mode preference
spwn_backlog     → User's game backlog
... (other app state)
```

### StoredUser Interface
```typescript
interface StoredUser {
  id: string;                  // Unique ID (timestamp-based)
  username: string;            // 3-20 chars
  email: string;               // Unique, validated
  passwordHash: string;        // salt$hash format
  role: "user" | "admin";      // User role
  createdAt: string;           // ISO date
}
```

---

## 🔄 API Methods

### Login
```typescript
const result = await login(email, password);
// Returns: { success: boolean; error?: string }
```

### Signup
```typescript
const result = await signup(username, email, password);
// Returns: { success: boolean; error?: string }
```

### Logout
```typescript
logout();
```

---

## 🧪 Testing Credentials

### Admin Account (Pre-created)
```
Email: admin@spwn.dev
Password: admin123
```

### Test User (Create via signup)
```
Username: TestUser99
Email: test@example.com
Password: TestPass123
Confirm: TestPass123
```

---

## 📱 UI Components

### LoginView Features
- Email & password inputs with focus states
- "Try Admin" quick-fill button
- Forgot password link (placeholder)
- Loading state during authentication
- Error messages with red styling
- Toggle to signup view

### SignupView Features
- Username input with validation feedback
- Email input with format validation
- Password & confirm password fields
- Terms of Service checkbox (required)
- Loading state during registration
- Error messages with red styling
- Toggle to login view

### Input Component
- Disabled state while loading
- Focus border color: `rgba(0,170,255,0.5)`
- Placeholder styling: `rgba(255,255,255,0.25)`
- Custom glass-morphism styling

### Button Component
- Primary (blue accent) variant
- Outline variant
- Disabled state with reduced opacity
- Press animation (scale down)
- Loading text support

---

## 🚀 Usage Examples

### Implementing Protected Routes
```typescript
if (user?.role !== "admin") {
  return <div>Access Denied</div>;
}
```

### Checking User Status
```typescript
const { user } = useApp();
if (user) {
  console.log(`Logged in as ${user.username}`);
}
```

### Handling Auth Errors
```typescript
const result = await login(email, password);
if (!result.success) {
  setError(result.error);  // Display to user
}
```

---

## 🔒 Security Best Practices Implemented

✅ Passwords hashed with PBKDF2-SHA256
✅ 100,000 iterations (industry standard)
✅ Random salt per password
✅ Generic error messages (no user enumeration)
✅ Input validation before hashing
✅ Async password verification
✅ Session stored separately from credentials
✅ Confirmation password field
✅ Terms of Service agreement required
✅ Email & username uniqueness enforced
✅ No plaintext passwords in localStorage

---

## 📋 Future Enhancements

Possible improvements:
- Email verification via OTP
- Password reset via email
- Two-factor authentication (2FA)
- Social login (Google, GitHub)
- Session timeout
- Login history
- Account recovery questions
- Captcha on repeated failed attempts
- Password strength meter
- Account deletion

---

## ⚙️ Configuration

All security parameters are in `src/app/utils/auth.ts`:
- PBKDF2 iterations: 100,000
- Hash algorithm: SHA-256
- Salt length: 16 bytes

Validation rules in `src/app/utils/validation.ts`:
- Username length: 3-20 chars
- Password length: 6+ chars
- Email: RFC format validation

---

## 🐛 Troubleshooting

**Q: "Invalid email or password" but credentials seem correct**
- Check email case (case-insensitive in most cases)
- Verify no extra spaces in inputs
- Ensure password doesn't have caps lock enabled

**Q: "Email already registered" on signup**
- Email must be unique per user
- Check if account was previously created

**Q: Admin button not appearing**
- Check if `user?.role === "admin"` in components
- Verify user logged in with admin@spwn.dev account

**Q: Password hashing takes a while**
- PBKDF2 with 100,000 iterations is intentionally slow
- This protects against brute-force attacks
- Should complete in <500ms on modern hardware

---

## 📞 Support

For issues or questions:
1. Check validation error messages
2. Review security parameters in `auth.ts`
3. Verify localStorage state in DevTools → Application → Storage
4. Check browser console for async errors

