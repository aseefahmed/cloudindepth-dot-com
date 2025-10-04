# Auth0 Setup Guide

## Issue: Auth0 Login Not Working

The application is currently showing "Auth0 login is not configured yet" because the required environment variables are missing.

## Solution: Configure Auth0 Environment Variables

### Step 1: Create a `.env` file in the project root

Create a file named `.env` in the `/home/aseefahmed/cloudindepth-dot-com/` directory with the following content:

```bash
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Step 2: Get Auth0 Credentials

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new application or use an existing one
3. Choose "Single Page Application" as the application type
4. Copy the following from your Auth0 application settings:
   - **Domain**: Found in the "Settings" tab (e.g., `dev-abc123.us.auth0.com`)
   - **Client ID**: Found in the "Settings" tab

### Step 3: Configure Auth0 Application Settings

In your Auth0 application settings, add these URLs:

**Allowed Callback URLs:**
```
http://localhost:3000, http://localhost:5000, http://127.0.0.1:3000, http://127.0.0.1:5000
```

**Allowed Logout URLs:**
```
http://localhost:3000, http://localhost:5000, http://127.0.0.1:3000, http://127.0.0.1:5000
```

**Allowed Web Origins:**
```
http://localhost:3000, http://localhost:5000, http://127.0.0.1:3000, http://127.0.0.1:5000
```

### Step 4: Update the `.env` file

Replace the placeholder values in your `.env` file:

```bash
VITE_AUTH0_DOMAIN=dev-abc123.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-actual-client-id-here
```

### Step 5: Restart the Development Server

After creating the `.env` file:

```bash
# Kill any existing processes
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Start the development server
npm run dev
```

## Expected Behavior After Setup

1. **Login Button**: Will redirect to Auth0 login page instead of showing alert
2. **After Login**: User will be automatically redirected to `/student-portal`
3. **Authentication Details**: Will be visible in the student portal sidebar
4. **User Profile**: Will show in the navigation with avatar and dropdown menu

## Current Implementation Features

✅ **Auth0 Integration**: Complete Auth0 React SDK integration
✅ **Student Portal Redirect**: Automatic redirect to `/student-portal` after login
✅ **Authentication Details**: Comprehensive auth info display in dashboard
✅ **Protected Routes**: Student portal routes protected by authentication
✅ **Graceful Fallback**: App works without Auth0 (shows warning messages)

## Troubleshooting

### If login still doesn't work:

1. **Check Console**: Look for Auth0-related errors in browser console
2. **Verify URLs**: Ensure Auth0 callback URLs match your development server URL
3. **Environment Variables**: Confirm `.env` file is in the project root and variables are correct
4. **Auth0 Dashboard**: Verify application settings in Auth0 dashboard

### Common Issues:

- **CORS Errors**: Add your development URL to Auth0 allowed origins
- **Redirect Issues**: Ensure callback URLs include both localhost and 127.0.0.1
- **Environment Variables**: Make sure `.env` file is created in the correct location

## Development Mode

If you want to test without Auth0 setup, the application will:
- Show "Auth0 login is not configured yet" alert when clicking login
- Allow access to student portal with mock authentication
- Display authentication details component with fallback content

