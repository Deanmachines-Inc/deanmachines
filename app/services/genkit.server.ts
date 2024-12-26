import { google } from '@genkit-ai/core';

interface GenkitClientConfig {
  projectId: string;
  credentials?: {
    client_email?: string;
    private_key?: string;
  };
}

interface ProcessResponse {
  text: string;
  confidence: number;
  timestamp: string;
}

/**
 * Server-side Genkit client initialization
 */
export class GenkitService {
  private static instance: GenkitService;
  private readonly client;

  private constructor(config: GenkitClientConfig) {
    this.client = google({
      projectId: config.projectId,
      credentials: config.credentials,
    });
  }

  public static initialize(config: GenkitClientConfig): GenkitService {
    if (!GenkitService.instance) {
      GenkitService.instance = new GenkitService(config);
    }
    return GenkitService.instance;
  }

  public static getInstance(): GenkitService {
    if (!GenkitService.instance) {
      throw new Error('GenkitService must be initialized first');
    }
    return GenkitService.instance;
  }

  /**
   * Process text using Genkit AI
   */
  public async processText(input: string): Promise<ProcessResponse> {
    try {
      const response = await this.client.generate({
        text: input,
        maxTokens: 1024,
        temperature: 0.7,
      });

      return {
        text: response.text,
        confidence: response.confidence || 0,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Genkit processing error:', error);
      throw new Error('Failed to process text');
    }
  }

  /**
   * Check service health
   */
  public async healthCheck(): Promise<boolean> {
    try {
      await this.client.validate();
      return true;
    } catch {
      return false;
    }
  }
}

export type { GenkitClientConfig, ProcessResponse };
