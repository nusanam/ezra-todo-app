import { NotificationContainer } from '@/components';
import { TodoListContainer } from '@/features/components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (was cacheTime, now gcTime in v5)
      refetchOnWindowFocus: false, // Disable refetch on window focus
    },
    mutations: {
      retry: 1,
    },
  },
});

// when scaling app, consider adding ErrorBoundary class component to catch errors with dynamic content or any third party libraries that crash
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoListContainer />
      <NotificationContainer />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
