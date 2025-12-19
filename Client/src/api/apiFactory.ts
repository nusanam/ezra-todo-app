// API factory service

/**
 * Handles HTTP response processing with consistent error handling.
 * Throws descriptive errors for non-OK responses.
 * Returns null for 204 No Content responses.
 * Automatically parses JSON for successful responses.
 */
const handleResponse = async <T = unknown>(
  response: Response
): Promise<T | null> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json() as Promise<T>;
};

/**
 * Converts object of query parameters to URLSearchParams.
 * Handles string, number, and boolean values by converting all to strings.
 *
 * @example
 * mapQueryParams({ status: 'active', limit: 10 })
 * // Returns URLSearchParams: "status=active&limit=10"
 */
const mapQueryParams = (query: Record<string, string | number | boolean>) => {
  return new URLSearchParams(
    Object.entries(query).map(([k, v]) => [k, String(v)])
  );
};

/**
 * Generic API factory for creating type-safe HTTP client methods with consistent * error handling
 *
 * @param baseUrl - The base API endpoint (ie: '/api/todos')
 * @returns Object with get, getById, post, patch, delete methods
 *
 * @example
 * const todoApi = apiFactory<Todo>('/api/todos');
 * const todos = await todoApi.get();
 * const newTodo = await todoApi.post({ title: 'New task' });
 */
export const apiFactory = <T = unknown>(baseUrl: string) => {
  const get = async (
    query?: Record<string, string | number | boolean>
  ): Promise<T[]> => {
    const url = query ? `${baseUrl}?${mapQueryParams(query)}` : baseUrl;
    const response = await fetch(url);
    const result = await handleResponse<T[]>(response);
    return result ?? [];
  };

  const getById = async (id: string): Promise<T | null> => {
    const response = await fetch(`${baseUrl}/${id}`);
    return handleResponse<T>(response);
  };

  const post = async <TBody extends Record<string, unknown>>(
    body: TBody
  ): Promise<T> => {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const result = await handleResponse<T>(response);
    if (!result) throw new Error('Expected response body but got none');
    return result;
  };

  const patch = async <TBody extends Record<string, unknown>>(
    id: string,
    body: TBody
  ): Promise<T> => {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const result = await handleResponse<T>(response);
    if (!result) throw new Error('Expected response body but got none');
    return result;
  };

  const del = async (id: string): Promise<void> => {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
    await handleResponse(response);
  };

  return { get, getById, post, patch, delete: del };
};
