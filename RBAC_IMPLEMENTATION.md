# KutumbOS RBAC Permission System Implementation

## Overview

This document describes the comprehensive Role-Based Access Control (RBAC) system implemented for KutumbOS. The system provides fine-grained permission control across all platform modules with strict role hierarchy and context-aware access control.

## Architecture

### Core Components

1. **Permission Types** (`src/types/permissions.ts`)
   - Defines all permission-related types and enums
   - Includes roles, modules, actions, and context structures

2. **Permission Matrix** (`src/lib/permissions/matrix.ts`)
   - Authoritative permission definitions for all role-module-action combinations
   - Supports boolean permissions and conditional logic

3. **Permission Engine** (`src/lib/permissions/engine.ts`)
   - Core permission evaluation logic
   - Handles conditional permissions and context-aware checks

4. **React Hooks** (`src/hooks/usePermissions.ts`)
   - Provides easy access to permission checks in components
   - Includes convenience methods and batch operations

5. **UI Components** (`src/components/permissions/`)
   - Permission gates for conditional rendering
   - Role management interface
   - Permission matrix visualization
   - Emergency access management

## Permission Model

### Roles (Strict Hierarchy)

1. **Super Admin** - Platform-level authority, bypasses all restrictions
2. **Family Admin** - Full authority within a single family
3. **Adult Member** - Full control over own data, limited family access
4. **Senior Member** - Read-oriented role, minimal write permissions
5. **Teen Member** - Highly constrained role with safety-first design
6. **Child Member** - Most restricted role with hard caps
7. **Emergency User** - Time-bound, scope-bound, fully audited access

### Modules

#### Platform-Level Modules
- **Authentication** - User lifecycle and security
- **Family Management** - Family creation and membership

#### Core Family Modules
- **Expense Management** - Personal and family expenses with budgets
- **Health Records** - Medical documents and manual entries
- **Responsibility Engine** - Task assignment and tracking
- **Notifications** - In-app and WhatsApp messaging

#### System Modules
- **UI Mode Control** - Simple/Fast mode management
- **Audit Logs** - System activity logging
- **System Configuration** - Platform-wide settings
- **Emergency Access** - Time-limited emergency permissions

### Actions (Atomic Permissions)

- **VIEW** - Read access to resources
- **CREATE** - Create new resources
- **EDIT** - Modify existing resources
- **DELETE** - Remove resources (soft delete only except Super Admin)
- **APPROVE** - Approve pending actions
- **EXPORT** - Export data from the system
- **OVERRIDE** - Override system constraints
- **AUDIT** - Access audit logs and system monitoring

## Implementation Details

### Permission Evaluation

The system evaluates permissions using the formula:
```
Effective Permission = User Role × Family Context × Module × Action × Record Ownership × System Constraints
```

### Conditional Permissions

Many permissions are marked as `CONDITIONAL` in the matrix, meaning they depend on:
- **Record Ownership** - Users can typically edit their own data
- **Family Context** - Family admins can manage their own family only
- **Time Constraints** - Emergency access has time limits
- **Category Limits** - Teens/children have restricted expense categories
- **Amount Limits** - Spending caps for younger users

### Emergency Access

Emergency access provides:
- **Time-bound access** - Automatically expires
- **Module-specific scope** - Limited to necessary modules
- **IP restrictions** - Can be restricted to specific locations
- **Full audit logging** - All actions are logged
- **Read-only by default** - Write access requires explicit grant

## Usage Examples

### Basic Permission Check
```typescript
import { usePermissions } from '@/hooks/usePermissions';
import { Module, PermissionAction } from '@/types/permissions';

function MyComponent() {
  const { canEdit } = usePermissions();
  
  const canEditExpense = canEdit(
    Module.EXPENSE_MANAGEMENT, 
    'expense-123', 
    { ownerId: 'user-456' }
  );
  
  return canEditExpense ? <EditButton /> : null;
}
```

### Permission Gate Component
```typescript
import { PermissionGate } from '@/components/permissions/PermissionGate';

function ExpenseActions() {
  return (
    <PermissionGate 
      module={Module.EXPENSE_MANAGEMENT} 
      action={PermissionAction.DELETE}
      fallback={<div>No delete permission</div>}
    >
      <DeleteButton />
    </PermissionGate>
  );
}
```

### Role-Based Access
```typescript
import { RoleGate } from '@/components/permissions/PermissionGate';
import { UserRole } from '@/types/permissions';

function AdminPanel() {
  return (
    <RoleGate allowedRoles={[UserRole.SUPER_ADMIN, UserRole.FAMILY_ADMIN]}>
      <AdminInterface />
    </RoleGate>
  );
}
```

## Security Guarantees

### Backend Authority
- Frontend only hides features, never grants authority
- All permission checks must be validated on the backend
- UI permissions are for user experience only

### Data Isolation
- Family data isolation is absolute
- No cross-family queries allowed
- Users can only access their own family's data

### Audit Trail
- All sensitive actions generate immutable audit entries
- Emergency access is fully logged
- System administrators can track all permission grants

### Fail-Safe Design
- Permissions default to denied
- Unknown states result in access denial
- System errors block access rather than grant it

## Testing

The system includes comprehensive tests in `src/lib/permissions/test.ts`:

```typescript
import { runPermissionTests } from '@/lib/permissions/test';

// Run all permission tests
const results = runPermissionTests();
console.log(`${results.passed} passed, ${results.failed} failed`);
```

### Test Coverage
- Super Admin permissions
- Role-specific restrictions
- Conditional permission evaluation
- Emergency access functionality
- Permission matrix completeness
- Batch permission operations

## Demo and Visualization

Access the permission system demo at `/permissions-demo` which includes:

1. **Permission Testing** - Test your current permissions for different modules
2. **System Tests** - Run comprehensive permission system tests
3. **Permission Gates** - See conditional rendering in action
4. **Role Management** - Manage family member roles
5. **Permission Matrix** - Visualize all role-module-action combinations
6. **Emergency Access** - Grant and monitor emergency access

## Integration Guide

### Adding New Modules

1. Add module to `Module` enum in `src/types/permissions.ts`
2. Add module permissions to `PERMISSION_MATRIX` in `src/lib/permissions/matrix.ts`
3. Add conditional logic to `PermissionEngine` if needed
4. Update tests in `src/lib/permissions/test.ts`

### Adding New Roles

1. Add role to `UserRole` enum in `src/types/permissions.ts`
2. Add role permissions to `PERMISSION_MATRIX` for all modules
3. Update role hierarchy logic if needed
4. Add role-specific conditional logic to `PermissionEngine`

### Adding New Actions

1. Add action to `PermissionAction` enum in `src/types/permissions.ts`
2. Add action permissions to `PERMISSION_MATRIX` for all role-module combinations
3. Add action-specific logic to `PermissionEngine` if needed

## Best Practices

### Component Design
- Use `PermissionGate` for conditional rendering
- Provide meaningful fallback content
- Show permission constraints to users
- Use role gates for large sections

### Permission Checks
- Check permissions as close to the action as possible
- Use batch checks for multiple permissions
- Cache permission results when appropriate
- Handle permission errors gracefully

### User Experience
- Show why access is denied
- Provide clear permission constraints
- Use progressive disclosure for complex permissions
- Maintain consistent permission messaging

## Troubleshooting

### Common Issues

1. **Permission always denied**
   - Check if user is authenticated
   - Verify role assignment
   - Check family context
   - Review conditional logic

2. **Conditional permissions not working**
   - Verify metadata is passed correctly
   - Check resource ownership
   - Review context parameters

3. **Emergency access not working**
   - Check expiration time
   - Verify module/action scope
   - Check IP restrictions
   - Review audit logs

### Debug Tools

Use the permission demo page to:
- Test specific permission combinations
- View active constraints
- Run system tests
- Monitor permission evaluation

## Future Enhancements

### Planned Features
- **Custom Permissions** - Override default permissions for specific users
- **Time-Based Permissions** - Permissions that change based on time
- **Location-Based Permissions** - GPS-based access control
- **Delegation** - Temporary permission delegation between users
- **Permission Templates** - Predefined permission sets for common scenarios

### Performance Optimizations
- **Permission Caching** - Cache frequently checked permissions
- **Batch Evaluation** - Optimize multiple permission checks
- **Lazy Loading** - Load permissions on demand
- **Background Sync** - Sync permissions in background

This RBAC system provides a solid foundation for secure, scalable access control in KutumbOS while maintaining flexibility for future enhancements.