// Custom hook to set up localStorage for persistence in the future; NOT IN USE
import { type Todo } from '@/api';
import { useEffect } from 'react';

export const useLocalStorage = (todos: Todo[]) => {
  useEffect(() => {
    // save to localStorage whenever todos change
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  // on initial load
  useEffect(() => {
    const stored = localStorage.getItem('todos');

    if (stored) {
      try {
        // will need to sync with backend
        // const parsed = JSON.parse(stored);
        console.log(
          'Found local todos, which will be used to sync with server'
        );
      } catch (e) {
        console.error('Failed to parse stored todos: ', e);
      }
    }
  }, []);
};
