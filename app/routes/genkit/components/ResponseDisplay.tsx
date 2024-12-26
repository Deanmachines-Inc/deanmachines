import { useLoaderData } from '@remix-run/react';

interface ResponseData {
  text: string;
  confidence: number;
}

export default function ResponseDisplay() {
  const data = useLoaderData<ResponseData>();

  if (!data) {
    return null;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Response
      </h2>
      <p className="text-gray-700 dark:text-gray-300">{data.text}</p>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Confidence: {(data.confidence * 100).toFixed(1)}%
      </div>
    </div>
  );
}
