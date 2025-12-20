/**
 * Form for adding new todos with keyboard shortcut support (press 'n') managed in KeyboardShortcutsHelp.tsx.
 *
 * Features:
 * - Validation: Required field, 1-100 character limit
 * - Keyboard: Quick access via 'n' key, Enter to submit
 * - Accessibility: Screen reader announcements on submit.
 * - UX enhancement: smooths out error message transitions
 */

import { useCreateMutation } from '@/hooks';
import { announceToScreenReader } from '@/utils/accessibility';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
interface FormData {
  title: string;
}

export const AddTodo = () => {
  const createMutation = useCreateMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await createMutation.mutate(
      { title: data.title },
      {
        onSuccess: () => {
          reset();
          inputRef.current?.focus(); // focus back on input after adding
        },
      }
    );
    announceToScreenReader(`Task "${data.title}" added`);
  };

  // destructure register to get the ref separately
  const { ref: registerRef, ...registerProps } = register('title', {
    required: 'Task title is required',
    minLength: {
      value: 1,
      message: 'Title must be at least 1 character',
    },
    maxLength: {
      value: 100,
      message: 'Title must be less than 100 characters',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
      <div className="flex gap-2">
        <input
          {...registerProps}
          ref={(e) => {
            // combine both refs
            registerRef(e);
            inputRef.current = e;
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              reset();
              e.currentTarget.blur();
            }
          }}
          type="text"
          placeholder="Add a new task..."
          className="
            flex-1 px-4 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
          "
          disabled={createMutation.isPending}
        />
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="
            px-6 py-2 bg-blue-500 text-white rounded-lg
            hover:bg-blue-600 disabled:bg-gray-300
            disabled:cursor-not-allowed transition-colors
          "
        >
          Add
        </button>
      </div>

      {/* reserves space for an error to smooth out error message transitions */}
      <div className="h-5 mt-1">
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>
    </form>
  );
};
