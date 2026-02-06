# Vercel Deployment Guide

## 🚀 Deployment Status

Your changes have been pushed to the `main` branch and will be automatically deployed to Vercel.

## ⚙️ Environment Variables for Vercel

You need to configure the following environment variable in your Vercel project settings:

### Required Environment Variable

**Variable Name:** `VITE_API_URL`

**Value Options:**

1. **If backend is deployed separately:**
   ```
   VITE_API_URL=https://your-backend-api.vercel.app/api
   ```

2. **If backend is on a different service:**
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   ```

3. **For testing with local backend (not recommended for production):**
   ```
   VITE_API_URL=http://192.168.1.145:5005/api
   ```

## 📝 How to Set Environment Variables in Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your project: `family-hub-dashboard`
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend API URL
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. Redeploy your project

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Set environment variable
vercel env add VITE_API_URL

# When prompted, enter your backend API URL
# Select environments: Production, Preview, Development

# Redeploy
vercel --prod
```

## 🔧 Backend Deployment

Your backend (`server/` directory) needs to be deployed separately. Options:

### Option 1: Deploy Backend to Vercel (Recommended)

1. Create a new Vercel project for the backend
2. Set root directory to `server`
3. Configure environment variables in backend project:
   - `JWT_SECRET`
   - `CORS_ORIGIN` (your frontend URL)
   - `NODE_ENV=production`
   - Email service variables (if using)

### Option 2: Deploy Backend to Other Services

- **Railway**: https://railway.app
- **Render**: https://render.com
- **Heroku**: https://heroku.com
- **AWS/GCP/Azure**: Cloud platforms

## 📋 Deployment Checklist

### Frontend (Current Project)
- [x] Code pushed to main branch
- [ ] Set `VITE_API_URL` in Vercel environment variables
- [ ] Verify deployment at your Vercel URL
- [ ] Test login functionality
- [ ] Test super admin panel

### Backend (Separate Deployment)
- [ ] Deploy backend to hosting service
- [ ] Set environment variables:
  - [ ] `JWT_SECRET` (generate secure random string)
  - [ ] `CORS_ORIGIN` (your Vercel frontend URL)
  - [ ] `NODE_ENV=production`
  - [ ] `PORT` (if required by hosting service)
- [ ] Test API health endpoint
- [ ] Update frontend `VITE_API_URL` with backend URL

## 🧪 Testing Deployment

### 1. Test Frontend Deployment
```bash
# Visit your Vercel URL
https://your-project.vercel.app

# Should see login page
```

### 2. Test Backend Connection
```bash
# Check if API is accessible
curl https://your-backend-url.com/api/health

# Should return:
{
  "success": true,
  "message": "KutumbOS API is running",
  ...
}
```

### 3. Test Login Flow
1. Open your Vercel URL
2. Try logging in as super admin
3. Check browser console for errors
4. Verify API calls are going to correct backend URL

## 🐛 Common Deployment Issues

### Issue 1: "Failed to fetch" in Production

**Cause**: `VITE_API_URL` not set or incorrect

**Solution**:
1. Check Vercel environment variables
2. Ensure `VITE_API_URL` is set correctly
3. Redeploy after setting variables

### Issue 2: CORS Errors

**Cause**: Backend CORS not configured for production frontend URL

**Solution**:
1. Add your Vercel URL to backend CORS origins
2. Update backend `CORS_ORIGIN` environment variable
3. Redeploy backend

### Issue 3: 404 on Page Refresh

**Cause**: SPA routing not configured

**Solution**: Already configured in `vercel.json` with rewrites ✅

### Issue 4: Environment Variables Not Working

**Cause**: Variables set after deployment

**Solution**:
1. Set environment variables in Vercel
2. Trigger a new deployment (redeploy)
3. Environment variables only apply to new builds

## 📊 Current Configuration

### Local Development
```env
VITE_API_URL=http://192.168.1.145:5005/api
```

### Production (Needs to be set in Vercel)
```env
VITE_API_URL=https://your-backend-url.com/api
```

## 🔐 Security Notes for Production

1. **Use HTTPS**: Both frontend and backend must use HTTPS
2. **Secure JWT_SECRET**: Generate a strong random secret
3. **CORS Configuration**: Only allow your frontend domain
4. **Rate Limiting**: Already configured in backend
5. **Environment Variables**: Never commit secrets to git

## 📚 Next Steps

1. **Deploy Backend**:
   - Choose hosting service
   - Deploy `server/` directory
   - Configure environment variables
   - Note the backend URL

2. **Configure Frontend**:
   - Set `VITE_API_URL` in Vercel
   - Use backend URL from step 1
   - Redeploy frontend

3. **Test Everything**:
   - Login functionality
   - Super admin panel
   - User creation
   - All API endpoints

4. **Monitor**:
   - Check Vercel deployment logs
   - Monitor backend logs
   - Test from different devices

## 🎉 Deployment Complete!

Once you've set the `VITE_API_URL` environment variable in Vercel and deployed your backend, your application will be live and accessible from anywhere!

---

**Important**: The current `.env` file uses local network IP (192.168.1.145) which won't work in production. Make sure to set the correct production backend URL in Vercel environment variables.
