

import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  userType: z.enum(['freelancer', 'client']),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  skills: z.array(z.string()).optional(),
  hourlyRate: z.number().optional(),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  skills: z.array(z.string()).optional(),
  hourlyRate: z.number().positive().optional(),
  avatar: z.string().optional(),
});

