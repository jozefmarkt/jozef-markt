# 🔐 Admin Password Setup Guide

## How to Change Admin Credentials

### Step 1: Generate Password Hash
Run the password hash generator:
```bash
node generate-password-hash.js
```

This will prompt you for a new password and generate a secure bcrypt hash.

### Step 2: Update Security File
1. Open `src/utils/security.ts`
2. Update the `ADMIN_CREDENTIALS` object:
   - Change `username` to your desired admin username
   - Replace `passwordHash` with the generated hash

Example:
```typescript
const ADMIN_CREDENTIALS = {
  username: 'your_admin@email.com',
  passwordHash: '$2a$12$YOUR_GENERATED_HASH_HERE'
};
```

### Step 3: Test Login
- Restart the development server
- Try logging in with your new credentials

## Security Features ✅
- ✅ Passwords are hashed with bcrypt (industry standard)
- ✅ No plain text passwords stored anywhere
- ✅ Brute force protection (1-second delay)
- ✅ Secure cryptographic comparison
- ✅ 12-round salt for maximum security

## Current Credentials (Default)
- **Username:** `admin@jozefmarkt.com`
- **Password:** `JozefMarkt2024!Secure`

⚠️ **Important:** Change these default credentials before deploying to production!

## Password Requirements
- Minimum 8 characters
- Recommended: Mix of uppercase, lowercase, numbers, and symbols
- Use a unique password not used elsewhere


