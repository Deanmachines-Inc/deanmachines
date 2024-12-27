import { z } from 'zod';

export interface GenkitResponse {
  success: boolean;
  data?: string;
  error?: GenkitError;
}

export interface GenkitError {
  code: string;
  message: string;
}

export interface FunctionCall {
  name: string;
  arguments: unknown;
}

export interface FunctionDefinition {
  name: string;
  description: string;
  schema: z.ZodSchema<unknown>;
  handler: (args: unknown) => Promise<unknown>;
}
