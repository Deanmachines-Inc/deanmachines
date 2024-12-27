import { z } from 'zod';
import { googleClient } from './genkit-conf';
import { GenkitConfig } from './client';
import { GenkitConfigError } from './client';
import { GenkitModelSettings } from './settings';

export class EmbeddingService {
  private readonly config: Readonly<GenkitConfig>;
  private readonly settings: Readonly<GenkitModelSettings>;
  private readonly client;

  constructor(config: GenkitConfig, settings: GenkitModelSettings) {
    this.config = Object.freeze({ ...config });
    this.settings = Object.freeze({ ...settings });
    this.client = googleClient.embeddings;
  }

  async getEmbeddings(text: string): Promise<{ embeddings: number[] }> {
    try {
      const [response] = await this.client.getEmbeddings({
        content: text,
        model: 'textembedding-gecko',
      });
      return response;
    } catch (error) {
      console.error('Error getting embeddings:', error);
      throw new GenkitConfigError('Error getting embeddings');
    }
  }
}
