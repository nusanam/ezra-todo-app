// For accessibility: user can navigate to todo item using tab or shift + tab and toggle complete/incomplete using the spacebar

interface CheckboxButtonProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  ariaLabel: string;
}

export const CheckboxButton = ({
  checked,
  onChange,
  disabled = false,
  ariaLabel,
}: CheckboxButtonProps) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="
        h-5 w-5 rounded border-gray-300 text-blue-600
        focus:ring-blue-500 disabled:opacity-50
        disabled:cursor-not-allowed
      "
      aria-label={ariaLabel}
    />
  );
};
