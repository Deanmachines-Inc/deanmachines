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
import { GenkitService, type ProcessResponse } from '~/services/genkit.server';

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
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    if (!projectId) throw new Error('Project ID not configured');

    GenkitService.initialize({
      projectId,
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
    });

    return json<LoaderData>({ configured: true, projectId });
  } catch (error) {
    return json<LoaderData>({ configured: false, projectId: null });
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const text = formData.get('text');

  if (!text || typeof text !== 'string') {
    return json<ActionData>({ error: 'Text is required' }, { status: 400 });
  }

  try {
    const service = GenkitService.getInstance();
    const response = await service.processText(text);
    return json<ActionData>({ response });
  } catch (error) {
    return json<ActionData>({ error: 'Processing failed' }, { status: 500 });
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
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 
                dark:border-gray-600 dark:text-gray-100"
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
                className="mt-1 block w-24 rounded-lg border-gray-300 shadow-sm
                  focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800
                  dark:border-gray-600 dark:text-gray-100"
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
                className="mt-1 block w-32 rounded-lg border-gray-300 shadow-sm
                  focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800
                  dark:border-gray-600 dark:text-gray-100"
                disabled={isProcessing}
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-3 px-4 rounded-lg bg-blue-500 text-white font-medium
            hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors"
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
