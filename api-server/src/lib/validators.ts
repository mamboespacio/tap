import { z } from 'zod';

export const OrderSchema = z.object({
  total: z.number(),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});