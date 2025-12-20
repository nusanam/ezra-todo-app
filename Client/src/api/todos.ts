import { apiFactory, type PaginatedResponse } from './apiFactory';

export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface TodoCounts {
  all: number;
  active: number;
  completed: number;
  archived: number;
}

const API_URL = 'http://localhost:5209/api/todos';
const todoApi = apiFactory<Todo>(API_URL);

export const fetchPaginatedTodos = (
  page: number,
  pageSize?: number,
  status?: string
) => todoApi.getPaginated(page, pageSize, status);

export const fetchCounts = () => todoApi.getCustom<TodoCounts>('/counts');
export const fetchAllTodos = () => todoApi.get();
export const fetchOne = (id: string) => todoApi.getById(id);

export const createTodo = (data: { title: string }) => todoApi.post(data);
export const updateTodo = (id: string, data: Partial<Todo>) =>
  todoApi.patch(id, data);

export const deleteTodo = (id: string) => todoApi.delete(id);

export { type PaginatedResponse };
