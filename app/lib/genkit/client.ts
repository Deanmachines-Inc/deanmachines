import { z } from 'zod';
import type { GenerationConfig } from '@google-cloud/vertexai/build/src/types';
import { LRUCache } from 'lru-cache';
import { genkitConfig } from './config';
import type { GenkitResponse, GenkitError } from './types';
import {
  defaultModelSettings,
  type GenkitModelSettings,
  createGenerationConfig,
} from './settings';
import { EmbeddingService } from './embeddings';
import { createStructuredPrompt, validateStructuredOutput } from './structured';
import { functionCaller } from './functions';
import { VertexAI } from './vertexai';

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

export class GenkitConfigError extends Error implements GenkitError {
  code = 'CONFIGURATION_ERROR' as const;

  constructor(message: string) {
    super(message);
    this.name = 'GenkitConfigError';
  }
}

const validateConfig = (config: GenkitConfig): void => {
  if (!config.projectId) throw new GenkitConfigError('Missing projectId');
  if (!config.location) throw new GenkitConfigError('Missing location');
  if (!config.credentials) throw new GenkitConfigError('Missing credentials');
  if (!config.model) throw new GenkitConfigError('Missing model');
};

const config: Readonly<GenkitConfig> = Object.freeze({
  projectId: genkitConfig.projectId,
  location: genkitConfig.location,
  credentials: genkitConfig.credentials,
  model: genkitConfig.model,
  cache: {
    enabled: true,
    ttl: 3600,
    maxSize: 100,
  },
});

validateConfig(config);

export class GenkitClient {
  private static instance: GenkitClient | null = null;
  private readonly config: Readonly<GenkitConfig>;
  private settings: Readonly<GenkitModelSettings>;
  private readonly client: VertexAI;
  private readonly embedder: EmbeddingService;
  private readonly cache: LRUCache<string, GenkitResponse>;
  private initialized = false;

  private constructor(
    config: GenkitConfig,
    settings?: Partial<GenkitModelSettings>
  ) {
    validateConfig(config);
    this.config = Object.freeze({ ...config });
    this.settings = Object.freeze({ ...defaultModelSettings, ...settings });
    this.client = new VertexAI(this.config);
    this.embedder = new EmbeddingService(this.config, this.settings);
    this.cache = new LRUCache({
      max: this.config.cache?.maxSize || 100,
      ttl: (this.config.cache?.ttl || 3600) * 1000,
    });
  }

  /**
   * Gets or creates the singleton instance of GenkitClient
   */
  public static getInstance(): GenkitClient {
    if (!GenkitClient.instance) {
      const env = GenkitEnvSchema.parse(process.env);

      GenkitClient.instance = new GenkitClient({
        projectId: env.GOOGLE_PROJECT_ID,
        location: env.GOOGLE_LOCATION,
        credentials: env.GOOGLE_APPLICATION_CREDENTIALS,
        model: env.GENKIT_MODEL,
        defaultModel: env.GENKIT_MODEL,
      });
    }
    return GenkitClient.instance;
  }

  /**
   * Initialize Genkit on the server
   */
  async initializeServer(): Promise<void> {
    if (this.initialized) return;

    // Validate environment
    const env = GenkitEnvSchema.parse(process.env);

    this.client = new VertexAI({
      ...this.config,
      credentials: env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    this.initialized = true;
  }

  /**
   * Hydrate client with server state
   */
  async hydrate(serverState: unknown): Promise<void> {
    if (typeof window === 'undefined') return;

    // Rehydrate cache if available
    if (serverState && typeof serverState === 'object') {
      const state = serverState as Record<string, GenkitResponse>;
      Object.entries(state).forEach(([key, value]) => {
        this.cache.set(key, value);
      });
    }
  }

  /**
   * Get serializable state for client hydration
   */
  getState(): Record<string, GenkitResponse> {
    const state: Record<string, GenkitResponse> = {};
    this.cache.forEach((value, key) => {
      state[key] = value;
    });
    return state;
  }

  /**
   * Generates text using the configured model
   * @param prompt - The prompt to generate text for
   * @param options - Optional generation settings
   * @returns The generated text response
   */
  async generate(
    prompt: string,
    options?: Partial<GenerationConfig>
  ): Promise<GenkitResponse> {
    const cacheKey = `${prompt}:${JSON.stringify(options)}`;

    if (this.config.cache?.enabled && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await this.client.generate({
        model: this.config.defaultModel || this.config.model,
        prompt,
        ...defaultModelSettings,
        ...this.settings,
        ...options,
      });

      const result: GenkitResponse = {
        success: true,
        data: response.output(),
      };

      if (this.config.cache?.enabled) {
        this.cache.set(cacheKey, result);
      }

      return result;
    } catch (error) {
      const errorResponse: GenkitResponse = {
        success: false,
        error: {
          code: error instanceof Error ? error.name : 'UNKNOWN_ERROR',
          message:
            error instanceof Error ? error.message : 'Unknown error occurred',
        },
      };
      return errorResponse;
    }
  }

  /**
   * Generate structured output with optional function calling
   */
  async generateStructured<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    options?: {
      functions?: boolean;
      settings?: Partial<GenkitModelSettings>;
    }
  ): Promise<T> {
    const structuredPrompt = createStructuredPrompt(
      {
        schema,
        functions: options?.functions
          ? functionCaller.getDefinitions()
          : undefined,
      },
      prompt
    );

    const response = await this.generate(structuredPrompt, options?.settings);
    const output = JSON.parse(response.data!);

    return validateStructuredOutput(output, schema);
  }

  /**
   * Execute function calls from model output
   */
  async executeFunctionCalls(
    calls: Array<{ name: string; arguments: unknown }>
  ) {
    const results = await Promise.all(
      calls.map((call) => functionCaller.call(call.name, call.arguments))
    );
    return results;
  }

  updateSettings(settings: Partial<GenkitModelSettings>): void {
    this.settings = Object.freeze({ ...this.settings, ...settings });
  }

  // Make getters return readonly copies
  getSettings(): Readonly<GenkitModelSettings> {
    return { ...this.settings };
  }

  getConfig(): Readonly<GenkitConfig> {
    return { ...this.config };
  }

  /**
   * Get embeddings service instance
   */
  getEmbedder(): EmbeddingService {
    return this.embedder;
  }
}

// Create default client instance
export const genkitClient = GenkitClient.getInstance();
export { defaultModelSettings };
export { config as genkitConfig };
