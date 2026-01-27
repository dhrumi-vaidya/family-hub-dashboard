import { z } from 'zod';

// Common validation patterns
export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Phone number is required')
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number');

export const emailOrPhoneSchema = z
  .string()
  .trim()
  .min(1, 'Email or phone number is required')
  .refine(
    (value) => {
      // Check if it's a valid email
      const emailResult = z.string().email().safeParse(value);
      if (emailResult.success) return true;
      
      // Check if it's a valid phone number
      const phoneResult = z.string().regex(/^[6-9]\d{9}$/).safeParse(value);
      return phoneResult.success;
    },
    'Please enter a valid email address or 10-digit mobile number'
  );

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*?&)');

export const nameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must not exceed 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

export const familyNameSchema = z
  .string()
  .trim()
  .min(1, 'Family name is required')
  .min(2, 'Family name must be at least 2 characters')
  .max(30, 'Family name must not exceed 30 characters');

export const amountSchema = z
  .string()
  .trim()
  .min(1, 'Amount is required')
  .refine(
    (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    },
    'Please enter a valid amount greater than 0'
  )
  .refine(
    (value) => {
      const num = parseFloat(value);
      return num <= 999999;
    },
    'Amount cannot exceed ₹9,99,999'
  );

export const ageSchema = z
  .string()
  .trim()
  .min(1, 'Age is required')
  .refine(
    (value) => {
      const num = parseInt(value);
      return !isNaN(num) && num >= 0 && num <= 150;
    },
    'Please enter a valid age between 0 and 150'
  );

export const titleSchema = z
  .string()
  .trim()
  .min(1, 'Title is required')
  .min(3, 'Title must be at least 3 characters')
  .max(200, 'Title must not exceed 200 characters');

export const descriptionSchema = z
  .string()
  .trim()
  .max(500, 'Description must not exceed 500 characters')
  .optional();

export const dateSchema = z
  .string()
  .min(1, 'Date is required')
  .refine(
    (value) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    },
    'Please enter a valid date'
  );

export const futureDateSchema = z
  .string()
  .min(1, 'Date is required')
  .refine(
    (value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    'Date cannot be in the past'
  );

// Form schemas
export const loginSchema = z.object({
  email: emailOrPhoneSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  familyName: familyNameSchema,
});

export const addExpenseSchema = z.object({
  amount: amountSchema,
  category: z.string().min(1, 'Category is required'),
  description: descriptionSchema,
  date: dateSchema,
});

export const addMemberSchema = z.object({
  name: nameSchema,
  age: ageSchema,
  role: z.string().min(1, 'Role is required'),
  email: emailSchema.optional().or(z.literal('')),
});

export const createTaskSchema = z.object({
  title: titleSchema,
  assignee: z.string().min(1, 'Assignee is required'),
  dueDate: futureDateSchema,
  description: descriptionSchema,
  recurrence: z.enum(['once', 'daily', 'weekly', 'monthly']),
});

export const uploadHealthRecordSchema = z.object({
  recordType: z.string().min(1, 'Record type is required'),
  member: z.string().min(1, 'Member is required'),
  date: dateSchema,
  file: z.any().refine(
    (file) => file && file.size > 0,
    'Please select a file to upload'
  ).refine(
    (file) => file && file.size <= 10 * 1024 * 1024, // 10MB
    'File size must be less than 10MB'
  ).refine(
    (file) => {
      if (!file) return false;
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];
      return allowedTypes.includes(file.type);
    },
    'File must be a JPEG, PNG, or PDF'
  ),
});

export const emergencyAccessSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  reason: z.string().min(1, 'Reason is required').min(10, 'Reason must be at least 10 characters'),
  duration: z.number().min(1, 'Duration must be at least 1 hour').max(168, 'Duration cannot exceed 168 hours (7 days)'),
  modules: z.array(z.string()).min(1, 'At least one module must be selected'),
  actions: z.array(z.string()).min(1, 'At least one action must be selected'),
  ipRestrictions: z.array(z.string().regex(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    'Invalid IP address format'
  )).optional(),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AddExpenseFormData = z.infer<typeof addExpenseSchema>;
export type AddMemberFormData = z.infer<typeof addMemberSchema>;
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UploadHealthRecordFormData = z.infer<typeof uploadHealthRecordSchema>;
export type EmergencyAccessFormData = z.infer<typeof emergencyAccessSchema>;