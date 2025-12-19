/** Displays error states in various formats based on context (simple, detailed, network) with options to retry:

  * Simple: basic error message with retry and reload options
  * Network: specialized message for connectivity issues
  * Detailed: shows technical details in expandable section for debugging
*/
import { Button } from '@/components/Button';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

interface ErrorStateProps {
  error: Error | unknown;
  onRetry?: () => void;
  variant?: 'simple' | 'detailed' | 'network';
}

export const ErrorState = ({
  error,
  onRetry,
  variant = 'simple',
}: ErrorStateProps) => {
  const errorMessage =
    error instanceof Error ? error.message : 'An unexpected error occurred';
  const isNetworkError =
    errorMessage.toLowerCase().includes('network') ||
    errorMessage.toLowerCase().includes('fetch');

  // error logging for dev
  console.error('Application error:', error);

  if (variant === 'network' || isNetworkError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <WifiOff className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Connection Problem
        </h2>
        <p className="text-gray-600 text-center max-w-md mb-4">
          Unable to connect to the server. Please check your internet connection
          and try again.
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="primary"
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 mr-3" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-red-900 mb-2">
                Something went wrong
              </h2>
              <p className="text-red-700 mb-4">{errorMessage}</p>

              <details className="mb-4">
                <summary className="cursor-pointer text-sm text-red-600 hover:text-red-700 underline">
                  Show technical details
                </summary>
                <pre className="mt-2 text-xs bg-red-100 p-3 rounded overflow-auto max-h-40">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </details>

              <div className="flex gap-2">
                {onRetry && (
                  <Button
                    onClick={onRetry}
                    variant="danger"
                    leftIcon={<RefreshCw className="h-4 w-4" />}
                  >
                    Try Again
                  </Button>
                )}
                <Button
                  onClick={() => window.location.reload()}
                  variant="secondary"
                >
                  Reload Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // default variant (simple)
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-red-50 rounded-full p-3 mb-4">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-gray-600 text-center max-w-md mb-4">{errorMessage}</p>
      <div className="flex gap-2">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="primary"
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Try Again
          </Button>
        )}
        <Button onClick={() => window.location.reload()} variant="ghost">
          Reload Page
        </Button>
      </div>
    </div>
  );
};
