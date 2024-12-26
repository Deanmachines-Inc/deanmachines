import { Form } from '@remix-run/react';

interface PromptFormProps {
  isSubmitting: boolean;
  initialPrompt?: string;
  onSubmit?: (prompt: string) => void;
}

export default function PromptForm({
  isSubmitting,
  initialPrompt = '',
  onSubmit,
}: PromptFormProps) {
  return (
    <Form
      method="get"
      className="mb-4"
      onSubmit={(e) => {
        if (onSubmit) {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onSubmit(formData.get('prompt')?.toString() || '');
        }
      }}
    >
      <div className="space-y-4">
        <textarea
          name="prompt"
          rows={4}
          defaultValue={initialPrompt}
          placeholder="Enter your prompt..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
					disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </Form>
  );
}
