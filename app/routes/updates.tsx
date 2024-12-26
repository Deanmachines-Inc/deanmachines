import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react"; // Added Link import
import { useState, useCallback } from "react";
import '../styles/index.css';

/**
 * Represents a single update entry in the changelog
 */
interface Update {
  id: string;
  title: string;
  date: string;
  description: string;
  details: string;
  version?: string;
  category?: "feature" | "fix" | "improvement";
}

/**
 * Loader function to fetch updates data
 */
export async function loader({}: LoaderFunctionArgs) {
  // TODO: Replace with actual data fetching
  const updates: Update[] = [
    {
      id: "1",
      title: "Initial Release",
      date: "2024-03-01",
      description: "First version of the FPV data analysis system",
      details: "Introducing core features including data import, basic analysis, and visualization tools.",
      version: "1.0.0",
      category: "feature"
    },
    {
      id: "2",
      title: "Performance Improvements",
      date: "2024-03-15",
      description: "Major performance enhancements for data processing",
      details: "Optimized data processing algorithms and improved UI responsiveness.",
      version: "1.1.0",
      category: "improvement"
    }
  ];

  return json({ updates });
}

export default function Updates() {
  const { updates } = useLoaderData<typeof loader>();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpansion = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">
        Latest Updates
      </h1>
      
      <div className="space-y-6">
        {updates.map((update) => (
          <div
            key={update.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {update.title}
                </h2>
                <div className="flex items-center space-x-4">
                  {update.version && (
                    <span className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      v{update.version}
                    </span>
                  )}
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {update.date}
                  </time>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {update.description}
              </p>

              <button
                onClick={() => toggleExpansion(update.id)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-expanded={expandedIds.has(update.id)}
              >
                {expandedIds.has(update.id) ? (
                  <>
                    <span>Show Less</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Show More</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>

              {expandedIds.has(update.id) && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300">
                    {update.details}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/"
        className="mt-8 inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
        Error Loading Updates
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        There was a problem loading the updates. Please try again later.
      </p>
    </div>
  );
}