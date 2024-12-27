import { z } from 'zod';
import type { GenerationConfig } from '@google-cloud/vertexai/build/src/types';
import { LRUCache } from 'lru-cache';
import type { GenkitResponse } from './types';
import { createGenerationConfig } from './settings';
import { functionCaller } from './functions';

const GenkitEnvSchema = z.object({
  GOOGLE_PROJECT_ID: z.string().min(1),
  GOOGLE_LOCATION: z.string().default('us-central1'),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().min(1),
  GENKIT_MODEL: z.string().default('gemini-pro'),
});

export interface GenkitConfig {
  projectId: string;
  location: string;
  credentials: string;
  model: string;
  defaultModel?: string; // Add this to support model selection
  cache?: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
}

const env = GenkitEnvSchema.parse(process.env);

const cache = new LRUCache<string, GenkitResponse>({
  max: env.GENKIT_CACHE_MAX_SIZE || 100,
  ttl: env.GENKIT_CACHE_TTL || 1000 * 60 * 5, // 5 minutes
});

export const genkitClient = {
  config: {
    projectId: env.GOOGLE_PROJECT_ID,
    location: env.GOOGLE_LOCATION,
    credentials: env.GOOGLE_APPLICATION_CREDENTIALS,
    model: env.GENKIT_MODEL,
  },
  cache,
  async generate(
    prompt: string,
    config: GenerationConfig
  ): Promise<GenkitResponse> {
    const cacheKey = `${prompt}-${JSON.stringify(config)}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    const generationConfig = createGenerationConfig(config);
    const response = await functionCaller.callFunction({
      projectId: this.config.projectId,
      location: this.config.location,
      credentials: this.config.credentials,
      model: this.config.model,
      prompt,
      generationConfig,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    cache.set(cacheKey, response);
    return response;
  },
};

// Example usage
(async () => {
  try {
    const response = await genkitClient.generate('Hello, world!', {
      temperature: 0.7,
      maxTokens: 100,
    });
    console.log('Generated response:', response);
  } catch (error) {
    console.error('Error generating response:', error);
  }
})();
