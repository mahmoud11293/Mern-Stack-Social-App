import * as z from 'zod';

// ========== Signup Schema ==========

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(20, 'Name must be less than 20 characters'),
    email: z.email('Invalid email').nonempty('Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    // .regex(
    //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*?[@$!%*#?&-]).{8,}/,
    //   'Password must be at least 8 characters long and contain at least one letter, one number, and one special character',
    // ),
    rePassword: z.string().min(8),
    dateOfBirth: z.coerce
      .date()
      .transform((d) => d.toISOString().split('T')[0]),
    gender: z.enum(['male', 'female'], "Gender must be 'male' or 'female'"),
  })
  .refine((data) => data.password === data.rePassword, {
    error: 'Passwords do not match',
    path: ['rePassword'],
  });

// ========== Signin Schema ==========

export const signinSchema = z.object({
  email: z.string().email('Invalid email').nonempty('Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  // .regex(
  //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*?[@$!%*#?&-]).{8,}/,
  //   'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  // ),
});

// ========== Change Password Schema ==========

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  // .regex(
  //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*?[@$!%*#?&-]).{8,}/,
  //   'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  // ),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  // .regex(
  //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*?[@$!%*#?&-]).{8,}/,
  //   'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  // ),
});
