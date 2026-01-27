import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { addMemberSchema, type AddMemberFormData } from '@/lib/validations';

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roles = ['Admin', 'Member'];
const permissions = ['Read', 'Write', 'Confirm'];

export function AddMemberModal({ open, onOpenChange }: AddMemberModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['Read']);

  const form = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      name: '',
      age: '',
      role: '',
      email: '',
    },
  });

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permission]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
    }
  };

  const handleSubmit = (data: AddMemberFormData) => {
    toast.success(`${data.name} has been added to the family`);
    form.reset();
    setSelectedPermissions(['Read']);
    onOpenChange(false);
  };

  const handleCancel = () => {
    form.reset();
    setSelectedPermissions(['Read']);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter full name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter age"
                      min="0"
                      max="150"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (for login)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Permissions</FormLabel>
              <div className="flex flex-wrap gap-4 pt-1">
                {permissions.map((perm) => (
                  <div key={perm} className="flex items-center gap-2">
                    <Checkbox
                      id={perm}
                      checked={selectedPermissions.includes(perm)}
                      onCheckedChange={(checked) => handlePermissionChange(perm, checked as boolean)}
                    />
                    <FormLabel htmlFor={perm} className="font-normal">{perm}</FormLabel>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Add Member</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
