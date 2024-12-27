import { z } from 'zod';
import { GenkitConfig } from '../app/lib/genkit/client';

export const GenkitConfigSchema = z.object({
  projectId: z.string().min(1),
  location: z.string().default('us-central1'),
  credentials: z.string().min(1),
  model: z.string().default('gemini-pro'),
  cache: z
    .object({
      enabled: z.boolean().default(true),
      ttl: z.number().default(3600),
      maxSize: z.number().default(100),
    })
    .optional(),
});

export type GenkitConfigType = z.infer<typeof GenkitConfigSchema>;

export interface GenkitResponse {
  data: string;
  error?: GenkitError;
}

export interface GenkitError {
  code: string;
  message: string;
}

export interface GenerationConfig {
  temperature?: number;
  maxTokens?: number;
}
