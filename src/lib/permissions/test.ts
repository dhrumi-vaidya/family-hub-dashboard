/**
 * Permission System Test Suite
 * Comprehensive tests to verify RBAC implementation
 */

import { PermissionEngine } from './engine';
import { PERMISSION_MATRIX } from './matrix';
import { 
  UserRole, 
  Module, 
  PermissionAction, 
  PermissionContext,
  PermissionResult 
} from '@/types/permissions';

// Test helper function
function createTestContext(
  role: UserRole, 
  userId: string = 'test-user', 
  familyId: string = 'test-family'
): PermissionContext {
  return {
    userId,
    familyId,
    role,
  };
}

// Test cases
export function runPermissionTests(): { passed: number; failed: number; results: any[] } {
  const results: any[] = [];
  let passed = 0;
  let failed = 0;

  const test = (name: string, testFn: () => boolean) => {
    try {
      const result = testFn();
      if (result) {
        passed++;
        results.push({ name, status: 'PASSED' });
      } else {
        failed++;
        results.push({ name, status: 'FAILED', error: 'Test assertion failed' });
      }
    } catch (error) {
      failed++;
      results.push({ name, status: 'FAILED', error: error.message });
    }
  };

  // Test 1: Super Admin has all permissions
  test('Super Admin has all permissions', () => {
    const context = createTestContext(UserRole.SUPER_ADMIN);
    const result = PermissionEngine.checkPermission(
      context,
      Module.SYSTEM_CONFIG,
      PermissionAction.DELETE
    );
    return result.allowed === true;
  });

  // Test 2: Child Member cannot delete expenses
  test('Child Member cannot delete expenses', () => {
    const context = createTestContext(UserRole.CHILD_MEMBER);
    const result = PermissionEngine.checkPermission(
      context,
      Module.EXPENSE_MANAGEMENT,
      PermissionAction.DELETE
    );
    return result.allowed === false;
  });

  // Test 3: Family Admin can manage family but not system config
  test('Family Admin can manage family but not system config', () => {
    const context = createTestContext(UserRole.FAMILY_ADMIN);
    
    const familyResult = PermissionEngine.checkPermission(
      context,
      Module.FAMILY_MANAGEMENT,
      PermissionAction.EDIT,
      'test-family',
      { familyId: 'test-family' }
    );
    
    const systemResult = PermissionEngine.checkPermission(
      context,
      Module.SYSTEM_CONFIG,
      PermissionAction.VIEW
    );
    
    return familyResult.allowed === true && systemResult.allowed === false;
  });

  // Test 4: Adult Member can edit own expenses
  test('Adult Member can edit own expenses', () => {
    const context = createTestContext(UserRole.ADULT_MEMBER);
    const result = PermissionEngine.checkPermission(
      context,
      Module.EXPENSE_MANAGEMENT,
      PermissionAction.EDIT,
      'expense-123',
      { ownerId: 'test-user' }
    );
    return result.allowed === true;
  });

  // Test 5: Adult Member cannot edit others' expenses
  test('Adult Member cannot edit others\' expenses', () => {
    const context = createTestContext(UserRole.ADULT_MEMBER);
    const result = PermissionEngine.checkPermission(
      context,
      Module.EXPENSE_MANAGEMENT,
      PermissionAction.EDIT,
      'expense-123',
      { ownerId: 'other-user' }
    );
    return result.allowed === false;
  });

  // Test 6: Teen Member has spending constraints
  test('Teen Member has spending constraints', () => {
    const context = createTestContext(UserRole.TEEN_MEMBER);
    const result = PermissionEngine.checkPermission(
      context,
      Module.EXPENSE_MANAGEMENT,
      PermissionAction.CREATE
    );
    return result.allowed === true && result.constraints && result.constraints.length > 0;
  });

  // Test 7: Senior Member cannot edit expenses
  test('Senior Member cannot edit expenses', () => {
    const context = createTestContext(UserRole.SENIOR_MEMBER);
    const result = PermissionEngine.checkPermission(
      context,
      Module.EXPENSE_MANAGEMENT,
      PermissionAction.EDIT,
      'expense-123',
      { ownerId: 'test-user' }
    );
    return result.allowed === false;
  });

  // Test 8: Emergency User has limited access
  test('Emergency User has limited access', () => {
    const context = createTestContext(UserRole.EMERGENCY_USER);
    context.emergencyAccess = {
      id: 'emergency-123',
      userId: 'test-user',
      familyId: 'test-family',
      grantedBy: 'admin-user',
      grantedAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      modules: [Module.HEALTH_RECORDS],
      actions: [PermissionAction.VIEW],
      isActive: true,
      auditLog: []
    };

    const allowedResult = PermissionEngine.checkPermission(
      context,
      Module.HEALTH_RECORDS,
      PermissionAction.VIEW
    );

    const deniedResult = PermissionEngine.checkPermission(
      context,
      Module.EXPENSE_MANAGEMENT,
      PermissionAction.VIEW
    );

    return allowedResult.allowed === true && deniedResult.allowed === false;
  });

  // Test 9: Module access check
  test('Module access check works correctly', () => {
    const superAdminContext = createTestContext(UserRole.SUPER_ADMIN);
    const childContext = createTestContext(UserRole.CHILD_MEMBER);

    const superAdminAccess = PermissionEngine.hasModuleAccess(
      superAdminContext,
      Module.SYSTEM_CONFIG
    );

    const childAccess = PermissionEngine.hasModuleAccess(
      childContext,
      Module.SYSTEM_CONFIG
    );

    return superAdminAccess === true && childAccess === false;
  });

  // Test 10: Batch permission check
  test('Batch permission check works correctly', () => {
    const context = createTestContext(UserRole.FAMILY_ADMIN);
    const checks = [
      { module: Module.FAMILY_MANAGEMENT, action: PermissionAction.VIEW },
      { module: Module.SYSTEM_CONFIG, action: PermissionAction.VIEW },
      { module: Module.EXPENSE_MANAGEMENT, action: PermissionAction.CREATE }
    ];

    const results = PermissionEngine.checkMultiplePermissions(context, checks);
    const resultValues = Object.values(results);

    // Family admin should have family management and expense permissions but not system config
    return resultValues.length === 3 && 
           resultValues.some(r => r.allowed) && 
           resultValues.some(r => !r.allowed);
  });

  // Test 11: Permission matrix completeness
  test('Permission matrix is complete', () => {
    const roles = Object.values(UserRole);
    const modules = Object.values(Module);
    const actions = Object.values(PermissionAction);

    for (const role of roles) {
      if (!PERMISSION_MATRIX[role]) return false;
      
      for (const module of modules) {
        if (!PERMISSION_MATRIX[role][module]) return false;
        
        for (const action of actions) {
          const permission = PERMISSION_MATRIX[role][module][action];
          if (permission !== true && permission !== false && permission !== 'CONDITIONAL') {
            return false;
          }
        }
      }
    }
    return true;
  });

  // Test 12: Conditional permission evaluation
  test('Conditional permissions are evaluated correctly', () => {
    const context = createTestContext(UserRole.FAMILY_ADMIN);
    
    // Should allow viewing own family
    const ownFamilyResult = PermissionEngine.checkPermission(
      context,
      Module.FAMILY_MANAGEMENT,
      PermissionAction.VIEW,
      'test-family',
      { familyId: 'test-family' }
    );

    // Should deny viewing other family
    const otherFamilyResult = PermissionEngine.checkPermission(
      context,
      Module.FAMILY_MANAGEMENT,
      PermissionAction.VIEW,
      'other-family',
      { familyId: 'other-family' }
    );

    return ownFamilyResult.allowed === true && otherFamilyResult.allowed === false;
  });

  return { passed, failed, results };
}

// Console test runner
export function runPermissionTestsInConsole(): void {
  console.log('🧪 Running Permission System Tests...\n');
  
  const { passed, failed, results } = runPermissionTests();
  
  results.forEach((result, index) => {
    const icon = result.status === 'PASSED' ? '✅' : '❌';
    console.log(`${icon} Test ${index + 1}: ${result.name}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  console.log(`Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Permission system is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please review the permission implementation.');
  }
}

// Export for use in components
export { runPermissionTests as testPermissions };