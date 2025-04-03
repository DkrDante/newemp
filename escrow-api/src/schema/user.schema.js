

import { z } from 'zod';
export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  type: z.enum(['freelancer', 'client']),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

