/**
 * Permission-Aware Expense Actions Component
 * Demonstrates how to integrate permissions with existing components
 */

import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Module, PermissionAction } from '@/types/permissions';
import { PermissionGate, PermissionConstraints } from '@/components/permissions/PermissionGate';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Download, Eye, AlertTriangle } from 'lucide-react';

interface Expense {
  id: string;
  amount: number;
  category: string;
  note?: string;
  date: Date;
  type: 'family' | 'personal';
  ownerId?: string;
}

interface PermissionAwareExpenseActionsProps {
  expense?: Expense;
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onExport?: () => void;
  className?: string;
}

export function PermissionAwareExpenseActions({
  expense,
  onAdd,
  onEdit,
  onDelete,
  onExport,
  className
}: PermissionAwareExpenseActionsProps) {
  const { 
    userId, 
    userRole, 
    canView, 
    canCreate, 
    canEdit, 
    canDelete, 
    canExport,
    checkPermission 
  } = usePermissions();

  // Check if user owns this expense
  const isOwner = expense ? expense.ownerId === userId : false;

  // For demonstration, let's simulate ownership and metadata
  const expenseMetadata = expense ? {
    ownerId: expense.ownerId || userId, // Assume current user owns it for demo
    familyId: 'current-family-id',
    category: expense.category,
    amount: expense.amount
  } : undefined;

  const createResult = checkPermission(
    Module.EXPENSE_MANAGEMENT,
    PermissionAction.CREATE,
    undefined,
    expenseMetadata
  );

  const editResult = expense ? checkPermission(
    Module.EXPENSE_MANAGEMENT,
    PermissionAction.EDIT,
    expense.id,
    { ...expenseMetadata, isOwner }
  ) : null;

  const deleteResult = expense ? checkPermission(
    Module.EXPENSE_MANAGEMENT,
    PermissionAction.DELETE,
    expense.id,
    { ...expenseMetadata, isOwner }
  ) : null;

  const exportResult = checkPermission(
    Module.EXPENSE_MANAGEMENT,
    PermissionAction.EXPORT,
    undefined,
    expenseMetadata
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Permission Status Display */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium mb-2">Your Expense Permissions</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline">Role: {userRole}</Badge>
          <Badge variant="outline">User ID: {userId}</Badge>
          {expense && (
            <Badge className={isOwner ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              {isOwner ? 'Owner' : 'Not Owner'}
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span>View:</span>
            <Badge className={canView(Module.EXPENSE_MANAGEMENT) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {canView(Module.EXPENSE_MANAGEMENT) ? '✓' : '✗'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Create:</span>
            <Badge className={createResult.allowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {createResult.allowed ? '✓' : '✗'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Edit:</span>
            <Badge className={editResult?.allowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {editResult?.allowed ? '✓' : '✗'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Delete:</span>
            <Badge className={deleteResult?.allowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {deleteResult?.allowed ? '✓' : '✗'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Action Buttons with Permission Gates */}
      <div className="flex flex-wrap gap-2">
        <PermissionGate
          module={Module.EXPENSE_MANAGEMENT}
          action={PermissionAction.VIEW}
        >
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Expenses
          </Button>
        </PermissionGate>

        <PermissionGate
          module={Module.EXPENSE_MANAGEMENT}
          action={PermissionAction.CREATE}
          metadata={expenseMetadata}
        >
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </PermissionGate>

        {expense && (
          <PermissionGate
            module={Module.EXPENSE_MANAGEMENT}
            action={PermissionAction.EDIT}
            resourceId={expense.id}
            metadata={{ ...expenseMetadata, isOwner }}
          >
            <Button variant="outline" size="sm" onClick={() => onEdit?.(expense.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </PermissionGate>
        )}

        {expense && (
          <PermissionGate
            module={Module.EXPENSE_MANAGEMENT}
            action={PermissionAction.DELETE}
            resourceId={expense.id}
            metadata={{ ...expenseMetadata, isOwner }}
          >
            <Button variant="outline" size="sm" onClick={() => onDelete?.(expense.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </PermissionGate>
        )}

        <PermissionGate
          module={Module.EXPENSE_MANAGEMENT}
          action={PermissionAction.EXPORT}
          metadata={expenseMetadata}
        >
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </PermissionGate>
      </div>

      {/* Permission Constraints Display */}
      <div className="space-y-2">
        <h4 className="font-medium">Active Constraints</h4>
        
        <PermissionConstraints
          module={Module.EXPENSE_MANAGEMENT}
          action={PermissionAction.CREATE}
          metadata={expenseMetadata}
        />

        {expense && (
          <PermissionConstraints
            module={Module.EXPENSE_MANAGEMENT}
            action={PermissionAction.EDIT}
            resourceId={expense.id}
            metadata={{ ...expenseMetadata, isOwner }}
          />
        )}
      </div>

      {/* Permission Denied Messages */}
      {!createResult.allowed && createResult.reason && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Cannot create expenses: {createResult.reason}
          </AlertDescription>
        </Alert>
      )}

      {expense && editResult && !editResult.allowed && editResult.reason && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Cannot edit this expense: {editResult.reason}
          </AlertDescription>
        </Alert>
      )}

      {expense && deleteResult && !deleteResult.allowed && deleteResult.reason && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Cannot delete this expense: {deleteResult.reason}
          </AlertDescription>
        </Alert>
      )}

      {!exportResult.allowed && exportResult.reason && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Cannot export data: {exportResult.reason}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

/**
 * Permission-Aware Expense List Item
 * Shows how individual expense items can have permission-based actions
 */
interface PermissionAwareExpenseItemProps {
  expense: Expense;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PermissionAwareExpenseItem({
  expense,
  onEdit,
  onDelete
}: PermissionAwareExpenseItemProps) {
  const { userId } = usePermissions();
  const isOwner = expense.ownerId === userId;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <div className="font-medium">₹{expense.amount.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">{expense.category}</div>
        {expense.note && (
          <div className="text-sm text-muted-foreground">{expense.note}</div>
        )}
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {expense.type}
          </Badge>
          {isOwner && (
            <Badge className="bg-green-100 text-green-800 text-xs">
              Your expense
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <PermissionGate
          module={Module.EXPENSE_MANAGEMENT}
          action={PermissionAction.EDIT}
          resourceId={expense.id}
          metadata={{ isOwner, ownerId: expense.ownerId }}
        >
          <Button variant="outline" size="sm" onClick={() => onEdit(expense.id)}>
            <Edit className="h-4 w-4" />
          </Button>
        </PermissionGate>

        <PermissionGate
          module={Module.EXPENSE_MANAGEMENT}
          action={PermissionAction.DELETE}
          resourceId={expense.id}
          metadata={{ isOwner, ownerId: expense.ownerId }}
        >
          <Button variant="outline" size="sm" onClick={() => onDelete(expense.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </PermissionGate>
      </div>
    </div>
  );
}