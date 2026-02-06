# Super Admin Panel - User Management Guide

## Current Status

### ✅ What's Working
1. **Backend API**: Added `/api/admin/users` endpoint to fetch all users with family details
2. **Frontend Display**: Updated UsersPage to show real data from the API
3. **User Details**: Shows enrolled users with their family memberships and roles

### 🔧 What Was Fixed
1. Added `getAllUsers()` method to the database model
2. Created comprehensive user endpoint in admin routes
3. Updated frontend to fetch and display real user data with family details
4. Fixed user status badges (Active/Blocked/Emergency)
5. Added family details display for each user

## How to Use

### 1. Login as Super Admin
- **Email**: `super.admin@kutumb.com`
- **Password**: `Qwerty@123`
- Navigate to: http://localhost:8080/login

### 2. Access Super Admin Panel
After login, you'll be automatically redirected to `/super-admin`

### 3. View All Users
- Click on "Users" in the sidebar
- You'll see all enrolled users with:
  - Email address
  - Global role (SUPER_ADMIN or USER)
  - Status (Active/Blocked/Emergency)
  - Family memberships with roles
  - Last login time
  - Failed login attempts

### 4. View All Families
- Click on "Families" in the sidebar
- You'll see all families with:
  - Family name
  - Admin count
  - Total member count
  - Creation date
  - Status (Active/Suspended)

## Current Database State

### Important Note
The database is currently in-memory and resets on server restart. This means:
- Only the super admin account persists by default
- Any users/families created during runtime are lost on restart
- This is intentional for development/demo purposes

### Default User
- **Super Admin**: super.admin@kutumb.com / Qwerty@123

## Creating New Users

### Option 1: Register New Family (Recommended)
1. Go to http://localhost:8080/simple-register
2. Fill in:
   - Email
   - Family Name
   - Password (must meet requirements)
   - Confirm Password
3. Click "Create Account"
4. Login with the new credentials
5. The user will appear in the Super Admin panel

### Option 2: Via Invite Token (For joining existing families)
1. Login as a family admin
2. Generate an invite token
3. Share the invite link
4. New user registers using the invite link

## Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

## Troubleshooting

### "Unable to create user" or "Invalid credentials"
**Cause**: The database was reset (server restarted)

**Solution**:
1. Register a new account at `/simple-register`
2. Or use the super admin account which always exists

### "Failed to fetch users"
**Cause**: Not authenticated or not a super admin

**Solution**:
1. Logout and login again as super admin
2. Check browser console for detailed errors
3. Verify the access token in localStorage

### Users not showing up
**Cause**: No users have been created yet (except super admin)

**Solution**:
1. Create test users by registering at `/simple-register`
2. Each registration creates a new user and family
3. Refresh the Users page to see new entries

## API Endpoints

### Get All Users (Super Admin Only)
```
GET /api/admin/users
Authorization: Bearer <access_token>

Response:
{
  "success": true,
  "data": [
    {
      "id": "user_id",
      "email": "user@example.com",
      "globalRole": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLogin": "2024-01-02T00:00:00.000Z",
      "failedLoginAttempts": 0,
      "isLocked": false,
      "isEmergencyUser": false,
      "emergencyExpiresAt": null,
      "families": [
        {
          "id": "family_id",
          "name": "Family Name",
          "role": "FAMILY_ADMIN",
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

### Get All Families (Super Admin Only)
```
GET /api/admin/families
Authorization: Bearer <access_token>

Response:
{
  "success": true,
  "data": [
    {
      "id": "family_id",
      "name": "Family Name",
      "adminCount": 1,
      "memberCount": 3,
      "createdAt": "2024-01-01",
      "status": "active"
    }
  ]
}
```

## Testing the Setup

### Step-by-Step Test
1. **Login as Super Admin**
   - Go to http://localhost:8080/login
   - Use: super.admin@kutumb.com / Qwerty@123

2. **Create Test Users**
   - Open a new incognito window
   - Go to http://localhost:8080/simple-register
   - Create 2-3 test families with different names

3. **View in Super Admin Panel**
   - Return to super admin window
   - Navigate to Users page
   - You should see all created users with their family details
   - Navigate to Families page
   - You should see all created families

4. **Test User Details**
   - Each user should show:
     - Their email
     - Role badge (Super Admin/Family Admin/Member)
     - Status badge (Active/Blocked/Emergency)
     - List of families they belong to
     - Last login time
     - Failed login attempts

## Next Steps

To make the database persistent:
1. Integrate with PostgreSQL
2. Update the Database class to use real database queries
3. Remove the in-memory arrays
4. Add proper migrations

For now, the in-memory database is perfect for development and testing!
