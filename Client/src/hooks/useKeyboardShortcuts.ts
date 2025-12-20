/** Custom hook for keyboard shortcuts and accessibility.
 *
 * Event handling order is necessary for proper UX:
 *
 * 1. Escape handler - always allows users to exit search/edit modes
 * 2. Input blocking - prevent shortcuts from firing while typing
 * 3. Global shortcuts - allows keyboards to focus search/add inputs
 *
 * This order ensures users can always escape, typing isn't interrupted,
 * and shortcuts work when appropriate.
 */
import { useTodoStore } from '@/stores/todoStore';
import { useEffect } from 'react';
export const useKeyboardShortcuts = () => {
  // zustand state and actions
  const searchTerm = useTodoStore((state) => state.searchTerm);
  const clearSearch = useTodoStore((state) => state.clearSearch);
  const editingTodoId = useTodoStore((state) => state.editingTodoId);
  const setEditingTodoId = useTodoStore((state) => state.setEditingTodoId);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Escape handler
      if (e.key === 'Escape') {
        // if editing, ONLY cancel edit, don't affect search
        if (editingTodoId) {
          e.preventDefault();
          e.stopPropagation(); // add this to stop event propagation;

          // don't check searchTerm at all when editing
        }
        // only check search if NOT editing
        else if (searchTerm) {
          e.preventDefault();
          clearSearch();
        }

        // blur only if not editing
        if (!editingTodoId && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }

      // Input blocker to avoid triggering shortcuts during typing
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // global shortcut - focus search input with '/'
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          '[placeholder*="Search"]'
        );
        searchInput?.focus();
      }

      // global shortcut - add new item with 'n'
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const addInput = document.querySelector<HTMLInputElement>(
          '[placeholder*="Add"]'
        );
        addInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // cleanup event listeners
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [searchTerm, editingTodoId, clearSearch, setEditingTodoId]);
};
