import { z } from 'zod';

export const SalaryRangeSchema = z.object({
  min: z.number().positive(),
  max: z.number().positive(),
  currency: z.string().default('USD'),
  experienceLevel: z.enum(['entry', 'mid', 'senior']).optional()
});

export const CreateLanguageSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(10),
    useCases: z.array(z.string()).min(1),
    advantages: z.array(z.string()).min(1),
    salaryRange: SalaryRangeSchema,
    popularityIndex: z.number().int().min(1).max(100),
    releaseYear: z.number().int().min(1950),
    logoUrl: z.string().url().optional()
  })
});

export const UpdateLanguageSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().min(10).optional(),
    useCases: z.array(z.string()).min(1).optional(),
    advantages: z.array(z.string()).min(1).optional(),
    salaryRange: SalaryRangeSchema.optional(),
    popularityIndex: z.number().int().min(1).max(100).optional(),
    releaseYear: z.number().int().min(1950).optional(),
    logoUrl: z.string().url().optional()
  })
});
