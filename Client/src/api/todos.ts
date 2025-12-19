import { apiFactory } from './apiFactory';

export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt?: string;
}

const API_URL = 'http://localhost:5209/api/todos'; // matches .NET port
const todoApi = apiFactory<Todo>(API_URL);

export const fetchAllTodos = () => todoApi.get();
export const fetchOne = (id: string) => todoApi.getById(id);
export const createTodo = (data: { title: string }) => todoApi.post(data);
export const updateTodo = (id: string, data: Partial<Todo>) =>
  todoApi.patch(id, data);
export const deleteTodo = (id: string) => todoApi.delete(id);
