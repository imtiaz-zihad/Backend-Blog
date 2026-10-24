"use client";

import { useEffect } from "react";

export default function AboutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Error</h1>
      <p className="text-lg text-gray-600">Failed to load the About page.</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  );
}
