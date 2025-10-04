# Auth0 Login Troubleshooting Guide

## 🚨 Current Issue: Auth0 Domain Not Found

The Auth0 domain `dev-2bl5sf67k380whvu.us.auth0.com` is not accessible, which means either:
1. The domain is incorrect
2. The Auth0 application doesn't exist
3. The Auth0 tenant is not properly configured

## 🔧 Step-by-Step Solution

### Step 1: Get Correct Auth0 Credentials

1. **Go to Auth0 Dashboard**: https://manage.auth0.com/
2. **Sign in** to your Auth0 account
3. **Select your tenant** (or create a new one)
4. **Go to Applications** in the left sidebar
5. **Create a new application** or select existing one:
   - **Name**: "CloudInDepth Student Portal"
   - **Type**: "Single Page Application"
6. **Copy the credentials**:
   - **Domain**: Should look like `your-tenant.auth0.com` or `your-tenant.us.auth0.com`
   - **Client ID**: Long alphanumeric string

### Step 2: Update .env File

Replace the current Auth0 credentials in your `.env` file:

```bash
# Replace these lines in your .env file:
VITE_AUTH0_DOMAIN=your-actual-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-actual-client-id
```

### Step 3: Configure Auth0 Application Settings

In your Auth0 application settings, add these URLs:

**Allowed Callback URLs:**
```
http://localhost:3000, http://127.0.0.1:3000, http://localhost:5000, http://127.0.0.1:5000
```

**Allowed Logout URLs:**
```
http://localhost:3000, http://127.0.0.1:3000, http://localhost:5000, http://127.0.0.1:5000
```

**Allowed Web Origins:**
```
http://localhost:3000, http://127.0.0.1:3000, http://localhost:5000, http://127.0.0.1:5000
```

### Step 4: Test Auth0 Configuration

After updating the credentials, test with this command:
```bash
curl -s "https://YOUR-DOMAIN/.well-known/openid_configuration" | head -5
```

This should return JSON configuration data, not "Unknown host".

## 🚀 Alternative: Create New Auth0 Application

If you don't have an Auth0 account or want to start fresh:

### Option 1: Free Auth0 Account
1. Go to https://auth0.com/
2. Click "Start Free"
3. Create account
4. Create new tenant
5. Create Single Page Application
6. Copy credentials to `.env`

### Option 2: Use Development Mode (No Auth0)
If you want to test without Auth0 setup, the app will work in development mode:
- Login button will show alert message
- Student portal will be accessible with mock data
- Authentication details will show fallback content

## 🔍 Debugging Steps

### 1. Check Browser Console
1. Open http://localhost:3000
2. Open Developer Tools (F12)
3. Go to Console tab
4. Click Login button
5. Look for error messages

### 2. Check Network Tab
1. Go to Network tab in Developer Tools
2. Click Login button
3. Look for failed requests (red status)
4. Check if Auth0 requests are being made

### 3. Test Direct Auth0 URL
Try this URL in your browser (replace with your actual domain):
```
https://YOUR-DOMAIN/authorize?response_type=code&client_id=YOUR-CLIENT-ID&redirect_uri=http://localhost:3000&scope=openid%20profile%20email
```

## 🎯 Expected Behavior After Fix

1. **Login Button**: Redirects to Auth0 login page
2. **After Login**: Redirects to http://localhost:3000/student-portal
3. **Student Portal**: Shows authentication details in sidebar
4. **User Profile**: Shows in navigation bar

## 🆘 Quick Fix: Development Mode

If you want to test the student portal without Auth0:

1. **Remove Auth0 credentials** from `.env`:
   ```bash
   # Comment out or remove these lines:
   # VITE_AUTH0_DOMAIN=...
   # VITE_AUTH0_CLIENT_ID=...
   ```

2. **Restart server**:
   ```bash
   npm run dev
   ```

3. **Access student portal directly**:
   ```
   http://localhost:3000/student-portal
   ```

The app will work in development mode with mock authentication data.

## 📞 Next Steps

1. **Get correct Auth0 credentials** from your Auth0 dashboard
2. **Update .env file** with correct domain and client ID
3. **Configure Auth0 application** with correct callback URLs
4. **Test the login flow** in browser
5. **Check browser console** for any remaining errors

The authentication details component is already implemented and ready to display user information once Auth0 is properly configured!

