import { z } from 'zod'

export const storeClientSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

export const showClientSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
})

export const updateClientSchema = z.object({
  username: z.string().min(1, 'Username is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(1, 'Password is required').optional(),
})

export const destroyClientSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
})
