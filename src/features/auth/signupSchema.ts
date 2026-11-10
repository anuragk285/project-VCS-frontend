import { z } from 'zod'
import type { RegisterInput } from '@/api/auth'
import { isValidEmail, isValidPhone } from '@/lib/phone'

// The same rules as the backend (POST /auth/register), so people see problems before anything is sent.
export const signupSchema = z
  .object({
    name: z.string().trim().min(1, 'Enter your full name').max(100, 'Name is too long (100 letters at most)'),
    phone: z
      .string()
      .trim()
      .refine((value) => value === '' || isValidPhone(value), 'Enter a valid 10 digit mobile number'),
    email: z
      .string()
      .trim()
      .max(255, 'Email is too long')
      .refine((value) => value === '' || isValidEmail(value), 'Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Use at least 8 characters')
      .max(128, 'Password is too long (128 characters at most)'),
  })
  // Phone and email are each optional, but one of them is needed.
  .refine((values) => values.phone !== '' || values.email !== '', {
    message: 'Give a phone number or an email',
    path: ['phone'],
  })

export type SignupValues = z.infer<typeof signupSchema>

export const signupDefaults: SignupValues = { name: '', phone: '', email: '', password: '' }

/** Turns form values into what the API wants: empty phone or email are left out. */
export function toRegisterInput(values: SignupValues): RegisterInput {
  return {
    name: values.name,
    phone: values.phone || undefined,
    email: values.email || undefined,
    password: values.password,
  }
}