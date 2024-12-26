import { google, embedding } from '@genkit-ai/core';
import type { GenkitConfig } from '~/lib/genkit/client';
import { LRUCache } from 'lru-cache';

export class EmbeddingService {
  private cache: LRUCache<string, Float32Array>;
  private embedder;

  constructor(config: GenkitConfig) {
    this.embedder = google({
      projectId: config.projectId,
      location: config.location,
      credentials: config.credentials,
    }).embedding('embedding-001');

    this.cache = new LRUCache({
      max: config.cache?.maxSize || 100,
      ttl: (config.cache?.ttl || 3600) * 1000,
    });
  }

  async embed(text: string): Promise<Float32Array> {
    const cacheKey = `emb:${text}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const response = await this.embedder.embed(text);
    this.cache.set(cacheKey, response.embedding);

    return response.embedding;
  }

  async embedBatch(texts: string[]): Promise<Float32Array[]> {
    return Promise.all(texts.map((text) => this.embed(text)));
  }
}
