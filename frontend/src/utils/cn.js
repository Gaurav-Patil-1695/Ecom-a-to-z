/**
 * Classname utility that merges conditional Tailwind CSS classes.
 *
 * Combines clsx (for conditional class composition) with tailwind-merge
 * (to resolve conflicting Tailwind utility classes correctly).
 *
 * @param {...import('clsx').ClassValue} inputs - Any number of class values accepted by clsx.
 * @returns {string} A single merged className string with Tailwind conflicts resolved.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'px-6')
 * // => 'py-2 bg-blue-500 px-6'  (px-4 is overridden by px-6 via tailwind-merge)
 */
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

export default cn;
