import { z } from 'zod'
import { isValidEmail, isValidPhone } from '@/lib/phone'

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Enter your phone number or email')
    .superRefine((value, ctx) => {
      if (value === '') return // the message above already covers it
      if (value.includes('@')) {
        if (!isValidEmail(value)) ctx.addIssue({ code: 'custom', message: 'Enter a valid email address' })
      } else if (!isValidPhone(value)) {
        ctx.addIssue({ code: 'custom', message: 'Enter a valid 10 digit mobile number' })
      }
    }),
  password: z.string().min(1, 'Enter your password'),
})

export type LoginValues = z.infer<typeof loginSchema>
