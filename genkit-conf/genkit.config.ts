import { defineConfig } from 'vite';
import { GenkitConfigSchema } from './types';
import { configureGenkit } from '@genkit-ai/core';
import { googleAI, geminiPro } from '@genkit-ai/google-ai';

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

export const genkitConfig = configureGenkit({
  plugins: [googleAI()],
  model: geminiPro,
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
