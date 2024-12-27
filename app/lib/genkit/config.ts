export const genkitConfig = {
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID!,
  location: process.env.COMPUTE_ZONE ?? 'us-central1',
  credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS!,
  model: process.env.GEMINI_MODEL_NAME ?? 'textembedding-gecko@001',
  cache: {
    enabled: true,
    ttl: 3600,
    maxSize: 100,
  },
};
