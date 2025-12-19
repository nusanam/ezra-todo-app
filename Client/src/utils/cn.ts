// classname utility for merging classes
// for production, replace file with clsx + tailwind-merge

type ClassValue =
  | string
  | number
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | string | number>;

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'number') {
      classes.push(input.toString());
    } else if (Array.isArray(input)) {
      classes.push(cn(...input));
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  // remove duplicates and join
  return [...new Set(classes)].join(' ');
}

// Alternative: If you have clsx and tailwind-merge installed:
// import { clsx, type ClassValue } from 'clsx';
// import { twMerge } from 'tailwind-merge';
//
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }
