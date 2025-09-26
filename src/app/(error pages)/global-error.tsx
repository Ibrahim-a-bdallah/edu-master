"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Something Went Wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We apologize for the inconvenience. Our team has been notified and
              is working on a fix.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Go to Homepage
              </button>
            </div>

            {/* Technical Details (Optional - for development) */}
            {process.env.NODE_ENV === "development" && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Technical Details
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                  {error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
