import { z } from 'zod';
import type { GenerationConfig } from '@google-cloud/vertexai/build/src/types';
import { LRUCache } from 'lru-cache';
import type { GenkitResponse, GenkitError } from './types';
import { FunctionDefinition } from './types';
import { functionCaller } from './functions';
import { defineConfig } from 'vite';
import { GenkitConfigSchema } from './types';
import {
  json,
  type ActionFunction,
  type LoaderFunction,
} from '@remix-run/node';
import {
  useLoaderData,
  useActionData,
  Form,
  useNavigation,
} from '@remix-run/react';
import { genkitClient, type GenerationConfig } from '~/lib/genkit/client';
import type { ProcessResponse } from '~/services/genkit.server';

// Cache configuration
export const cacheConfig = {
  maxSize: parseInt(process.env.GENKIT_CACHE_MAX_SIZE || '100', 10),
  ttl: parseInt(process.env.GENKIT_CACHE_TTL || '300000', 10), // 5 minutes
};

// Model settings with strict typing
export const defaultModelSettings = Object.freeze({
  temperature: 0.7,
  maxOutputTokens: 1024,
  topP: 0.95,
  topK: 40,
  candidateCount: 1,
  stopSequences: [],
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_HIGH_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_HIGH_AND_ABOVE',
    },
  ],
});

// Validation schema for model settings
export const GenkitModelSettingsSchema = z.object({
  temperature: z.number().min(0).max(1).default(0.7),
  maxOutputTokens: z.number().min(1).max(1024).default(1024),
  topP: z.number().min(0).max(1).default(0.95),
  topK: z.number().min(1).max(100).default(40),
  candidateCount: z.number().min(1).max(8).default(1),
  stopSequences: z.array(z.string()).default([]),
  safetySettings: z
    .array(
      z.object({
        category: z.string(),
        threshold: z.string(),
      })
    )
    .default(defaultModelSettings.safetySettings),
});

export type GenkitModelSettings = z.infer<typeof GenkitModelSettingsSchema>;

// Cache implementation
export const responseCache = new LRUCache<string, GenkitResponse>({
  max: cacheConfig.maxSize,
  ttl: cacheConfig.ttl,
});

/**
 * Creates a validated generation configuration
 * @param settings - Partial settings to override defaults
 * @returns Validated GenerationConfig
 */
export function createGenerationConfig(
  settings: Partial<GenkitModelSettings> = {}
): GenerationConfig {
  const config = {
    ...defaultModelSettings,
    ...settings,
  };

  return GenkitModelSettingsSchema.parse(config);
}

/**
 * Validates and processes error responses
 * @param error - Error object from Genkit
 * @returns Formatted error response
 */
export function processError(error: unknown): GenkitError {
  if (error instanceof Error) {
    return {
      code: 'PROCESSING_ERROR',
      message: error.message,
    };
  }
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
  };
}

/**
 * Creates a cache key for the given prompt and settings
 */
export function createCacheKey(
  prompt: string,
  settings: Partial<GenkitModelSettings>
): string {
  return `${prompt}-${JSON.stringify(settings)}`;
}

// Function definitions with enhanced error handling
export const functionCaller = {
  definitions: new Map<string, FunctionDefinition>(),

  register: (definition: FunctionDefinition): void => {
    if (functionCaller.definitions.has(definition.name)) {
      throw new Error(`Function "${definition.name}" already registered`);
    }
    functionCaller.definitions.set(definition.name, definition);
  },

  getDefinitions: (): Array<FunctionDefinition> => {
    return Array.from(functionCaller.definitions.values());
  },

  async call(name: string, args: unknown): Promise<unknown> {
    const definition = functionCaller.definitions.get(name);
    if (!definition) {
      throw new Error(`Function "${name}" not found`);
    }

    try {
      const validatedArgs = definition.schema.parse(args);
      const result = await definition.handler(validatedArgs);
      return result;
    } catch (error) {
      console.error(`Error calling function "${name}":`, error);
      throw error instanceof Error
        ? error
        : new Error(`Unknown error in function "${name}"`);
    }
  },
};

// Enhanced default functions
export const registerDefaultFunctions = (): void => {
  functionCaller.register({
    name: 'get_current_time',
    description: 'Get the current time in ISO format',
    schema: z.object({}),
    handler: async () => new Date().toISOString(),
  });

  functionCaller.register({
    name: 'parse_json',
    description: 'Parse and validate JSON string',
    schema: z.object({
      input: z.string(),
      schema: z.any().optional(),
    }),
    handler: async ({ input, schema }) => {
      const parsed = JSON.parse(input);
      return schema ? z.any().parse(parsed) : parsed;
    },
  });
};

const env = GenkitEnvSchema.parse(process.env);

const cache = new LRUCache<string, GenkitResponse>({
  max: cacheConfig.maxSize,
  ttl: cacheConfig.ttl,
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

export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'genkit',
      fileName: (format) => `genkit.${format}.js`,
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
});

export const genkitConfigSchema = GenkitConfigSchema;

interface LoaderData {
  configured: boolean;
  projectId: string | null;
}

interface ActionData {
  response?: ProcessResponse;
  error?: string;
}

export const loader: LoaderFunction = async () => {
  try {
    await genkitClient.initializeServer();
    return json<LoaderData>({
      configured: true,
      projectId: genkitClient.getConfig().projectId,
    });
  } catch (error) {
    return json<LoaderData>({ configured: false, projectId: null });
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const text = formData.get('text');
  const temperature = formData.get('temperature');
  const maxTokens = formData.get('maxTokens');

  if (!text || typeof text !== 'string') {
    return json({ error: 'Text is required' }, { status: 400 });
  }

  try {
    const config: GenerationConfig = {
      temperature: 0.7,
      maxTokens: 1024, // Default value
    };

    if (temperature && typeof temperature === 'string') {
      const parsedTemp = parseFloat(temperature);
      if (!isNaN(parsedTemp) && parsedTemp >= 0 && parsedTemp <= 1) {
        config.temperature = parsedTemp;
      }
    }

    if (
      maxTokens &&
      (typeof maxTokens === 'string' || typeof maxTokens === 'number')
    ) {
      const parsedTokens = parseInt(String(maxTokens), 10);
      if (!isNaN(parsedTokens) && parsedTokens > 0) {
        config.maxTokens = parsedTokens;
      }
    }

    const response = await genkitClient.generate(text, config);

    if (!response.success) {
      throw new Error(response.error?.message || 'Generation failed');
    }

    return json({
      response: {
        text: response.data!,
        confidence: 1.0,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    );
  }
};

export default function Genkit() {
  const { configured } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isProcessing = navigation.state === 'submitting';

  if (!configured) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900">
        <p className="text-red-600 dark:text-red-200">Configuration error</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Genkit AI Processing
      </h1>

      <Form method="post" className="space-y-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              Input Text
            </span>
            <textarea
              name="text"
              rows={6}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              disabled={isProcessing}
              required
              placeholder="Enter text to process..."
            />
          </label>

          <div className="flex space-x-4">
            <label className="block">
              <span className="text-gray-700 dark:text-gray-200 text-sm">
                Temperature
              </span>
              <input
                type="number"
                name="temperature"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.7"
                className="mt-1 block w-24 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                disabled={isProcessing}
              />
            </label>

            <label className="block">
              <span className="text-gray-700 dark:text-gray-200 text-sm">
                Max Tokens
              </span>
              <input
                type="number"
                name="maxTokens"
                min="1"
                max="4096"
                defaultValue="1024"
                className="mt-1 block w-32 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                disabled={isProcessing}
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-3 px-4 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Processing...' : 'Process Text'}
        </button>
      </Form>

      {actionData?.error && (
        <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg">
          <p className="text-red-600 dark:text-red-200">{actionData.error}</p>
        </div>
      )}

      {actionData?.response && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Result
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {actionData.response.text}
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Confidence: {(actionData.response.confidence * 100).toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  );
}
