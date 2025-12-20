// Dropdown to display keyboard shortcuts for added accessibility for power users and screen readers

import { ChevronDown, ChevronUp, Keyboard } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const KeyboardShortcutsDropdown = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      // check if click was outside dropdownRef.current
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside as any);

    // clean up listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside as any);
    };
  }, [isOpen]);

  const shortcuts = [
    { key: '/', description: 'Focus search' },
    { key: 'n', description: 'Add new task' },
    { key: 'Esc', description: 'Clear search / Cancel edit' },
    { key: 'Enter', description: 'Save task (when editing)' },
    { key: 'Space', description: 'Toggle checkbox' },
    { key: 'Tab', description: 'Navigate forward' },
    { key: 'Shift+Tab', description: 'Navigate backward' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-1 text-xs text-gray-500
          hover:text-gray-700 transition-colors animate-pulse
        "
        aria-label="Toggle keyboard shortcuts help"
        aria-expanded={isOpen}
      >
        <Keyboard className="h-3 w-3" />
        Keyboard Shortcuts
        {isOpen ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>

      {isOpen && (
        <div
          className="
            absolute top-full mt-2 right-0 z-10
            bg-white rounded-lg shadow-lg border border-gray-200
            p-4 min-w-[290px]
          "
          ref={dropdownRef}
          role="region"
          aria-label="Keyboard shortcuts list"
        >
          <h3 className="font-medium text-sm mb-3 text-gray-900">
            Keyboard Shortcuts
          </h3>
          <div className="space-y-2">
            {shortcuts.map(({ key, description }) => (
              <div
                key={key}
                className="flex items-center justify-between text-sm"
              >
                <kbd
                  className="
                    px-2 py-1 bg-gray-100 text-gray-700
                    rounded border border-gray-300 font-mono text-xs
                  "
                >
                  {key}
                </kbd>
                <span className="text-gray-600 ml-3">{description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
