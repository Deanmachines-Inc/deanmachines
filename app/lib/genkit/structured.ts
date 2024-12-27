import { z } from 'zod';

export const createStructuredPrompt = (
  options: { schema: z.ZodObject<any>; functions?: GenkitFunction[] },
  prompt: string
): string => {
  const { schema, functions } = options;
  const schemaString = JSON.stringify(schema.shape, null, 2);
  const functionDefinitions = functions
    ? functions.map((func) => func.definition).join('\n')
    : '';

  return `
  You are a helpful AI assistant.  You will receive a prompt and must respond in a structured JSON format.  The schema for the response is:

  \`\`\`json
  ${schemaString}
  \`\`\`

  ${
    functions
      ? `The following functions are available to you.  Use them to answer the prompt accurately.

  \`\`\`javascript
  ${functionDefinitions}
  \`\`\`
  `
      : ''
  }

  Prompt: ${prompt}
  `;
};

export const validateStructuredOutput = <T>(
  output: unknown,
  schema: z.ZodSchema<T>
): T => {
  try {
    return schema.parse(output);
  } catch (error) {
    console.error('Invalid structured output:', error);
    throw new Error('Invalid structured output');
  }
};

export type GenkitFunction = {
  definition: string;
};
