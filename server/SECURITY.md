# 🔐 Authentication & Security Documentation

## Overview

This document describes the complete authentication and security implementation for AIMarketplace backend.

## 🔑 Authentication Features

### User Registration
- **Endpoint**: `POST /api/v1/auth/register`
- **Security**:
  - Password hashing with bcrypt (12 rounds)
  - Email uniqueness validation
  - Password strength requirements (8+ chars, uppercase, lowercase, number)
  - Email verification token generation
  - Rate limiting (3 registrations/hour per IP)

### User Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Security**:
  - Bcrypt password comparison
  - Failed login attempt logging
  - Last login timestamp tracking
  - Rate limiting (5 attempts/15min per IP)
  - Generic error messages (doesn't reveal if email exists)

### Password Reset Flow
1. **Forgot Password** (`POST /api/v1/auth/forgot-password`)
   - Generates secure reset token (crypto.randomBytes)
   - Token hashed before storage (SHA-256)
   - 10-minute expiration
   - Doesn't reveal if email exists
   
2. **Reset Password** (`POST /api/v1/auth/reset-password/:token`)
   - Validates token and expiration
   - Requires strong password
   - Clears reset token after use
   - One-time use only

### Password Change
- **Endpoint**: `PATCH /api/v1/auth/change-password`
- **Security**:
  - Requires authentication
  - Validates current password
  - Strong password requirement for new password

### Email Verification
1. **Verify Email** (`POST /api/v1/auth/verify-email/:token`)
   - Token-based verification
   - Hashed token storage
   
2. **Resend Verification** (`POST /api/v1/auth/resend-verification`)
   - For authenticated users only
   - Generates new token

## 🛡️ Security Measures

### 1. Password Security
- **Hashing**: bcrypt with 12 salt rounds
- **Storage**: Never store plain text passwords
- **Transmission**: Only over HTTPS in production
- **Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number

### 2. Token Security

#### Access Tokens (JWT)
- Short-lived (7 days default)
- Contains only user ID
- Signed with HS256 algorithm
- Secret key from environment variables

#### Refresh Tokens
- Longer-lived (30 days default)
- Used to obtain new access tokens
- Separate secret key
- Should be stored securely (httpOnly cookies recommended)

#### Password Reset Tokens
- 32-byte random hex string
- Hashed with SHA-256 before storage
- 10-minute expiration
- Single-use only

#### Email Verification Tokens
- 32-byte random hex string
- Hashed with SHA-256 before storage
- No expiration (can resend)
- Single-use only

### 3. Rate Limiting

| Endpoint Type | Limit | Window |
|--------------|-------|---------|
| General API | 100 requests | 15 minutes |
| Authentication | 5 requests | 15 minutes |
| Registration | 3 accounts | 1 hour |
| File Upload | 20 uploads | 15 minutes |

### 4. Input Validation
- express-validator for all inputs
- Email normalization and sanitization
- SQL injection prevention (Prisma ORM)
- XSS protection
- Request size limits (10MB)

### 5. Security Headers (Helmet.js)
```javascript
- Content-Security-Policy
- X-DNS-Prefetch-Control
- X-Frame-Options: DENY
- Strict-Transport-Security
- X-Download-Options
- X-Content-Type-Options
- X-Permitted-Cross-Domain-Policies
```

### 6. CORS Configuration
- Whitelist of allowed origins
- Credentials support
- Pre-flight request handling
- Custom headers allowed

### 7. Logging & Monitoring
- Winston logger for all auth events
- Failed login attempts logged
- Password changes logged
- Email verifications logged
- User registration logged

## 📊 Database Schema (User Model)

```prisma
model User {
  id                    String    @id
  name                  String
  email                 String    @unique
  password              String?
  image                 String
  cart                  Json      @default("{}")
  isEmailVerified       Boolean   @default(false)
  emailVerifyToken      String?
  resetPasswordToken    String?
  resetPasswordExpires  DateTime?
  lastLogin             DateTime?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}
```

## 🔒 Best Practices Implemented

### 1. Password Management
✅ Never log passwords
✅ Never return passwords in API responses
✅ Use bcrypt for hashing (not MD5, SHA1, etc.)
✅ Use appropriate salt rounds (12)
✅ Enforce strong password policy

### 2. Token Management
✅ Use crypto module for secure random generation
✅ Hash tokens before storing
✅ Set appropriate expiration times
✅ Use separate secrets for different token types
✅ Implement token refresh mechanism

### 3. Error Handling
✅ Don't reveal sensitive information in errors
✅ Use generic error messages
✅ Log detailed errors server-side only
✅ Return consistent error format

### 4. Authentication Flow
✅ Use JWT for stateless authentication
✅ Implement refresh token rotation
✅ Track last login time
✅ Support email verification
✅ Provide password reset flow

### 5. API Security
✅ Rate limiting on all endpoints
✅ Stricter limits on sensitive endpoints
✅ CORS with whitelist
✅ Security headers (Helmet)
✅ Request validation
✅ Input sanitization

## 📝 Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Forgot Password
```bash
curl -X POST http://localhost:5000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### Reset Password
```bash
curl -X POST http://localhost:5000/api/v1/auth/reset-password/RESET_TOKEN \
  -H "Content-Type: application/json" \
  -d '{
    "password": "NewSecurePass123"
  }'
```

### Change Password
```bash
curl -X PATCH http://localhost:5000/api/v1/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "SecurePass123",
    "newPassword": "NewSecurePass123"
  }'
```

## 🚨 Security Checklist

- [x] Passwords hashed with bcrypt
- [x] JWT tokens for authentication
- [x] Refresh token mechanism
- [x] Email verification system
- [x] Password reset flow
- [x] Rate limiting implemented
- [x] Input validation on all endpoints
- [x] SQL injection prevention
- [x] XSS protection
- [x] CORS configured
- [x] Security headers (Helmet)
- [x] Error messages don't leak info
- [x] Logging for security events
- [x] Strong password requirements
- [x] Token expiration
- [x] Failed login tracking
- [x] HTTPS enforced (production)
- [ ] Email service integration (TODO)
- [ ] Redis for token blacklisting (TODO)
- [ ] 2FA support (Future)
- [ ] OAuth providers (Future)

## 🔐 Environment Variables

Required security-related environment variables:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters
JWT_REFRESH_EXPIRES_IN=30d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (for password reset & verification)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Frontend URL (for reset links)
FRONTEND_URL=http://localhost:3000
```

## ⚠️ Production Recommendations

1. **HTTPS Only**: Always use HTTPS in production
2. **Environment Variables**: Never commit .env file
3. **Strong Secrets**: Use long, random strings for JWT secrets
4. **Email Service**: Integrate a proper email service (SendGrid, AWS SES)
5. **Monitoring**: Set up security monitoring and alerts
6. **Redis**: Implement token blacklisting with Redis
7. **Backups**: Regular database backups
8. **Updates**: Keep dependencies updated
9. **Audits**: Regular security audits
10. **Rate Limiting**: Adjust based on your traffic

## 📚 Additional Resources

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)
- [Helmet.js Documentation](https://helmetjs.github.io/)

---

**Last Updated**: $(date)
**Security Level**: Production-Ready
**Compliance**: OWASP Guidelines

