import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to get the next occurrence of a specific day of the week at a specific hour
export function getNextDayOfWeek(
  date: Date,
  dayOfWeek: number,
  hour: number,
): Date {
  const resultDate = new Date(date.getTime());
  resultDate.setDate(date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7));

  // If it's the same day but before the specified hour, use today
  if (resultDate.getDay() === date.getDay() && date.getHours() < hour) {
    resultDate.setDate(date.getDate());
  }

  // Set to noon
  resultDate.setHours(hour, 0, 0, 0);

  return resultDate;
}
