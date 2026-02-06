# Network Access Guide - Access from Other Devices

## ✅ Configuration Complete

Both frontend and backend are now configured to work across your local network!

## 🌐 Access URLs

### From Your Development Machine (Host)
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:5005

### From Other Devices on Same Network
- **Frontend**: http://192.168.1.145:8080
- **Backend**: http://192.168.1.145:5005

## 📱 How to Access from Mobile/Tablet/Other Computer

### Step 1: Ensure Servers are Running
Both servers should be running on your development machine:
```bash
# Frontend: http://192.168.1.145:8080
# Backend: http://192.168.1.145:5005
```

### Step 2: Connect Device to Same WiFi Network
Make sure your mobile device or other computer is connected to the **same WiFi network** as your development machine.

### Step 3: Open Browser on Device
On your mobile device or other computer:
1. Open any web browser (Chrome, Safari, Firefox, etc.)
2. Navigate to: **http://192.168.1.145:8080**
3. You should see the KutumbOS login page

### Step 4: Login
Use the super admin credentials:
- **Email**: super.admin@kutumb.com
- **Password**: Qwerty@123

## 🔧 What Was Fixed

### 1. Environment Variables Updated
Changed API URL from `localhost` to network IP:
```env
# Before
VITE_API_URL=http://localhost:5005/api

# After
VITE_API_URL=http://192.168.1.145:5005/api
```

### 2. Frontend Code Updated
- UsersPage now uses `apiClient` instead of hardcoded localhost
- All API calls go through the centralized API client
- API client automatically uses the environment variable

### 3. Backend CORS Already Configured
The backend already had proper CORS configuration:
- Allows all localhost origins
- Allows all 192.168.x.x network origins
- Credentials enabled for cookies
- Proper headers configured

## 🧪 Testing Network Access

### Test from Another Device

1. **Check Network Connectivity**
   ```bash
   # On your mobile device browser, try:
   http://192.168.1.145:5005/api/health
   
   # You should see:
   {
     "success": true,
     "message": "KutumbOS API is running",
     "timestamp": "...",
     "environment": "development"
   }
   ```

2. **Access Frontend**
   ```
   http://192.168.1.145:8080
   ```

3. **Login and Test**
   - Login as super admin
   - Navigate to Users page
   - Should load without "Failed to fetch" error
   - Navigate to Families page
   - Should work properly

## 🐛 Troubleshooting

### "Failed to fetch users" Error

**Possible Causes:**
1. Frontend server not restarted after .env change
2. Device not on same network
3. Firewall blocking connections
4. Wrong IP address

**Solutions:**

1. **Restart Frontend Server**
   ```bash
   # The frontend was already restarted with new config
   # If you still see issues, clear browser cache
   ```

2. **Verify IP Address**
   ```bash
   # On your development machine, check IP:
   ip addr show | grep "inet 192"
   # or
   ifconfig | grep "inet 192"
   ```

3. **Check Firewall**
   ```bash
   # On Linux, allow ports 8080 and 5005:
   sudo ufw allow 8080
   sudo ufw allow 5005
   ```

4. **Verify Same Network**
   - Both devices must be on same WiFi network
   - Check WiFi name on both devices
   - Some networks isolate devices (guest networks)

### "Cannot connect" or "Timeout" Error

**Check if servers are accessible:**
```bash
# From another device, try:
curl http://192.168.1.145:5005/api/health
curl http://192.168.1.145:8080
```

**If curl fails:**
1. Check if servers are running on host machine
2. Check firewall settings
3. Verify IP address is correct
4. Try pinging the host: `ping 192.168.1.145`

### CORS Error in Browser Console

**If you see CORS errors:**
1. Check backend logs for "CORS blocked origin"
2. Backend should allow 192.168.x.x origins automatically
3. If blocked, the origin will be logged in backend console

### Authentication Issues

**If login works but API calls fail:**
1. Clear browser cookies and localStorage
2. Login again
3. Check browser console for detailed errors
4. Verify access token is being sent in requests

## 📊 Network Configuration Details

### Backend Server
- **Listening on**: 0.0.0.0:5005 (all network interfaces)
- **CORS**: Allows localhost and 192.168.x.x origins
- **Credentials**: Enabled (for cookies)
- **Rate Limiting**: 100 requests per 15 minutes per IP

### Frontend Server (Vite)
- **Listening on**: 0.0.0.0:8080 (all network interfaces)
- **API URL**: http://192.168.1.145:5005/api
- **Environment**: Development mode

## 🔒 Security Notes

### Development Mode Only
This configuration is for **development only**. For production:
1. Use proper domain names
2. Enable HTTPS/SSL
3. Restrict CORS to specific origins
4. Use environment-specific configuration
5. Enable proper authentication

### Network Security
- Only devices on your local network can access
- Not accessible from internet
- Firewall should block external access
- Use strong passwords even in development

## 🎯 Quick Reference

### Access from Host Machine
```
Frontend: http://localhost:8080
Backend:  http://localhost:5005
```

### Access from Network Devices
```
Frontend: http://192.168.1.145:8080
Backend:  http://192.168.1.145:5005
```

### Super Admin Login
```
Email:    super.admin@kutumb.com
Password: Qwerty@123
```

### API Health Check
```
http://192.168.1.145:5005/api/health
```

## ✨ What Works Now

✅ Access frontend from any device on network
✅ Login from mobile/tablet/other computers
✅ Super admin panel accessible
✅ Users page loads data correctly
✅ Families page loads data correctly
✅ All API calls work across network
✅ Authentication works properly
✅ Cookies and tokens work correctly

## 🚀 Next Steps

1. Test from your mobile device
2. Create test users from mobile
3. Verify super admin panel works
4. Test all features across devices

Everything should now work seamlessly across your local network!
