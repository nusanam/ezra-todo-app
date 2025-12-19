/** Creates various loading displays for different UI needs:

  *  UI skeleton for todo list loading state
  *  Animated dots variant for inline loading states
  *  Centered spinner variant for general loading states
*/

import { LoadingSpinner } from './LoadingSpinner';

interface LoadingStateProps {
  message?: string;
  variant?: 'skeleton' | 'spinner' | 'dots';
}

export const LoadingState = ({
  message = 'Loading...',
  variant = 'skeleton',
}: LoadingStateProps) => {
  if (variant === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="xl" className="text-blue-600" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex space-x-2">
          <div
            className="h-3 w-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="h-3 w-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <div
            className="h-3 w-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    );
  }

  // Default skeleton variant - good for todo list loading
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="space-y-3">
        {/* Skeleton for filter tabs */}
        <div className="flex gap-2 mb-4">
          <div className="h-10 w-20 bg-gray-200 animate-pulse rounded" />
          <div className="h-10 w-20 bg-gray-200 animate-pulse rounded" />
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
        </div>

        {/* Skeleton for todo items */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 bg-gray-200 animate-pulse rounded" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2 mt-2" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded" />
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
