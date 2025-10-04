# Auth0 Login Debug Guide

## Current Status
- ✅ Auth0 credentials are configured in `.env`
- ✅ Server is running on port 3000
- ✅ Auth0 domain: `dev-2bl5sf67k380whvu.au.auth0.com`
- ✅ Auth0 client ID: `vmk2RaCIxYEOw16NnJfGr2GQomrz7o6W`

## Common Issues & Solutions

### 1. Auth0 Application Settings
Go to your Auth0 Dashboard and check these settings:

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

### 2. Browser Console Debugging
Open browser developer tools and check for errors:

1. **Network Tab**: Look for failed requests to Auth0
2. **Console Tab**: Check for JavaScript errors
3. **Application Tab**: Check if Auth0 tokens are stored

### 3. Test Auth0 Configuration
Add this temporary debug code to see what's happening:

```javascript
// Add to browser console to test Auth0
console.log('Auth0 Domain:', import.meta.env.VITE_AUTH0_DOMAIN);
console.log('Auth0 Client ID:', import.meta.env.VITE_AUTH0_CLIENT_ID);
console.log('Current URL:', window.location.href);
```

### 4. Manual Auth0 Test
Try accessing Auth0 directly:
```
https://dev-2bl5sf67k380whvu.au.auth0.com/authorize?response_type=code&client_id=vmk2RaCIxYEOw16NnJfGr2GQomrz7o6W&redirect_uri=http://localhost:3000&scope=openid%20profile%20email
```

## Debugging Steps

### Step 1: Check Browser Console
1. Open `http://localhost:3000`
2. Open Developer Tools (F12)
3. Go to Console tab
4. Click the Login button
5. Look for any error messages

### Step 2: Check Network Requests
1. Go to Network tab in Developer Tools
2. Click Login button
3. Look for requests to Auth0
4. Check if any requests fail (red status)

### Step 3: Verify Auth0 Settings
1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to Applications → Your App
3. Check Settings tab
4. Verify the URLs match your development server

### Step 4: Test Direct Navigation
Try navigating directly to the student portal:
```
http://localhost:3000/student-portal
```

## Expected Behavior

1. **Click Login**: Should redirect to Auth0 login page
2. **After Login**: Should redirect back to `http://localhost:3000/student-portal`
3. **Student Portal**: Should show authentication details in sidebar
4. **User Profile**: Should show in navigation bar

## Quick Fixes

### Fix 1: Clear Browser Cache
```bash
# Clear browser cache and cookies
# Or use incognito/private browsing mode
```

### Fix 2: Restart Development Server
```bash
# Kill existing processes
lsof -ti:3000 | xargs kill -9

# Restart server
npm run dev
```

### Fix 3: Check Auth0 Application Type
Ensure your Auth0 application is set as "Single Page Application" not "Regular Web Application"

## Common Error Messages

- **"Invalid redirect_uri"**: Auth0 callback URLs don't match
- **"Access denied"**: User denied permission or Auth0 settings issue
- **"Invalid client"**: Client ID is incorrect
- **"Network error"**: CORS issue or network connectivity problem

## Next Steps
1. Check browser console for specific error messages
2. Verify Auth0 application settings
3. Test with incognito browser window
4. Try the manual Auth0 URL test above

