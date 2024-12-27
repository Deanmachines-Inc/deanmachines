import { z } from 'zod';

export const defaultModelSettings = Object.freeze({
  temperature: 0.7,
  maxOutputTokens: 1024,
  topP: 0.95,
  topK: 40,
});

export const GenkitModelSettingsSchema = z.object({
  temperature: z.number().min(0).max(1).default(0.7),
  maxOutputTokens: z.number().min(1).max(1024).default(1024),
  topP: z.number().min(0).max(1).default(0.95),
  topK: z.number().min(1).max(100).default(40),
});

export type GenkitModelSettings = z.infer<typeof GenkitModelSettingsSchema>;

export const createGenerationConfig = (
  settings: GenkitModelSettings,
  contents: import('@google-cloud/vertexai').Content[]
): Parameters<
  import('@google-cloud/vertexai').GenerativeModel['generateContent']
>[0] => {
  const config = {
    temperature: settings.temperature,
    maxOutputTokens: settings.maxOutputTokens,
    topP: settings.topP,
    topK: settings.topK,
    contents,
  };

  return config;
};
