import { z } from 'zod';
import { FunctionDefinition } from './types';

export const functionCaller = {
  definitions: new Map<string, FunctionDefinition>(),

  register: (definition: FunctionDefinition): void => {
    functionCaller.definitions.set(definition.name, definition);
  },

  getDefinitions: (): Array<FunctionDefinition> => {
    return Array.from(functionCaller.definitions.values());
  },

  async call(name: string, args: any): Promise<any> {
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
      throw error;
    }
  },
};

export const registerDefaultFunctions = (): void => {
  functionCaller.register({
    name: 'get_current_time',
    description: 'Get the current time',
    schema: z.object({}),
    handler: async () => {
      return new Date().toISOString();
    },
  });
};

registerDefaultFunctions();
