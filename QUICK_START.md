# Quick Start Guide - Super Admin Panel

## 🚀 Servers Running

### Access from Your Computer (Host)
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:5005

### Access from Other Devices (Mobile/Tablet/Other Computers)
- **Frontend**: http://192.168.1.145:8080
- **Backend**: http://192.168.1.145:5005

**Note**: Make sure all devices are on the same WiFi network!

## 🔑 Login Credentials

### Super Admin (Full Access)
- **URL (Host)**: http://localhost:8080/login
- **URL (Network)**: http://192.168.1.145:8080/login
- **Email**: `super.admin@kutumb.com`
- **Password**: `Qwerty@123`

## 📋 What You Can Do Now

### 1. View All Users
1. Login as super admin
2. Click "Users" in the sidebar
3. See all enrolled users with their family details

### 2. View All Families
1. Click "Families" in the sidebar
2. See all families with member counts and status

### 3. Create New Users
Since the database resets on server restart, you need to create test users:

**Option A: Register New Family**
1. Open http://localhost:8080/simple-register
2. Fill in:
   - Email: `test@example.com`
   - Family Name: `Test Family`
   - Password: `Test@123`
   - Confirm Password: `Test@123`
3. Click "Create Account"
4. Login with new credentials
5. Return to super admin panel to see the new user

**Option B: Use Demo Flow**
1. Open incognito window
2. Go to http://localhost:8080/simple-register
3. Create 2-3 families with different names
4. Return to super admin panel
5. Refresh Users/Families pages

## 🎯 Key Features Implemented

### Users Page
- ✅ Real-time data from backend API
- ✅ Shows user email and global role
- ✅ Displays all family memberships with roles
- ✅ Shows last login time
- ✅ Tracks failed login attempts
- ✅ Status badges (Active/Blocked/Emergency)
- ✅ Search and filter functionality

### Families Page
- ✅ Lists all families
- ✅ Shows admin and member counts
- ✅ Displays creation date
- ✅ Status indicators
- ✅ Search functionality

## ⚠️ Important Notes

### Database Resets on Server Restart
The database is in-memory, so:
- Only super admin persists by default
- All other users/families are lost on restart
- This is intentional for development

### Why Can't I Login with Old Credentials?
If you created users before and now can't login:
1. The server was restarted
2. The database was reset
3. Create new users using the registration page

### Password Requirements
When creating new users:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&)

Example valid password: `Test@123`

## 🔍 Testing the Complete Flow

### Full Test Scenario
1. **Login as Super Admin**
   ```
   URL: http://localhost:8080/login
   Email: super.admin@kutumb.com
   Password: Qwerty@123
   ```

2. **Check Current State**
   - Go to Users page → Should see only super admin
   - Go to Families page → Should see no families

3. **Create Test Users** (in incognito windows)
   - Create "Sharma Family" with admin@sharma.com
   - Create "Patel Family" with admin@patel.com
   - Create "Kumar Family" with admin@kumar.com

4. **Verify in Super Admin Panel**
   - Users page → Should show 4 users (super admin + 3 new)
   - Each user shows their family membership
   - Families page → Should show 3 families
   - Each family shows member count

5. **Test User Details**
   - Each user entry shows:
     - Email address
     - Role badge
     - Status badge
     - Family list with roles
     - Last login time
     - Failed login attempts (should be 0)

## 🐛 Troubleshooting

### "Failed to fetch users"
- Make sure you're logged in as super admin
- Check browser console for errors
- Verify backend is running on port 5005

### "Invalid credentials"
- Database was reset - create new account
- Or use super admin credentials (always available)

### Users page is empty
- No users created yet (except super admin)
- Create test users via registration page
- Refresh the page after creating users

### Can't create new user
- Check password meets requirements
- Ensure email is unique
- Check browser console for detailed error

## 📚 Additional Resources

See `SUPER_ADMIN_GUIDE.md` for:
- Detailed API documentation
- Complete feature list
- Advanced troubleshooting
- Next steps for production
