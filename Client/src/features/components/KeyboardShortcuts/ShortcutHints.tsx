// Shows simple keyboard shortcuts as reminders for adding, searching, and canceling actions

export const ShortcutHints = () => {
  return (
    <div
      className="text-xs text-gray-500 mt-1"
      role="complementary"
      aria-label="Quick keyboard shortcuts"
    >
      Press{' '}
      <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">
        n
      </kbd>{' '}
      to add •{' '}
      <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">
        /
      </kbd>{' '}
      to search •{' '}
      <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">
        esc
      </kbd>{' '}
      to cancel
    </div>
  );
};
