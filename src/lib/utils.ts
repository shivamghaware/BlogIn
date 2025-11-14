
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string) => {
  if(!name) return '';
  const [firstName, lastName] = name.split(' ');
  return firstName && lastName ? `${firstName[0]}${lastName[0]}` : name.substring(0, 2);
};
