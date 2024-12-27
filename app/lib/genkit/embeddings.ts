import { VertexAI } from '@google-cloud/aiplatform';
import { z } from 'zod';

// Validation schema for configuration
const configSchema = z.object({
  projectId: z.string(),
  location: z.string().default('us-central1'),
  modelId: z.string().default('textembedding-gecko@001'),
});

interface EmbeddingResponse {
  embeddings: number[];
  error?: string;
}

/**
 * Service for handling text embeddings using Vertex AI
 */
export class EmbeddingService {
  private readonly vertexai: VertexAI;
  private readonly modelId: string;

  constructor(config: z.infer<typeof configSchema>) {
    const validated = configSchema.parse(config);
    this.vertexai = new VertexAI({
      projectId: validated.projectId,
      location: validated.location,
    });
    this.modelId = validated.modelId;
  }

  /**
   * Get embeddings for input text
   */
  async getEmbeddings(text: string): Promise<EmbeddingResponse> {
    try {
      const model = await this.vertexai.getModel(this.modelId);
      const response = await model.predict({
        instances: [{ content: text }],
      });

      return {
        embeddings: response[0],
      };
    } catch (error) {
      console.error('Embedding error:', error);
      return {
        embeddings: [],
        error: 'Failed to generate embeddings',
      };
    }
  }
}
