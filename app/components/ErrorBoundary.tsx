import { useRouteError, isRouteErrorResponse } from '@remix-run/react';

export function ErrorBoundary({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  console.error('Error in component tree', error);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4">Oops! An error occurred.</h1>
      <p className="text-lg">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Try again
      </button>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useRouteError();
  let errorMessage;

  if (isRouteErrorResponse(caught)) {
    switch (caught.status) {
      case 500:
        errorMessage = (
          <div className="space-y-2">
            <p className="text-lg">Internal Server Error</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Error ID: {caught.data?.errorId || 'unknown'}
            </p>
          </div>
        );
        break;
      case 404:
        errorMessage = <p className="text-lg">Page Not Found</p>;
        break;
      case 401:
        errorMessage = <p className="text-lg">Unauthorized</p>;
        break;
      default:
        errorMessage = (
          <p className="text-lg">
            {caught.status} {caught.statusText} {caught.data?.message}
          </p>
        );
        break;
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <h1 className="text-3xl font-bold mb-4">Oops!</h1>
        {errorMessage}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md 
                             focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4">Oops!</h1>
      <p className="text-lg">An unexpected error occurred.</p>
    </div>
  );
}
